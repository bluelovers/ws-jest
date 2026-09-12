/**
 * 預設配置模組 - 提供 Jest 各項預設設定值
 * Default Configuration Module - Provides default settings for Jest
 */

import { ITSToWriteableArray } from 'ts-type/lib/helper/array/readonly';

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

