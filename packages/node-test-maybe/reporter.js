import { Transform, } from 'node:stream';
// The only logic genuinely shared with the `maybe` API (`index.ts`) is the
// maybe tag/prefix contract, which lives in `lib/constants.ts`.
import { MAYBE_TAG, MAYBE_PREFIX } from "./lib/constants.js";
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
];
/**
 * Built-in defaults used when neither an explicit option nor an env var is set.
 */
export const DEFAULT_REPORTER_OPTIONS = {
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
};
/**
 * Parse a string into a boolean, recognising the common truthy/falsy tokens.
 *
 * Returns `undefined` when the input is `undefined`/`null`/empty so the caller
 * can fall through to the next configuration source.
 */
export function parseBoolEnv(value) {
    if (value == null || value.length === 0) {
        return undefined;
    }
    const v = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on', 'y', 't'].includes(v)) {
        return true;
    }
    if (['0', 'false', 'no', 'off', 'n', 'f'].includes(v)) {
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
export function resolveReporterOptions(explicit = {}, envDefaults = {}) {
    var _a, _b, _c, _d, _e, _f;
    const env = process.env;
    const maybeOnly = (_c = (_b = (_a = explicit.maybeOnly) !== null && _a !== void 0 ? _a : parseBoolEnv(env[REPORTER_ENV_KEYS.maybeOnly])) !== null && _b !== void 0 ? _b : envDefaults.maybeOnly) !== null && _c !== void 0 ? _c : DEFAULT_REPORTER_OPTIONS.maybeOnly;
    const showZero = (_f = (_e = (_d = explicit.showZero) !== null && _d !== void 0 ? _d : parseBoolEnv(env[REPORTER_ENV_KEYS.showZero])) !== null && _e !== void 0 ? _e : envDefaults.showZero) !== null && _f !== void 0 ? _f : DEFAULT_REPORTER_OPTIONS.showZero;
    return {
        maybeOnly: Boolean(maybeOnly),
        showZero: Boolean(showZero),
    };
}
/**
 * Decide whether an event belongs to a `maybe` test.
 *
 * Prefers the machine-readable `tags` metadata, and falls back to the
 * human-readable `[maybe] ` name prefix so the reporter also works on the
 * raw test name when tags are unavailable.
 */
export function isMaybeEvent(event) {
    const data = event.data;
    if (!data) {
        return false;
    }
    if (Array.isArray(data.tags) && data.tags.includes(MAYBE_TAG)) {
        return true;
    }
    if (typeof data.name === 'string' && data.name.startsWith(MAYBE_PREFIX)) {
        return true;
    }
    return false;
}
function displayName(name) {
    const n = name !== null && name !== void 0 ? name : '<anonymous>';
    return n.startsWith(MAYBE_PREFIX) ? n.slice(MAYBE_PREFIX.length) : n;
}
function formatDuration(ms) {
    if (!Number.isFinite(ms)) {
        return '';
    }
    if (ms < 1) {
        return `${Math.round(ms * 1000)}μs`;
    }
    if (ms < 1000) {
        return `${ms.toFixed(1)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
}
function formatError(error) {
    var _a, _b;
    if (!error) {
        return '';
    }
    const err = error;
    const text = (_b = (_a = err.stack) !== null && _a !== void 0 ? _a : err.message) !== null && _b !== void 0 ? _b : String(error);
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
export function formatSummary(counts, maybePassed, maybeFailed, options) {
    var _a, _b, _c, _d, _e, _f, _g;
    const lines = [];
    // Maybe tests are built on `todo: true`, so Node counts them inside the
    // `todo` bucket. To surface the *real* TODO count we deduct the maybe
    // quantity (which can never exceed `todo`). The Maybe breakdown itself is
    // reported separately below.
    const maybeTotal = maybePassed + maybeFailed;
    // In `maybeOnly` mode the standard breakdown (Tests/Passed/Failed/…) is the
    // reporter's own addition for non-maybe tests, so it is omitted and only the
    // Maybe-specific line remains.
    if (!options.maybeOnly) {
        const tests = (_b = (_a = counts.tests) !== null && _a !== void 0 ? _a : counts.total) !== null && _b !== void 0 ? _b : 0;
        const passed = (_c = counts.passed) !== null && _c !== void 0 ? _c : 0;
        const failed = (_d = counts.failed) !== null && _d !== void 0 ? _d : 0;
        const skipped = (_e = counts.skipped) !== null && _e !== void 0 ? _e : 0;
        const cancelled = (_f = counts.cancelled) !== null && _f !== void 0 ? _f : 0;
        const todo = Math.max(0, ((_g = counts.todo) !== null && _g !== void 0 ? _g : 0) - maybeTotal);
        const add = (label, value) => {
            // Zero counts are hidden by default; `showZero` opts *in* to listing
            // them (e.g. `Failed: 0`). This is unrelated to `maybe`.
            if (value !== 0 || options.showZero) {
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
    if (maybeTotal > 0) {
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
export function createReporter(options = {}, envDefaults = {}) {
    const opts = resolveReporterOptions(options, envDefaults);
    const tests = new Map();
    let maybePassed = 0;
    let maybeFailed = 0;
    const printedFiles = new Set();
    function record(event) {
        var _a, _b;
        const data = (_a = event.data) !== null && _a !== void 0 ? _a : {};
        const name = (_b = data.name) !== null && _b !== void 0 ? _b : '<anonymous>';
        const state = {
            name,
            maybe: isMaybeEvent(event),
            todo: data.todo,
        };
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
    const reporter = new Transform({
        writableObjectMode: true,
        transform(event, _encoding, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            try {
                switch (event.type) {
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
                            if (opts.maybeOnly && !state.maybe) {
                                callback();
                                return;
                            }
                            const name = displayName(state.name);
                            const time = formatDuration((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.duration_ms);
                            if (state.maybe) {
                                maybePassed++;
                                this.push(`  ◌ MAYBE ${name}${time ? ` (${time})` : ''}\n`);
                            }
                            else {
                                this.push(`  ✔ ${name}${time ? ` (${time})` : ''}\n`);
                            }
                            callback();
                            return;
                        }
                    case 'test:fail':
                        {
                            const state = getState(event);
                            // Mirror `test:pass`: in `maybeOnly` mode skip the `✖ FAIL`
                            // line (and its stack) for non-maybe tests entirely.
                            if (opts.maybeOnly && !state.maybe) {
                                callback();
                                return;
                            }
                            const name = displayName(state.name);
                            const time = formatDuration((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.details) === null || _d === void 0 ? void 0 : _d.duration_ms);
                            const error = (_f = (_e = event.data) === null || _e === void 0 ? void 0 : _e.details) === null || _f === void 0 ? void 0 : _f.error;
                            if (state.maybe) {
                                maybeFailed++;
                                this.push(`  ◌ MAYBE ${name}${time ? ` (${time})` : ''}\n`);
                            }
                            else {
                                this.push(`  ✖ FAIL ${name}${time ? ` (${time})` : ''}\n`);
                            }
                            if (error) {
                                this.push(`${formatError(error)}\n`);
                            }
                            callback();
                            return;
                        }
                    case 'test:diagnostic':
                        {
                            const message = (_g = event.data) === null || _g === void 0 ? void 0 : _g.message;
                            if (typeof message === 'string') {
                                const keyword = message.split(' ')[0];
                                // Node streams its built-in summary as a sequence of
                                // `test:diagnostic` messages ("tests 24", "pass 19",
                                // …). Those counts are not todo-aware (a failing
                                // `maybe` test is miscounted as `fail`), so we ignore
                                // them and compute our own summary from the per-test
                                // events instead (emitted once at the end).
                                if (SUMMARY_KEYWORDS.includes(keyword)) {
                                    callback();
                                    return;
                                }
                            }
                            this.push(`  ${message !== null && message !== void 0 ? message : ''}\n`);
                            callback();
                            return;
                        }
                    case 'test:stdout':
                    case 'test:stderr':
                        this.push((_j = (_h = event.data) === null || _h === void 0 ? void 0 : _h.message) !== null && _j !== void 0 ? _j : '');
                        callback();
                        return;
                    case 'test:summary':
                        {
                            const file = (_k = event.data) === null || _k === void 0 ? void 0 : _k.file;
                            // Under `tsx`, Node emits one `test:summary` per test
                            // file (carrying a `file` path) plus a final root
                            // aggregate with `file: undefined`. For a per-file summary
                            // (Option B) we print each file's own summary and skip the
                            // root aggregate to avoid printing a duplicate.
                            if (typeof file !== 'string' || file.length === 0) {
                                callback();
                                return;
                            }
                            // De-dupe: a given file should produce exactly one summary
                            // even if Node delivers its `test:summary` more than once.
                            if (printedFiles.has(file)) {
                                callback();
                                return;
                            }
                            printedFiles.add(file);
                            const counts = ((_m = (_l = event.data) === null || _l === void 0 ? void 0 : _l.counts) !== null && _m !== void 0 ? _m : {});
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
            catch (error) {
                callback(error);
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
//# sourceMappingURL=reporter.js.map