import { requireResolveExtra, IOptions } from '@yarn-tool/require-resolve';
import { ITSToWriteableArray } from 'ts-type/lib/helper/array/readonly';
import { ITSWriteable } from 'ts-type/lib/helper/readonly';
import { _requireResolve } from './helper';
import { InitialOptionsTsJest } from 'ts-jest';

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

export function defaultTransform()
{
	const paths: string[] = [
		requireResolveExtra('@bluelovers/jest-config').result,
	].filter(Boolean);

	const opts: IOptions = {
		includeGlobal: true,
		includeCurrentDirectory: true,
		paths,
	};

	let ts_transform: InitialOptionsTsJest["transform"][string] = _requireResolve('ts-jest') as 'ts-jest'

	const { result: tsd } = requireResolveExtra('jest-tsd-transform', opts);

	if (tsd?.length)
	{
		const { result: chain } = requireResolveExtra('jest-chain-transform', opts);

		if (chain?.length)
		{
			ts_transform = [
				chain as 'jest-chain-transform', {
					transformers: [
						tsd as 'jest-tsd-transform',
						ts_transform as 'ts-jest',
					],
				},
			] satisfies [
				string,
				Record<string, unknown>
			]
		}
	}

	const value = {
		'.(ts|tsx|mts|cts)$': ts_transform,
	} as const
	return value as ITSWriteable<typeof value>;
}
