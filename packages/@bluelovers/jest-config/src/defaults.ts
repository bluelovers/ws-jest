import { ITSToWriteableArray } from 'ts-type/lib/helper/array/readonly';

export function defaultTestFileExtensions()
{
	const value = [
		'ts',
		'tsx',
		'mts',
		'cts',
//	'js',
//	'jsx',
//	'mjs',
//	'cjs',
	] as const;
	return value as ITSToWriteableArray<typeof value>;
}

export function defaultModuleFileExtensions()
{
	const value = [
		'ts',
		'tsx',
		'mts',
		'cts',
		'js',
		'jsx',
		'mjs',
		'cjs',
		'json',
		'node',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}

export function defaultCoveragePathIgnorePatterns()
{
	const value = [
		'/node_modules/',
		'/__snapshots__/',
		'/__tests__/',
		'/__test__/',
		//'**/node_modules/',
		//'**/__snapshots__/',
		//'**/__tests__/',
		'/dist/',
		'/test/',
		'/fixture/',
		'/__file_snapshots__/',
		'/__fixtures__/',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}

export function defaultTestPathIgnorePatterns()
{
	const value = [
		'/node_modules/',
		'/__fixtures__/',
		'/__file_snapshots__/',
		'/fixtures/',
		'/__tests__/helpers/',
		'/__tests__/utils/',
		'__mocks__',
		'/dist/',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}
