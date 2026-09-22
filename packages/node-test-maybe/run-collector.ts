import { Transform } from 'node:stream';

import { isMaybeEvent, type IReporterEvent } from './reporter.ts';

/**
 * `--test-reporter` module consumed by {@link runMaybe} (run.ts).
 *
 * Node's test runner feeds this reporter the *full* event stream, including
 * `test:pass`/`test:fail` events that carry the `maybe` tag. In this Node
 * version `run()`'s own returned stream does not surface those per-test events,
 * which is why {@link runMaybe} spawns the test runner with this reporter rather
 * than calling `run().compose(...)`. The collector emits a single JSON summary
 * line so `runMaybe` can parse it.
 *
 * This file mirrors the per-test bookkeeping in `reporter.ts`
 * (`createReporter`) but outputs a structured summary instead of a human report.
 */
export default function runCollector(): Transform
{
	const tests = new Map<number | string, { maybe: boolean }>();
	let maybePassed = 0;
	let maybeFailed = 0;

	const sum = {
		total: 0,
		passed: 0,
		failed: 0,
		skipped: 0,
		cancelled: 0,
		todo: 0,
	};

	const seenFiles = new Set<string>();
	const files: string[] = [];

	function record(event: IReporterEvent): { maybe: boolean }
	{
		const data = event.data ?? {};
		const state = { maybe: isMaybeEvent(event) };

		if (data.testId != null)
		{
			tests.set(data.testId, state);
		}

		return state;
	}

	function getState(event: IReporterEvent): { maybe: boolean }
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

	return new Transform({
		writableObjectMode: true,

		transform(event: IReporterEvent, _encoding, callback)
		{
			try
			{
				switch (event.type)
				{
					case 'test:enqueue':
					case 'test:dequeue':
					case 'test:start':
						record(event);
						break;

					case 'test:pass':
					{
						if (getState(event).maybe)
						{
							maybePassed++;
						}
						break;
					}

					case 'test:fail':
					{
						if (getState(event).maybe)
						{
							maybeFailed++;
						}
						break;
					}

					case 'test:summary':
					{
						const file = event.data?.file;

						// Sum per-file counts (deduped) into the run-wide totals.
						// The root aggregate (`file: undefined`) is skipped to
						// avoid double counting, matching the streaming reporter.
						if (typeof file === 'string' && file.length > 0 && !seenFiles.has(file))
						{
							seenFiles.add(file);
							files.push(file);

							const c = (event.data?.counts ?? {}) as Record<string, number | undefined>;
							sum.total += c.total ?? c.tests ?? 0;
							sum.passed += c.passed ?? 0;
							sum.failed += c.failed ?? 0;
							sum.skipped += c.skipped ?? 0;
							sum.cancelled += c.cancelled ?? 0;
							sum.todo += c.todo ?? 0;
						}
						break;
					}

					default:
						break;
				}

				callback();
			}
			catch (error)
			{
				callback(error as Error);
			}
		},

		flush(callback)
		{
			const maybeTotal = maybePassed + maybeFailed;

			// Maybe tests are built on `todo: true`, so Node counts them inside
			// the `todo` bucket. Deduct the maybe quantity for the real TODO.
			const todo = Math.max(0, sum.todo - maybeTotal);

			const summary = {
				total: sum.total,
				passed: sum.passed,
				failed: sum.failed,
				skipped: sum.skipped,
				cancelled: sum.cancelled,
				todo,
				maybePassed,
				maybeFailed,
				maybeTotal,
				rawTodo: sum.todo,
				files,
				// A failing maybe is non-blocking, so `ok` tracks hard failures.
				ok: sum.failed === 0,
			};

			this.push(JSON.stringify(summary) + '\n');
			callback();
		},
	});
}
