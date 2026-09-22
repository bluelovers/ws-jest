import _nodeTest from 'node:test';
import type {
	TestContext,
	TestFn,
	TestOptions,
} from 'node:test';

// The only logic genuinely shared with the reporter (`reporter.ts`) is the
// maybe tag/prefix contract, which lives in `lib/constants.ts`.
import { MAYBE_TAG, MAYBE_PREFIX } from './lib/constants.ts';

export { MAYBE_TAG, MAYBE_PREFIX };

export type IMaybeName = string;

export type IMaybeTestFunction = (
	this: TestContext,
	t: TestContext,
) => void | Promise<void>;

export interface IMaybeTestOptions extends TestOptions
{
	tags?: string[]
}

/**
 * Build the human-visible test name for a maybe test.
 *
 * @example buildMaybeName('external API') // '[maybe] external API'
 */
export function buildMaybeName(name: IMaybeName)
{
	return `${MAYBE_PREFIX}${name}` as const;
}

/**
 * Build the tag list for a maybe test, preserving the user's own tags and
 * appending the `maybe` tag.
 *
 * @example buildMaybeTags(['network']) // ['network', 'maybe']
 */
export function buildMaybeTags(userTags?: string[]): string[]
{
	return [...(userTags ?? []), MAYBE_TAG];
}

interface NormalizedMaybeArgs
{
	name: IMaybeName;
	options: IMaybeTestOptions;
	fn: IMaybeTestFunction;
}

function normalizeMaybeArgs(
	name: IMaybeName | IMaybeTestFunction,
	options: TestOptions | IMaybeTestFunction | undefined,
	fn: IMaybeTestFunction | undefined,
): NormalizedMaybeArgs
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
		options: (options as TestOptions) ?? {},
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

	// Preserve the user's own tags, then append the maybe tag.
	const tags = buildMaybeTags(args.options.tags);

	return _nodeTest(
		buildMaybeName(args.name),
		{
			...args.options,

			// `maybe` owns this behavior; user value is intentionally ignored.
			todo: true,

			// @ts-ignore
			tags,
		},
		args.fn,
	);
}

export type ITest = typeof _nodeTest & {
	maybe: typeof maybe;
}

export { maybe as testMaybe }

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
	}
}

export const test = _nodeTest as ITest;

// Attach to the native `test` function so `test.maybe(...)` works directly.
test.maybe = maybe;

export default test;
