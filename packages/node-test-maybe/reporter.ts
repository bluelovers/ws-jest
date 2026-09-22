import {
	Transform,
	type TransformCallback,
} from 'node:stream';

/**
 * Tag used to mark a test as a "maybe" test.
 */
export const MAYBE_TAG = 'maybe' as const;

/**
 * Human-readable prefix appended to the test name by `node-test-maybe`.
 */
export const MAYBE_PREFIX = '[maybe] ' as const;

export interface MaybeTestState
{
	name: string;
	maybe: boolean;
	todo?: boolean | string;
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
 * Create a custom reporter `Transform` stream.
 *
 * The reporter:
 *
 * - prints `◌ MAYBE` for maybe tests (pass or fail),
 * - prints `✔` for normal passes and `✖ FAIL` for normal failures,
 * - tracks per-test metadata by `testId` so parallel tests stay correct,
 * - prints a summary with a dedicated `Maybe` line.
 *
 * The returned stream is accepted by `stream.compose`, so it can be passed
 * to `node --test --test-reporter=./this-file`.
 */
export function createReporter(): Transform
{
	const tests = new Map<number | string, MaybeTestState>();
	let maybePassed = 0;
	let maybeFailed = 0;
	let summaryPrinted = false;

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
						this.push(`  ${event.data?.message ?? ''}\n`);
						callback();
						return;

					case 'test:stdout':
					case 'test:stderr':
						this.push(event.data?.message ?? '');
						callback();
						return;

					case 'test:summary':
					{
						// Node may deliver the summary event more than once in
						// some configurations; print it only once.
						if (summaryPrinted)
						{
							callback();
							return;
						}

						summaryPrinted = true;

						const maybeTotal = maybePassed + maybeFailed;

						// Only the `Maybe` breakdown is unique to this reporter;
						// the standard Total/Passed/Failed counts are already
						// printed by Node's built-in summary, so repeating them
						// here would only add noise.
						if (maybeTotal > 0)
						{
							this.push(
								`\nMaybe: ${maybeTotal} (passed: ${maybePassed}, failed: ${maybeFailed})\n`,
							);
						}

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
export default createReporter();
