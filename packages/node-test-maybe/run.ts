import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveReporterOptions, formatSummary, type ReporterOptions } from './reporter.ts';

const execFileAsync = promisify(execFile);
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
 * 3. a bare `tsx` on `PATH` (e.g. when run via pnpm scripts).
 */
function resolveTsxBin(): string
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

	return findPnpmTsxBin() ?? 'tsx';
}

/**
 * Structured, maybe-aware result returned by {@link runMaybe}.
 */
export interface MaybeRunSummary
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

export interface RunMaybeOptions
{
	/**
	 * When `true`, do not print the compact maybe-aware summary. Defaults to
	 * `false` (print via {@link formatSummary} to `output`).
	 */
	silent?: boolean;
	/** Reporter tuning (e.g. `showZero`). Falls back to env / built-in defaults. */
	reporterOptions?: Partial<ReporterOptions>;
	/** Working directory for the spawned test runner. Defaults to `process.cwd()`. */
	cwd?: string;
	/**
	 * Stream the final report text is written to when not `silent`. Defaults to
	 * `process.stdout`. Useful for tests that capture the report.
	 */
	output?: NodeJS.WritableStream;
}

/**
 * Run tests through Node's native test runner (the `node:test` `run()` entry
 * point) and resolve a maybe-aware {@link MaybeRunSummary}.
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
	options: RunMaybeOptions = {},
): Promise<MaybeRunSummary>
{
	const collectorPath = pathToFileURL(fileURLToPath(new URL('./run-collector.ts', import.meta.url))).href;
	const tsxBin = resolveTsxBin();

	const reporterArgs: string[] = [`--test-reporter=${collectorPath}`, '--test'];

	if (Array.isArray(runOptions.files) && runOptions.files.length > 0)
	{
		reporterArgs.push(...runOptions.files);
	}

	// A resolved path is invoked as `node <tsx-cli> …`; otherwise `tsx` is
	// expected on PATH (e.g. inside pnpm scripts).
	const [command, spawnArgs] = tsxBin === 'tsx'
		? ['tsx', reporterArgs]
		: [process.execPath, [tsxBin, ...reporterArgs]];

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

	console.log(command, spawnArgs, options);

	const { stdout } = await execFileAsync(command, spawnArgs, {
		cwd: options.cwd ?? process.cwd(),
		env: childEnv,
	});

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

function parseSummary(stdout: string): MaybeRunSummary
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
			const value = JSON.parse(lines[i]!) as Partial<MaybeRunSummary>;
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

function normalize(value: Partial<MaybeRunSummary>): MaybeRunSummary
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
