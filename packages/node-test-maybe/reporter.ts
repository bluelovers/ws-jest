import {
	Transform,
	type TransformCallback,
} from 'node:stream';

// The only logic genuinely shared with the `maybe` API (`index.ts`) is the
// maybe tag/prefix contract, which lives in `lib/constants.ts`.
import { MAYBE_TAG, MAYBE_PREFIX } from './lib/constants.ts';

/**
 * Keywords used by Node's built-in summary, which is streamed to the reporter
 * as a sequence of `test:diagnostic` messages (`"tests 24"`, `"pass 19"`,
 * `"fail 0"`, … `"duration_ms 300"`). The final `duration_ms` line marks the
 * end of the summary block.
 */
const SUMMARY_KEYWORDS = [
	'tests',
	'suites',
	'pass',
	'fail',
	'cancelled',
	'skipped',
	'todo',
	'duration_ms',
] as const;

export interface MaybeTestState
{
	name: string;
	maybe: boolean;
	todo?: boolean | string;
}

/**
 * Tuning knobs for the reporter.
 *
 * - `maybeOnly`: only emit the `◌ MAYBE` marker for maybe tests and pass every
 *   other message type (stdout/stderr/diagnostics/watch) through unchanged.
 *   Normal `✔`/`✖ FAIL` lines for non-maybe tests are NOT added, so the report
 *   stays focused on maybe results without mutating the other original output.
 * - `showZero`: opt *in* to listing zero-value summary lines. By default (`false`)
 *   every `0` count is hidden — this is the intended default, and it is
 *   independent of `maybe` (it applies uniformly to the standard breakdown).
 */
export interface ReporterOptions
{
	maybeOnly?: boolean;
	showZero?: boolean;
}

/**
 * Built-in defaults used when neither an explicit option nor an env var is set.
 */
export const DEFAULT_REPORTER_OPTIONS: Required<ReporterOptions> = {
	maybeOnly: false,
	showZero: false,
};

/**
 * Environment variable names consulted by {@link resolveReporterOptions}.
 *
 * They are exposed so callers can document / override them consistently.
 */
export const REPORTER_ENV_KEYS = {
	maybeOnly: 'NODE_TEST_MAYBE_REPORTER_MAYBE_ONLY',
	showZero: 'NODE_TEST_MAYBE_REPORTER_SHOW_ZERO',
} as const;

/**
 * Parse a string into a boolean, recognising the common truthy/falsy tokens.
 *
 * Returns `undefined` when the input is `undefined`/`null`/empty so the caller
 * can fall through to the next configuration source.
 */
export function parseBoolEnv(value: string | undefined | null): boolean | undefined
{
	if (value == null || value.length === 0)
	{
		return undefined;
	}

	const v = value.trim().toLowerCase();

	if (['1', 'true', 'yes', 'on', 'y', 't'].includes(v))
	{
		return true;
	}

	if (['0', 'false', 'no', 'off', 'n', 'f'].includes(v))
	{
		return false;
	}

	return undefined;
}

/**
 * Resolve the effective reporter options.
 *
 * Priority (highest first):
 *
 * 1. `explicit`  – options passed directly to the API (a programmatic caller
 *                  always wins, e.g. `createReporter({ maybeOnly: true })`).
 * 2. environment – the vars in {@link REPORTER_ENV_KEYS}.
 * 3. `envDefaults` – defaults supplied by a canned preset such as the minimal
 *                  reporter, so env vars can still override them.
 * 4. {@link DEFAULT_REPORTER_OPTIONS}.
 */
export function resolveReporterOptions(
	explicit: Partial<ReporterOptions> = {},
	envDefaults: Partial<ReporterOptions> = {},
): Required<ReporterOptions>
{
	const env = process.env;

	const maybeOnly = explicit.maybeOnly
		?? parseBoolEnv(env[REPORTER_ENV_KEYS.maybeOnly])
		?? envDefaults.maybeOnly
		?? DEFAULT_REPORTER_OPTIONS.maybeOnly;

	const showZero = explicit.showZero
		?? parseBoolEnv(env[REPORTER_ENV_KEYS.showZero])
		?? envDefaults.showZero
		?? DEFAULT_REPORTER_OPTIONS.showZero;

	return {
		maybeOnly: Boolean(maybeOnly),
		showZero: Boolean(showZero),
	};
}

/**
 * Minimal structural view of a Node test-runner reporter event.
 *
 * Only the fields used by this reporter are declared; the real Node events
 * carry additional data which is ignored.
 */
export interface ReporterEvent
{
	type: string;
	data?: {
		testId?: number | string;
		name?: string;
		tags?: string[];
		todo?: boolean | string;
		details?: {
			duration_ms?: number;
			error?: Error | { stack?: string; message?: string };
		};
		message?: string;
		counts?: {
			total?: number;
			passed?: number;
			failed?: number;
			skipped?: number;
			cancelled?: number;
			[k: string]: number | undefined;
		};
		[k: string]: unknown;
	};
}

/**
 * Decide whether an event belongs to a `maybe` test.
 *
 * Prefers the machine-readable `tags` metadata, and falls back to the
 * human-readable `[maybe] ` name prefix so the reporter also works on the
 * raw test name when tags are unavailable.
 */
export function isMaybeEvent(event: ReporterEvent): boolean
{
	const data = event.data;
	if (!data)
	{
		return false;
	}

	if (Array.isArray(data.tags) && data.tags.includes(MAYBE_TAG))
	{
		return true;
	}

	if (typeof data.name === 'string' && data.name.startsWith(MAYBE_PREFIX))
	{
		return true;
	}

	return false;
}

function displayName(name: string | undefined): string
{
	const n = name ?? '<anonymous>';
	return n.startsWith(MAYBE_PREFIX) ? n.slice(MAYBE_PREFIX.length) : n;
}

function formatDuration(ms: number | undefined): string
{
	if (!Number.isFinite(ms))
	{
		return '';
	}

	if (ms < 1)
	{
		return `${Math.round(ms * 1000)}μs`;
	}

	if (ms < 1000)
	{
		return `${ms.toFixed(1)}ms`;
	}

	return `${(ms / 1000).toFixed(2)}s`;
}

function formatError(error: Error | { stack?: string; message?: string } | undefined): string
{
	if (!error)
	{
		return '';
	}

	const err = error as { stack?: string; message?: string };
	const text = err.stack ?? err.message ?? String(error);

	return String(text)
		.split('\n')
		.map((line) => `    ${line}`)
		.join('\n');
}

/**
 * Build a single, compact summary block from a `test:summary` event's counts.
 *
 * The standard counts (`tests`/`passed`/`failed`/`skipped`/`cancelled`/`todo`)
 * come straight from Node, which already classifies a failing `maybe` test as
 * `todo` rather than `failed`. Any count that is `0` is omitted so the output
 * stays noise-free, and the `Maybe` breakdown (unique to this reporter) is
 * appended.
 */
function formatSummary(
	counts: {
		tests?: number;
		total?: number;
		passed?: number;
		failed?: number;
		skipped?: number;
		cancelled?: number;
		todo?: number;
	},
	maybePassed: number,
	maybeFailed: number,
	options: Required<ReporterOptions>,
): string
{
	const lines: string[] = [];

	// In `maybeOnly` mode the standard breakdown (Tests/Passed/Failed/…) is the
	// reporter's own addition for non-maybe tests, so it is omitted and only the
	// Maybe-specific line remains.
	if (!options.maybeOnly)
	{
		const tests = counts.tests ?? counts.total ?? 0;
		const passed = counts.passed ?? 0;
		const failed = counts.failed ?? 0;
		const skipped = counts.skipped ?? 0;
		const cancelled = counts.cancelled ?? 0;
		const todo = counts.todo ?? 0;

		const add = (label: string, value: number) =>
		{
			// Zero counts are hidden by default; `showZero` opts *in* to listing
			// them (e.g. `Failed: 0`). This is unrelated to `maybe`.
			if (value !== 0 || options.showZero)
			{
				lines.push(`  ${label}: ${value}`);
			}
		};

		add('Tests', tests);
		add('Passed', passed);
		add('Failed', failed);
		add('Cancelled', cancelled);
		add('Skipped', skipped);
		add('TODO', todo);
	}

	// The Maybe breakdown is shown whenever maybe results exist. It can never be
	// `0` in that case, so it is decoupled from `showZero` (a zero total simply
	// means there were no maybe tests, and nothing is printed).
	const maybeTotal = maybePassed + maybeFailed;
	if (maybeTotal > 0)
	{
		lines.push(`  Maybe: ${maybeTotal} (passed: ${maybePassed}, failed: ${maybeFailed})`);
	}

	return lines.length > 0 ? `\n${lines.join('\n')}\n\n` : '';
}

/**
 * Create a custom reporter `Transform` stream.
 *
 * The reporter:
 *
 * - prints `◌ MAYBE` for maybe tests (pass or fail),
 * - prints `✔` for normal passes and `✖ FAIL` for normal failures,
 * - tracks per-test metadata by `testId` so parallel tests stay correct,
 * - prints one summary per test file (once), with a dedicated `Maybe` line.
 *
 * The returned stream is accepted by `stream.compose`, so it can be passed
 * to `node --test --test-reporter=./this-file`.
 */
export function createReporter(
	options: Partial<ReporterOptions> = {},
	envDefaults: Partial<ReporterOptions> = {},
): Transform
{
	const opts = resolveReporterOptions(options, envDefaults);

	const tests = new Map<number | string, MaybeTestState>();
	let maybePassed = 0;
	let maybeFailed = 0;
	const printedFiles = new Set<string>();

	function record(event: ReporterEvent): MaybeTestState
	{
		const data = event.data ?? {};
		const name = data.name ?? '<anonymous>';
		const state: MaybeTestState = {
			name,
			maybe: isMaybeEvent(event),
			todo: data.todo,
		};

		if (data.testId != null)
		{
			tests.set(data.testId, state);
		}

		return state;
	}

	function getState(event: ReporterEvent): MaybeTestState
	{
		const testId = event.data?.testId;

		if (testId != null)
		{
			const existing = tests.get(testId);
			if (existing)
			{
				return existing;
			}
		}

		return record(event);
	}

	const reporter = new Transform({
		writableObjectMode: true,

		transform(
			event: ReporterEvent,
			_encoding: BufferEncoding,
			callback: TransformCallback,
		)
		{
			try
			{
				switch (event.type)
				{
					case 'test:enqueue':
					case 'test:dequeue':
					case 'test:start':
						record(event);
						callback();
						return;

					case 'test:pass':
					{
						const state = getState(event);

						// In `maybeOnly` mode non-maybe results are left untouched
						// (the `✔` line is the reporter's own addition), so we emit
						// nothing and only surface maybe passes.
						if (opts.maybeOnly && !state.maybe)
						{
							callback();
							return;
						}

						const name = displayName(state.name);
						const time = formatDuration(event.data?.details?.duration_ms);

						if (state.maybe)
						{
							maybePassed++;
							this.push(
								`  ◌ MAYBE ${name}${time ? ` (${time})` : ''}\n`,
							);
						}
						else
						{
							this.push(
								`  ✔ ${name}${time ? ` (${time})` : ''}\n`,
							);
						}

						callback();
						return;
					}

					case 'test:fail':
					{
						const state = getState(event);

						// Mirror `test:pass`: in `maybeOnly` mode skip the `✖ FAIL`
						// line (and its stack) for non-maybe tests entirely.
						if (opts.maybeOnly && !state.maybe)
						{
							callback();
							return;
						}

						const name = displayName(state.name);
						const time = formatDuration(event.data?.details?.duration_ms);
						const error = event.data?.details?.error;

						if (state.maybe)
						{
							maybeFailed++;
							this.push(
								`  ◌ MAYBE ${name}${time ? ` (${time})` : ''}\n`,
							);
						}
						else
						{
							this.push(
								`  ✖ FAIL ${name}${time ? ` (${time})` : ''}\n`,
							);
						}

						if (error)
						{
							this.push(`${formatError(error)}\n`);
						}

						callback();
						return;
					}

					case 'test:diagnostic':
					{
						const message = event.data?.message;

						if (typeof message === 'string')
						{
							const keyword = message.split(' ')[0];

							// Node streams its built-in summary as a sequence of
							// `test:diagnostic` messages ("tests 24", "pass 19",
							// …). Those counts are not todo-aware (a failing
							// `maybe` test is miscounted as `fail`), so we ignore
							// them and compute our own summary from the per-test
							// events instead (emitted once at the end).
							if (SUMMARY_KEYWORDS.includes(keyword as (typeof SUMMARY_KEYWORDS)[number]))
							{
								callback();
								return;
							}
						}

						this.push(`  ${message ?? ''}\n`);
						callback();
						return;
					}

					case 'test:stdout':
					case 'test:stderr':
						this.push(event.data?.message ?? '');
						callback();
						return;

					case 'test:summary':
					{
						const file = event.data?.file;

						// Under `tsx`, Node emits one `test:summary` per test
						// file (carrying a `file` path) plus a final root
						// aggregate with `file: undefined`. For a per-file summary
						// (Option B) we print each file's own summary and skip the
						// root aggregate to avoid printing a duplicate.
						if (typeof file !== 'string' || file.length === 0)
						{
							callback();
							return;
						}

						// De-dupe: a given file should produce exactly one summary
						// even if Node delivers its `test:summary` more than once.
						if (printedFiles.has(file))
						{
							callback();
							return;
						}
						printedFiles.add(file);

						const counts = (event.data?.counts ?? {}) as Record<string, number | undefined>;
						this.push(formatSummary(counts, maybePassed, maybeFailed, opts));

						// Reset the `maybe` counters so the next file's summary
						// reflects only that file's `maybe` results, keeping each
						// per-file breakdown accurate.
						maybePassed = 0;
						maybeFailed = 0;

						callback();
						return;
					}

					case 'test:watch:restarted':
						this.push('\n↻ Test run restarted.\n');
						callback();
						return;

					default:
						callback();
				}
			}
			catch (error)
			{
				callback(error as Error);
			}
		},

	});

	return reporter;
}

// Default export: a ready-to-use reporter instance accepted by
// `stream.compose`, so it can be referenced directly by
// `node --test --test-reporter=./this-file`.
//
// Behaviour can be tuned via the env vars documented in
// {@link REPORTER_ENV_KEYS} (e.g. `NODE_TEST_MAYBE_REPORTER_MAYBE_ONLY=1`).
export default createReporter();
