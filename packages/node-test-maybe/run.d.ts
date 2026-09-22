import { type IReporterOptions } from './reporter.ts';
/**
 * Structured, maybe-aware result returned by {@link runMaybe}.
 */
export interface IMaybeRunSummary {
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
export declare enum EnumRunner {
    /** Auto-detect: use `tsx` when resolvable, otherwise `node`. */
    Auto = "auto",
    /** Always `node` + the built `run-collector.js` collector (no `tsx`). */
    Node = "node",
    /** Always `tsx`; if genuinely absent the spawn fails naturally. */
    Tsx = "tsx"
}
export interface IRunMaybeOptions {
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
export declare function runMaybe(runOptions?: {
    files?: string[];
}, options?: IRunMaybeOptions): Promise<IMaybeRunSummary>;
export default runMaybe;
