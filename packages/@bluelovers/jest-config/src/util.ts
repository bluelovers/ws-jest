import { ITSPartialRecord, ITSValueOrArrayMaybeReadonly } from "ts-type";
import { escapeRegExp } from "regexp-helper-core";

/**
 * Detects all values in an array that include any of the given keys.
 *
 * @example
 * const arr = ['abc', 'def', 'ghi'];
 * const keys = ['a', 'e', 'i'];
 * const result = detectIncludes(arr, keys);
 * // result is { a: ['abc', 'def'], e: ['def', 'ghi'], i: ['abc', 'ghi'] }
 *
 * @param arr - The array to search.
 * @param keys - The keys to search for.
 * @returns An object with the keys as properties and the
 *   corresponding values as arrays of strings.
 */
export function detectIncludes<K extends string, V = unknown | string>(arr: V[], keys: ITSValueOrArrayMaybeReadonly<K>)
{
	let result = {} as ITSPartialRecord<K, string[]>;

	if (arr?.length)
	{
		if (keys.length)
		{
			keys = Array.isArray(keys) ? keys : [keys] as K[];

			const re = new RegExp(`(${escapeArrayToRegExpSource(keys as string[])})`);

			arr.forEach((value) =>
			{
				let m = (value as string)?.match?.(re);
				if (m)
				{
					const k = m[1] as K;
					(result[k] ??= []).push(value as string);
				}
				return result;
			});
		}
	}

	return result
}

/**
 * Escapes all strings in an array to be used in a regular expression source.
 *
 * @example
 * const arr = ['abc', 'def', 'ghi'];
 * const result = escapeArrayToRegExpSource(arr);
 * // result is 'abc|def|ghi'
 *
 * @param arr - The array of strings to escape.
 * @returns A single string that can be used as a regular expression source.
 */
export function escapeArrayToRegExpSource(arr: string[])
{
	return arr.map(s => escapeRegExp(s)).join("|");
}

export function tsExtensions(js: true): readonly [
	'js',
	'mjs',
	'cjs',
	'jsx',
];
export function tsExtensions(js?: false): readonly [
	'ts',
	'tsx',
	'mts',
	'cts',
];
export function tsExtensions(js?: boolean): readonly ["js", "mjs", "cjs", "jsx"] | readonly ["ts", "tsx", "mts", "cts"];
export function tsExtensions(js?: boolean)
{
	return js ? [
		'js',
		'mjs',
		'cjs',
		'jsx',
	] as const : [
		'ts',
		'tsx',
		'mts',
		'cts',
	] as const;
}
