import { Transform } from 'node:stream';
import { isMaybeEvent } from "./reporter.js";
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
export default function runCollector() {
    const tests = new Map();
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
    const seenFiles = new Set();
    const files = [];
    function record(event) {
        var _a;
        const data = (_a = event.data) !== null && _a !== void 0 ? _a : {};
        const state = { maybe: isMaybeEvent(event) };
        if (data.testId != null) {
            tests.set(data.testId, state);
        }
        return state;
    }
    function getState(event) {
        var _a;
        const testId = (_a = event.data) === null || _a === void 0 ? void 0 : _a.testId;
        if (testId != null) {
            const existing = tests.get(testId);
            if (existing) {
                return existing;
            }
        }
        return record(event);
    }
    return new Transform({
        writableObjectMode: true,
        transform(event, _encoding, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                switch (event.type) {
                    case 'test:enqueue':
                    case 'test:dequeue':
                    case 'test:start':
                        record(event);
                        break;
                    case 'test:pass':
                        {
                            if (getState(event).maybe) {
                                maybePassed++;
                            }
                            break;
                        }
                    case 'test:fail':
                        {
                            if (getState(event).maybe) {
                                maybeFailed++;
                            }
                            break;
                        }
                    case 'test:summary':
                        {
                            const file = (_a = event.data) === null || _a === void 0 ? void 0 : _a.file;
                            // Sum per-file counts (deduped) into the run-wide totals.
                            // The root aggregate (`file: undefined`) is skipped to
                            // avoid double counting, matching the streaming reporter.
                            if (typeof file === 'string' && file.length > 0 && !seenFiles.has(file)) {
                                seenFiles.add(file);
                                files.push(file);
                                const c = ((_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.counts) !== null && _c !== void 0 ? _c : {});
                                sum.total += (_e = (_d = c.total) !== null && _d !== void 0 ? _d : c.tests) !== null && _e !== void 0 ? _e : 0;
                                sum.passed += (_f = c.passed) !== null && _f !== void 0 ? _f : 0;
                                sum.failed += (_g = c.failed) !== null && _g !== void 0 ? _g : 0;
                                sum.skipped += (_h = c.skipped) !== null && _h !== void 0 ? _h : 0;
                                sum.cancelled += (_j = c.cancelled) !== null && _j !== void 0 ? _j : 0;
                                sum.todo += (_k = c.todo) !== null && _k !== void 0 ? _k : 0;
                            }
                            break;
                        }
                    default:
                        break;
                }
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
        flush(callback) {
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
//# sourceMappingURL=run-collector.js.map