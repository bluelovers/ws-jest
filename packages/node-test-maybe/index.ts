import _nodeTest from 'node:test';
import type {
	TestContext,
	TestFn,
	TestOptions,
} from 'node:test';

// The only logic genuinely shared with the reporter (`reporter.ts`) is the
// maybe tag/prefix contract, which lives in `lib/constants.ts`.
import {
	MAYBE_TAG,
	MAYBE_PREFIX,
	FIXME_PREFIX,
	resolveMaybePrefix,
	type IMaybeDisplay,
	EnumMaybe,
} from './lib/constants.ts';

export { MAYBE_TAG, MAYBE_PREFIX, FIXME_PREFIX, resolveMaybePrefix };
export type { IMaybeDisplay };

export type IMaybeName = string;

export type IMaybeTestFunction = (
	this: TestContext,
	t: TestContext,
) => void | Promise<void>;

export interface IMaybeTestOptions extends TestOptions
{
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

interface INormalizedMaybeArgs
{
	name: IMaybeName;
	options: IMaybeTestOptions;
	fn: IMaybeTestFunction;
}

/**
 * Build the human-visible test name for a maybe test.
 *
 * @example buildMaybeName('external API') // '[maybe] external API'
 * @example buildMaybeName('external API', 'fixme') // '[fixme] external API'
 */
export function buildMaybeName(name: IMaybeName, display?: IMaybeDisplay)
{
	return `${resolveMaybePrefix(display)}${name}` as const;
}

/**
 * Build the tag list for a maybe test, preserving the user's own tags and
 * appending the `maybe` tag.
 *
 * @example buildMaybeTags(['network']) // ['network', 'maybe']
 */
export function buildMaybeTags(userTags?: string[]): (typeof MAYBE_TAG | (string & {}))[]
{
	return [...(userTags ?? []), MAYBE_TAG];
}

function normalizeMaybeArgs(
	name: IMaybeName | IMaybeTestFunction,
	options: TestOptions | IMaybeTestFunction | undefined,
	fn: IMaybeTestFunction | undefined,
): INormalizedMaybeArgs
{
	// test.maybe(fn)
	if (typeof name === 'function')
	{
		return {
			name: (name as IMaybeTestFunction).name || '<anonymous>',
			options: {},
			fn: name as IMaybeTestFunction,
		};
	}

	// test.maybe(name, fn)
	if (typeof options === 'function')
	{
		return {
			name: name as IMaybeName,
			options: {},
			fn: options as IMaybeTestFunction,
		};
	}

	// test.maybe(name, options, fn)
	return {
		name: name as IMaybeName,
		options: (options as IMaybeTestOptions) ?? {},
		fn: fn as IMaybeTestFunction,
	};
}

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
export function maybe(
	name: IMaybeName | IMaybeTestFunction,
	options?: IMaybeTestOptions | IMaybeTestFunction,
	fn?: IMaybeTestFunction,
)
{
	const args = normalizeMaybeArgs(name, options, fn);

	if (typeof args.name !== 'string')
	{
		throw new TypeError(
			'test.maybe() requires a string name or a test function',
		);
	}

	if (typeof args.fn !== 'function')
	{
		throw new TypeError('test.maybe() requires a test function');
	}

	// `display` is this API's own knob: it selects the visible prefix and must
	// never be forwarded to node:test's option bag. `buildMaybeName` resolves
	// it — and rejects an unknown variant — while building the name.
	const { display, ...nodeOptions } = args.options;

	// Preserve the user's own tags, then append the maybe tag.
	const tags = buildMaybeTags(args.options.tags);

	return _nodeTest(
		buildMaybeName(args.name, display),
		{
			...nodeOptions,

			// `maybe` owns this behavior; user value is intentionally ignored.
			todo: true,

			// @ts-ignore
			tags,
		},
		args.fn,
	);
}

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
export function fixme(
	name: IMaybeName | IMaybeTestFunction,
	options?: IMaybeTestOptions | IMaybeTestFunction,
	fn?: IMaybeTestFunction,
)
{
	const args = normalizeMaybeArgs(name, options, fn);

	return maybe(args.name, { ...args.options, display: EnumMaybe.FIXME }, args.fn);
}

export type ITest = typeof _nodeTest & {
	maybe: typeof maybe;
	fixme: typeof fixme;
}

export { maybe as testMaybe, fixme as testFixme }

declare module 'node:test'
{
	// @ts-ignore
	interface TestFn
	{
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

export const test = _nodeTest as ITest;

// Attach to the native `test` function so `test.maybe(...)` / `test.fixme(...)`
// work directly.
test.maybe = maybe;
test.fixme = fixme;

export default test;

// Programmatic, maybe-aware run API built on Node's native `node:test` runner.
export { runMaybe, EnumRunner as RunnerEnum } from './run.ts';
export type { IMaybeRunSummary, IRunMaybeOptions } from './run.ts';
