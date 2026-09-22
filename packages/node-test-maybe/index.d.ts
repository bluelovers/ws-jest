import _nodeTest from 'node:test';
import type { TestContext, TestOptions } from 'node:test';
import { MAYBE_TAG, MAYBE_PREFIX } from './lib/constants.ts';
export { MAYBE_TAG, MAYBE_PREFIX };
export type IMaybeName = string;
export type IMaybeTestFunction = (this: TestContext, t: TestContext) => void | Promise<void>;
export interface IMaybeTestOptions extends TestOptions {
    tags?: string[];
}
/**
 * Build the human-visible test name for a maybe test.
 *
 * @example buildMaybeName('external API') // '[maybe] external API'
 */
export declare function buildMaybeName(name: IMaybeName): `[maybe] ${string}`;
/**
 * Build the tag list for a maybe test, preserving the user's own tags and
 * appending the `maybe` tag.
 *
 * @example buildMaybeTags(['network']) // ['network', 'maybe']
 */
export declare function buildMaybeTags(userTags?: string[]): string[];
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
 */
export declare function maybe(name: IMaybeName | IMaybeTestFunction, options?: IMaybeTestOptions | IMaybeTestFunction, fn?: IMaybeTestFunction): Promise<void>;
export type ITest = typeof _nodeTest & {
    maybe: typeof maybe;
};
export { maybe as testMaybe };
declare module 'node:test' {
    interface TestFn {
        /**
         * Register a test that is allowed to pass or fail without
         * affecting the run's exit code.
         */
        maybe: typeof maybe;
    }
}
export declare const test: ITest;
export default test;
export { runMaybe, EnumRunner as RunnerEnum } from './run.ts';
export type { IMaybeRunSummary, IRunMaybeOptions } from './run.ts';
