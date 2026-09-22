import { Transform } from 'node:stream';
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
export default function runCollector(): Transform;
