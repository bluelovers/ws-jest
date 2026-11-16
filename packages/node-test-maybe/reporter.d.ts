import { Transform } from 'node:stream';
export interface IMaybeTestState {
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
export interface IReporterOptions {
    maybeOnly?: boolean;
    showZero?: boolean;
}
/**
 * Built-in defaults used when neither an explicit option nor an env var is set.
 */
export declare const DEFAULT_REPORTER_OPTIONS: Required<IReporterOptions>;
/**
 * Environment variable names consulted by {@link resolveReporterOptions}.
 *
 * They are exposed so callers can document / override them consistently.
 */
export declare const REPORTER_ENV_KEYS: {
    readonly maybeOnly: "NODE_TEST_MAYBE_REPORTER_MAYBE_ONLY";
    readonly showZero: "NODE_TEST_MAYBE_REPORTER_SHOW_ZERO";
};
/**
 * Parse a string into a boolean, recognising the common truthy/falsy tokens.
 *
 * Returns `undefined` when the input is `undefined`/`null`/empty so the caller
 * can fall through to the next configuration source.
 */
export declare function parseBoolEnv(value: string | undefined | null): boolean | undefined;
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
export declare function resolveReporterOptions(explicit?: Partial<IReporterOptions>, envDefaults?: Partial<IReporterOptions>): Required<IReporterOptions>;
/**
 * Minimal structural view of a Node test-runner reporter event.
 *
 * Only the fields used by this reporter are declared; the real Node events
 * carry additional data which is ignored.
 */
export interface IReporterEvent {
    type: string;
    data?: {
        testId?: number | string;
        name?: string;
        tags?: string[];
        todo?: boolean | string;
        details?: {
            duration_ms?: number;
            error?: Error | {
                stack?: string;
                message?: string;
            };
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
 * human-readable name prefix (`[maybe] ` or the `[fixme] ` display variant)
 * so the reporter also works on the raw test name when tags are unavailable.
 */
export declare function isMaybeEvent(event: IReporterEvent): boolean;
/**
 * Build a single, compact summary block from a `test:summary` event's counts.
 *
 * The standard counts (`tests`/`passed`/`failed`/`skipped`/`cancelled`/`todo`)
 * come straight from Node, which already classifies a failing `maybe` test as
 * `todo` rather than `failed`. Any count that is `0` is omitted so the output
 * stays noise-free, and the `Maybe` breakdown (unique to this reporter) is
 * appended.
 */
export declare function formatSummary(counts: {
    tests?: number;
    total?: number;
    passed?: number;
    failed?: number;
    skipped?: number;
    cancelled?: number;
    todo?: number;
}, maybePassed: number, maybeFailed: number, options: Required<IReporterOptions>): string;
/**
 * Create a custom reporter `Transform` stream.
 *
 * The reporter:
 *
 * - prints `◌ MAYBE` for maybe tests (pass or fail) — `◌ FIXME` for the
 *   `fixme` display variant, which shares the same semantics,
 * - prints `✔` for normal passes and `✖ FAIL` for normal failures,
 * - tracks per-test metadata by `testId` so parallel tests stay correct,
 * - prints one summary per test file (once), with a dedicated `Maybe` line.
 *
 * The returned stream is accepted by `stream.compose`, so it can be passed
 * to `node --test --test-reporter=./this-file`.
 */
export declare function createReporter(options?: Partial<IReporterOptions>, envDefaults?: Partial<IReporterOptions>): Transform;
declare const _default: Transform;
export default _default;
