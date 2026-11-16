import _nodeTest from 'node:test';
import type { TestContext, TestOptions } from 'node:test';
import { MAYBE_TAG, MAYBE_PREFIX, FIXME_PREFIX, resolveMaybePrefix, type IMaybeDisplay } from './lib/constants.ts';
export { MAYBE_TAG, MAYBE_PREFIX, FIXME_PREFIX, resolveMaybePrefix };
export type { IMaybeDisplay };
export type IMaybeName = string;
export type IMaybeTestFunction = (this: TestContext, t: TestContext) => void | Promise<void>;
export interface IMaybeTestOptions extends TestOptions {
    tags?: string[];
    /**
     * Display variant of the maybe semantics. Defaults to `'maybe'`.
     *
     * Execution is identical for both variants (`todo: true`, non-blocking
     * failure, counted in the maybe bucket); only the visible text differs:
     * `'maybe'` → `[maybe] ` prefix, `'fixme'` → `[fixme] ` prefix.
     */
    display?: IMaybeDisplay;
}
/**
 * Build the human-visible test name for a maybe test.
 *
 * @example buildMaybeName('external API') // '[maybe] external API'
 * @example buildMaybeName('external API', 'fixme') // '[fixme] external API'
 */
export declare function buildMaybeName(name: IMaybeName, display?: IMaybeDisplay): `[maybe] ${string}` | `[fixme] ${string}`;
/**
 * Build the tag list for a maybe test, preserving the user's own tags and
 * appending the `maybe` tag.
 *
 * @example buildMaybeTags(['network']) // ['network', 'maybe']
 */
export declare function buildMaybeTags(userTags?: string[]): (typeof MAYBE_TAG | (string & {}))[];
/**
 * `test.maybe(name, fn)`
 * `test.maybe(name, options, fn)`
 * `test.maybe(fn)`
 *
 * A test whose expected outcome is either PASS or FAIL.
 *
 * Semantics:
 *
 * - The callback is executed by Node's native test runner.
 * - PASS  → reported as a normal pass.
 * - FAIL  → Node detects a real failure, but because the test is marked
 *           `todo`, it does NOT affect the run's exit code.
 *
 * Implementation notes:
 *
 * - `[maybe] ` prefix  → human-visible / portable metadata (built-in reporter).
 * - `tags: ['maybe']`  → machine-readable metadata (custom reporters / filters).
 * - `todo: true`       → Node native non-blocking failure semantics.
 *
 * None of these three mechanisms are mutually exclusive; they each cover a
 * different layer (display name, tooling metadata, runner semantics).
 *
 * The `display: 'fixme'` option keeps all three layers' *semantics* intact
 * and only swaps the visible prefix for `[fixme] `.
 */
export declare function maybe(name: IMaybeName | IMaybeTestFunction, options?: IMaybeTestOptions | IMaybeTestFunction, fn?: IMaybeTestFunction): Promise<void>;
/**
 * `fixme(name, fn)`
 * `fixme(name, options, fn)`
 * `fixme(fn)`
 *
 * The `fixme` display variant of {@link maybe}: execution is *identical*
 * (`todo: true`, non-blocking failure, counted in the maybe bucket); only the
 * display changes — `[fixme] ` name prefix and the reporter's `◌ FIXME`
 * marker instead of `◌ MAYBE`.
 *
 * A `display` value passed through `options` is overridden: `fixme` owns it.
 */
export declare function fixme(name: IMaybeName | IMaybeTestFunction, options?: IMaybeTestOptions | IMaybeTestFunction, fn?: IMaybeTestFunction): Promise<void>;
export type ITest = typeof _nodeTest & {
    maybe: typeof maybe;
    fixme: typeof fixme;
};
export { maybe as testMaybe, fixme as testFixme };
declare module 'node:test' {
    interface TestFn {
        /**
         * Register a test that is allowed to pass or fail without
         * affecting the run's exit code.
         */
        maybe: typeof maybe;
        /**
         * `maybe` with the `fixme` display: same non-blocking semantics,
         * shown as `[fixme] ` / `◌ FIXME`.
         */
        fixme: typeof fixme;
    }
}
export declare const test: ITest;
export default test;
export { runMaybe, EnumRunner as RunnerEnum } from './run.ts';
export type { IMaybeRunSummary, IRunMaybeOptions } from './run.ts';
