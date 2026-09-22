import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveReporterOptions, formatSummary, type IReporterOptions } from './reporter.ts';
import crossSpawn from 'cross-spawn';

const require = createRequire(import.meta.url);

/**
 * Locate the `tsx` CLI inside a pnpm store (the `node_modules/.pnpm/tsx@*`
 * directory) by scanning upward from this file. This is the same loader the
 * project already uses for `.ts` reporters (`test:node:reporter`), so it reuses
 * the proven mechanism.
 */
function findPnpmTsxBin(): string | null
{
	let dir = dirname(fileURLToPath(import.meta.url));

	for (let i = 0; i < 12; i++)
	{
		const pnpmDir = join(dir, 'node_modules', '.pnpm');

		if (existsSync(pnpmDir))
		{
			for (const name of readdirSync(pnpmDir))
			{
				if (!/^tsx@/.test(name))
				{
					continue;
				}

				const pkgPath = join(pnpmDir, name, 'node_modules', 'tsx', 'package.json');

				if (!existsSync(pkgPath))
				{
					continue;
				}

				const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
					bin?: string | Record<string, string>;
				};
				const bin = typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin?.tsx ?? 'dist/cli.mjs');

				return fileURLToPath(new URL(bin, pathToFileURL(pkgPath)));
			}

			return null;
		}

		const parent = dirname(dir);
		if (parent === dir)
		{
			break;
		}

		dir = parent;
	}

	return null;
}

/**
 * Resolve the `tsx` CLI entry so `runMaybe` can spawn it to run the tests
 * through the `--test-reporter` channel. Resolution order:
 *
 * 1. a normal `tsx/package.json` resolve from this file,
 * 2. scanning the pnpm store,
 * 3. `null` when tsx is genuinely unavailable.
 *
 * Returning `null` (instead of a bare `'tsx'`) is important: a consumer who
 * only writes `.js`/`.mjs` tests and has no TypeScript toolchain should fall
 * back to `node --test` directly, not fail with "tsx: command not found".
 */
function resolveTsxBin(): string | null
{
	try
	{
		const pkgPath = require.resolve('tsx/package.json');
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
			bin?: string | Record<string, string>;
		};
		const bin = typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin?.tsx ?? 'dist/cli.mjs');

		return fileURLToPath(new URL(bin, pathToFileURL(pkgPath)));
	}
	catch
	{
		// ignore and try the pnpm store
	}

	return findPnpmTsxBin() ?? null;
}

/**
 * Structured, maybe-aware result returned by {@link runMaybe}.
 */
export interface IMaybeRunSummary
{
	total: number;
	passed: number;
	failed: number;
	skipped: number;
	cancelled: number;
	/**
	 * Real TODO count: `todo` from Node minus the maybe quantity, because maybe
	 * tests are built on `todo: true` and therefore land inside Node's `todo`
	 * bucket.
	 */
	todo: number;
	maybePassed: number;
	maybeFailed: number;
	maybeTotal: number;
	/** Node's raw `todo` count before the maybe deduction (internal, for printing). */
	rawTodo: number;
	files: string[];
	/** `true` when there are no hard failures (maybe failures are non-blocking). */
	ok: boolean;
}

/**
 * Known runner commands accepted by {@link IRunMaybeOptions}. A plain
 * string (a custom command) may also be passed instead of a {@link EnumRunner} member
 * — e.g. `'bun'` or an absolute path to a runner.
 */
export enum EnumRunner
{
	/** Auto-detect: use `tsx` when resolvable, otherwise `node`. */
	Auto = 'auto',
	/** Always `node` + the built `run-collector.js` collector (no `tsx`). */
	Node = 'node',
	/** Always `tsx`; if genuinely absent the spawn fails naturally. */
	Tsx = 'tsx',
}

export interface IRunMaybeOptions
{
	/**
	 * When `true`, do not print the compact maybe-aware summary. Defaults to
	 * `false` (print via {@link formatSummary} to `output`).
	 */
	silent?: boolean;
	/** Reporter tuning (e.g. `showZero`). Falls back to env / built-in defaults. */
	reporterOptions?: Partial<IReporterOptions>;
	/** Working directory for the spawned test runner. Defaults to `process.cwd()`. */
	cwd?: string;
	/**
	 * Stream the final report text is written to when not `silent`. Defaults to
	 * `process.stdout`. Useful for tests that capture the report.
	 */
	output?: NodeJS.WritableStream;
	/**
	 * Force which test runner command `runMaybe` spawns. Accepts a
	 * {@link EnumRunner} member (`RunnerEnum.Auto`, `RunnerEnum.Node`, `RunnerEnum.Tsx`) or any
	 * other string used verbatim as the command.
	 *
	 * - `RunnerEnum.Auto` (default): use `tsx` when resolvable, otherwise `node`.
	 * - `RunnerEnum.Node`: always `node --test` + the built `run-collector.js`
	 *   collector (no `tsx`, even if `tsx` is installed in the environment).
	 * - `RunnerEnum.Tsx`: always `tsx`; if genuinely absent the spawn fails naturally.
	 * - any other string: used verbatim as the command (e.g. `'bun'`, an absolute
	 *   path to a runner). The built `run-collector.js` collector is used, which
	 *   any node-compatible runner can load natively.
	 */
	runner?: EnumRunner | string;
}

/**
 * Run tests through Node's native test runner (the `node:test` `run()` entry
 * point) and resolve a maybe-aware {@link IMaybeRunSummary}.
 *
 * Because maybe tests are implemented on top of `todo: true`, Node counts them
 * inside its `todo` bucket. This API deducts the maybe quantity from `todo` so
 * the returned `todo` reflects the *real* pending TODOs.
 *
 * Implementation note: in this Node version `run()`'s own returned stream only
 * surfaces summary-level events and does **not** forward per-test
 * `test:pass`/`test:fail` events (which carry the `maybe` tag). The only
 * reliable channel for those is the `--test-reporter` stream, so this function
 * spawns the test runner (`node --test --test-reporter=…`) with a small JSON
 * collector (`run-collector.ts`) and parses its single summary line. The
 * collector logic mirrors {@link isMaybeEvent}.
 *
 * @example
 * ```ts
 * import { runMaybe } from 'node-test-maybe/run';
 *
 * const summary = await runMaybe({ files: ['test/**\/*.node-test.ts'] });
 * if (!summary.ok) process.exitCode = 1;
 * ```
 */
export async function runMaybe(
	runOptions: { files?: string[] } = {},
	options: IRunMaybeOptions = {},
): Promise<IMaybeRunSummary>
{
	const tsxBin = resolveTsxBin();

	// The collector ships as `run-collector.ts` (loaded by `tsx`) and, once the
	// package is built, as `run-collector.js` (loaded natively by `node`).
	const runCollectorTsUrl = pathToFileURL(fileURLToPath(new URL('./run-collector.ts', import.meta.url))).href;
	const runCollectorJsUrl = pathToFileURL(fileURLToPath(new URL('./run-collector.js', import.meta.url))).href;

	// Decide which runner command to spawn. `runner` may be:
	//   - 'auto' (default): use `tsx` when resolvable, else `node`.
	//   - 'node'          : always `node` + the built `run-collector.js`.
	//   - 'tsx'           : always `tsx`; if it is genuinely absent the spawn
	//                       fails naturally, so we do NOT pre-validate/throw.
	//   - any other string: treated verbatim as the command (e.g. 'bun', an
	//                       absolute path). The built `.js` collector is used,
	//                       which any node-compatible runner can load.
	const runnerMode = options.runner ?? EnumRunner.Auto;

	let command: string;
	let tsxCapable: boolean;

	if (runnerMode === EnumRunner.Node)
	{
		command = process.execPath;
		tsxCapable = false;
	}
	else if (runnerMode === EnumRunner.Tsx)
	{
		// No pre-check: when `tsx` is genuinely absent the spawn fails naturally.
		command = tsxBin ?? 'tsx';
		tsxCapable = true;
	}
	else if (runnerMode === EnumRunner.Auto)
	{
		tsxCapable = tsxBin !== null;
		command = tsxBin ?? process.execPath;
	}
	else
	{
		// Explicit command: treated verbatim. Assume it cannot load `.ts`, so the
		// built `.js` collector is used (any node-compatible runner can load it).
		command = runnerMode;
		tsxCapable = false;
	}

	// Pick the collector by which file is actually present:
	//   - `run-collector.ts` exists (dev, possibly before the build) → use it; it
	//     requires a `tsx`-capable runner.
	//   - only `run-collector.js` exists (published packages ship the build, not
	//     the `.ts` source) → use it; `node` and any node-compatible runner load
	//     it natively.
	const tsCollectorFsPath = fileURLToPath(runCollectorTsUrl);
	const jsCollectorFsPath = fileURLToPath(runCollectorJsUrl);
	const tsCollectorExists = existsSync(tsCollectorFsPath);
	const jsCollectorExists = existsSync(jsCollectorFsPath);

	let collectorPath: string;
	if (tsxCapable && tsCollectorExists)
	{
		collectorPath = runCollectorTsUrl;
	}
	else if (jsCollectorExists)
	{
		collectorPath = runCollectorJsUrl;
	}
	else if (tsCollectorExists)
	{
		// Only the `.ts` collector exists, but the chosen runner cannot load it.
		throw new Error(
			`runMaybe: only the TypeScript collector (${tsCollectorFsPath}) is present, `
			+ 'but the selected runner cannot load `.ts`. Use runner: "tsx"/"auto" (needs tsx) '
			+ 'or build the package so run-collector.js is emitted.',
		);
	}
	else
	{
		throw new Error(
			`runMaybe: no test collector found. Looked for ${tsCollectorFsPath} and ${jsCollectorFsPath}. `
			+ 'Build the package (e.g. `tsc` / `pnpm run build`) so run-collector.js is emitted.',
		);
	}

	const reporterArgs: string[] = [`--test-reporter=${collectorPath}`, '--test'];

	if (Array.isArray(runOptions.files) && runOptions.files.length > 0)
	{
		reporterArgs.push(...runOptions.files);
	}

	const spawnArgs: string[] = [command, ...reporterArgs];
	const [tsxCommand, ...tsxArgs] = spawnArgs;

	// When `runMaybe` is itself invoked from inside a running test runner
	// (e.g. a `node:test` test file), the spawned child inherits the parent's
	// `NODE_TEST_*` worker markers. Node would then refuse to run with
	// "run() is being called recursively within a test file", so we strip those
	// markers from the child environment.
	const childEnv: NodeJS.ProcessEnv = { ...process.env };
	for (const key of Object.keys(childEnv))
	{
		if (key.startsWith('NODE_TEST_'))
		{
			delete childEnv[key];
		}
	}

	// `crossSpawn` (the async form) returns a `ChildProcess`, not a promise of
	// `{ stdout }`, so we use its synchronous variant which returns the captured
	// output directly. `encoding: 'utf8'` makes `stdout` a string instead of a
	// Buffer. The collector's JSON summary is the last line of the output, which
	// `parseSummary` extracts regardless of any other runner text.
	const result = crossSpawn.sync(tsxCommand, tsxArgs, {
		cwd: options.cwd ?? process.cwd(),
		env: childEnv,
		encoding: 'utf8',
	});

	if (result.error)
	{
		throw result.error;
	}

	const stdout = typeof result.stdout === 'string'
		? result.stdout
		: (result.stdout?.toString() ?? '');

	const summary = parseSummary(stdout);

	if (!options.silent)
	{
		const reporterOptions = resolveReporterOptions(options.reporterOptions ?? {});
		const text = formatSummary(
			{
				total: summary.total,
				passed: summary.passed,
				failed: summary.failed,
				skipped: summary.skipped,
				cancelled: summary.cancelled,
				todo: summary.rawTodo,
			},
			summary.maybePassed,
			summary.maybeFailed,
			reporterOptions,
		);

		if (text.length > 0)
		{
			(options.output ?? process.stdout).write(text);
		}
	}

	return summary;
}

function parseSummary(stdout: string): IMaybeRunSummary
{
	const lines = stdout
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	// The collector emits a single JSON object as its last non-empty line.
	for (let i = lines.length - 1; i >= 0; i--)
	{
		try
		{
			const value = JSON.parse(lines[i]!) as Partial<IMaybeRunSummary>;
			if (
				value
				&& typeof value === 'object'
				&& typeof value.total === 'number'
			)
			{
				return normalize(value);
			}
		}
		catch
		{
			// not JSON, keep scanning upward
		}
	}

	throw new Error('runMaybe: could not find a JSON summary in the test runner output');
}

function normalize(value: Partial<IMaybeRunSummary>): IMaybeRunSummary
{
	const total = value.total ?? 0;
	const passed = value.passed ?? 0;
	const failed = value.failed ?? 0;
	const skipped = value.skipped ?? 0;
	const cancelled = value.cancelled ?? 0;
	const rawTodo = value.rawTodo ?? value.todo ?? 0;
	const maybePassed = value.maybePassed ?? 0;
	const maybeFailed = value.maybeFailed ?? 0;
	const maybeTotal = value.maybeTotal ?? (maybePassed + maybeFailed);

	return {
		total,
		passed,
		failed,
		skipped,
		cancelled,
		rawTodo,
		todo: Math.max(0, rawTodo - maybeTotal),
		maybePassed,
		maybeFailed,
		maybeTotal,
		files: value.files ?? [],
		ok: value.ok ?? failed === 0,
	};
}

export default runMaybe;
