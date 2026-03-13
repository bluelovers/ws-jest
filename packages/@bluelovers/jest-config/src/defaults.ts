/**
 * 預設配置模組 - 提供 Jest 各項預設設定值
 * Default Configuration Module - Provides default settings for Jest
 */

import { IOptionsRequireResolve as IOptions, requireResolveExtra } from '@yarn-tool/require-resolve';
import { ITSToWriteableArray } from 'ts-type/lib/helper/array/readonly';
import { ITSWriteable } from 'ts-type/lib/helper/readonly';
import { _handleFileExtensions, _requireResolve, _requireResolve2 } from './helper';
import { defaultTsJestTransformerOptions } from './plugin/ts-jest';
import { IJestConfig, IRuntime } from './types';

/**
 * 取得預設的測試檔案副檔名列表
 * Get default test file extensions list
 *
 * 定義哪些副檔名的檔案會被視為測試檔案
 * Defines which file extensions are recognized as test files
 *
 * @returns {string[]} 測試檔案副檔名陣列 / Array of test file extensions
 */
export function defaultTestFileExtensions()
{
	const value = [
		// TypeScript 相關副檔名 / TypeScript related extensions

		'ts',
		'tsx',
		'mts',
		'cts',

		// JavaScript 相關副檔名（目前註解掉） / JavaScript related extensions (currently commented)

		//'js',
		//'jsx',
		//'mjs',
		//'cjs',
	] as const;
	return value as ITSToWriteableArray<typeof value>;
}

/**
 * 取得預設的模組檔案副檔名列表
 * Get default module file extensions list
 *
 * 定義模組解析時搜尋的副檔名順序
 * Defines the order of extensions to search during module resolution
 *
 * @see https://jestjs.io/docs/configuration#options
 * @returns {string[]} 模組檔案副檔名陣列 / Array of module file extensions
 */
export function defaultModuleFileExtensions()
{
	const value = [
		'js',
		'mjs',
		'cjs',
		'jsx',
		'ts',
		'mts',
		'cts',
		'tsx',
		'json',
		'node',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}

/**
 * 取得預設的覆蓋率檔案副檔名列表
 * Get default coverage file extensions list
 *
 * 定義哪些副檔名的檔案會被納入覆蓋率統計
 * Defines which file extensions are included in coverage statistics
 *
 * @returns {string[]} 覆蓋率檔案副檔名陣列 / Array of coverage file extensions
 */
export function defaultCoverageFileExtensions()
{
	const value = [
		'js',
		'mjs',
		'cjs',
		'jsx',
		'ts',
		'mts',
		'cts',
		'tsx',
		//'json',
		//'node',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}

/**
 * 取得預設的轉換器檔案副檔名列表
 * Get default transformer file extensions list
 *
 * 定義哪些副檔名的檔案需要經過 ts-jest 轉換
 * Defines which file extensions need to be transformed by ts-jest
 *
 * @returns {string[]} 轉換器檔案副檔名陣列 / Array of transformer file extensions
 */
export function defaultTransformFileExtensions()
{
	const value = [
		'ts',
		'tsx',
		'mts',
		'cts',
	] as const
	return value as ITSToWriteableArray<typeof value>;
}

/**
 * 取得預設的覆蓋率忽略路徑模式
 * Get default coverage path ignore patterns
 *
 * 定義哪些路徑的檔案不納入覆蓋率統計
 * Defines which paths are excluded from coverage statistics
 *
 * @returns {string[]} 覆蓋率忽略路徑模式陣列 / Array of coverage ignore patterns
 */
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

/**
 * 取得預設的測試路徑忽略模式
 * Get default test path ignore patterns
 *
 * 定義哪些路徑的檔案不會被視為測試檔案
 * Defines which paths are excluded from test file recognition
 *
 * @returns {string[]} 測試路徑忽略模式陣列 / Array of test path ignore patterns
 */
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

/**
 * 建立預設的轉換器配置
 * Create default transformer configuration
 *
 * 配置 ts-jest 作為主要轉換器，並在可用時整合 jest-tsd-transform 和 jest-chain-transform
 * Configures ts-jest as the main transformer, integrating jest-tsd-transform and jest-chain-transform when available
 *
 * @param {IRuntime} runtime - 執行時期配置 / Runtime configuration
 * @returns {object} 轉換器配置物件 / Transformer configuration object
 */
export function defaultTransform(runtime: IRuntime)
{
	/**
	 * 搜尋路徑列表，用於解析相關模組
	 * Search paths list for resolving related modules
	 */
	const paths: string[] = [
		requireResolveExtra('@bluelovers/jest-config').result,
	].filter(Boolean);

	/**
	 * 模組解析選項 / Module resolution options
	 */
	const opts: IOptions = {
		includeGlobal: true,
		includeCurrentDirectory: true,
		paths,
	};

	/**
	 * ts-jest 轉換器配置
	 * ts-jest transformer configuration
	 */
	let ts_transform: IJestConfig["transform"][string] = _requireResolve('ts-jest') as 'ts-jest';

	/**
	 * 將 ts-jest 與其選項合併
	 * Merge ts-jest with its options
	 */
	ts_transform = [ts_transform, defaultTsJestTransformerOptions(runtime)];

	/**
	 * 嘗試解析 jest-tsd-transform（TypeScript 宣告檔轉換器）
	 * Try to resolve jest-tsd-transform (TypeScript declaration file transformer)
	 */
	const { result: tsd } = requireResolveExtra('jest-tsd-transform', opts);

	/**
	 * 如果 jest-tsd-transform 可用，嘗試建立轉換鏈
	 * If jest-tsd-transform is available, try to create transform chain
	 */
	if (tsd?.length)
	{
		/**
		 * 嘗試解析 jest-chain-transform（轉換鏈協調器）
		 * Try to resolve jest-chain-transform (transform chain coordinator)
		 */
		const { result: chain } = requireResolveExtra('jest-chain-transform', opts);

		/**
		 * 如果 jest-chain-transform 可用，建立轉換鏈
		 * If jest-chain-transform is available, create transform chain
		 */
		if (chain?.length)
		{
			ts_transform = [
				chain as 'jest-chain-transform', {
					transformers: [
						tsd as 'jest-tsd-transform',
						// @ts-ignore
						ts_transform as 'ts-jest',
					],
				},
			] satisfies [
				string,
				Record<string, unknown>
			]
		}
	}

	/**
	 * 建立最終的轉換器配置物件
	 * Create final transformer configuration object
	 */
	const value = {
		[`.(${_handleFileExtensions(defaultTransformFileExtensions(), '|')})$`]: ts_transform,
	} as const
	return value as ITSWriteable<typeof value>;
}

// @ts-ignore
export function defaultSetupFiles()
{
	const setupFiles: IJestConfig['setupFiles'] = [
		/**
		 * @see https://lusbuab.medium.com/using-dotenv-with-jest-7e735b34e55f
		 */
		_requireResolve2('dotenv/config').result,
	].filter(Boolean);

	return setupFiles
}
