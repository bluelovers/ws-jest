/**
 * 輔助函數模組 - 提供 Jest 配置處理的通用工具函數
 * Helper Functions Module - Provides utility functions for Jest configuration processing
 */

import { requireResolveCore, requireResolveExtra } from '@yarn-tool/require-resolve';
import { ITSValueOrArrayMaybeReadonly } from 'ts-type/lib/type/base';
import { console } from 'debug-color2';
import { IJestConfig } from './types';
import { defaultTestFileExtensions } from './defaults';
import { array_unique } from 'array-hyper-unique';

/**
 * 解析模組路徑的內部輔助函數
 * Internal helper function for resolving module paths
 *
 * 優先從 @bluelovers/tsdx 或 tsdx 套件路徑中搜尋，若失敗則使用標準 require.resolve
 * Searches from @bluelovers/tsdx or tsdx package paths first, falls back to standard require.resolve
 *
 * @param {string} name - 要解析的模組名稱 / Module name to resolve
 * @returns {string} 解析後的模組絕對路徑 / Resolved absolute module path
 */
export function _requireResolve(name: string)
{
	/**
	 * 搜尋路徑列表，包含 tsdx 相關套件路徑
	 * Search paths list including tsdx related package paths
	 */
	const paths = [
		requireResolveExtra('@bluelovers/tsdx').result,
		requireResolveExtra('tsdx').result,
	].filter(Boolean);

	/**
	 * 使用增強的解析器進行模組解析
	 * Use enhanced resolver for module resolution
	 */
	const result = requireResolveCore(name, {
		includeGlobal: true,
		includeCurrentDirectory: true,
		paths,
	});

	// 輸出除錯資訊 / Output debug info
	console.debug('[require.resolve]', name, '=>', result)

	return result
}

/**
 * 建立測試正則表達式配置
 * Create test regex configuration
 *
 * 根據測試檔案副檔名生成 testMatch 和 testRegex 配置
 * Generates testMatch and testRegex configs based on test file extensions
 *
 * @param {T} testExt - 測試檔案副檔名或陣列 / Test file extension(s)
 * @returns {object} 包含 testMatch 和 testRegex 的配置物件 / Object containing testMatch and testRegex
 */
export function makeTestRegexConfig<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>): Pick<IJestConfig, 'testMatch' | 'testRegex'>
{
	// 若未提供副檔名則使用預設值 / Use default if no extensions provided
	testExt ??= defaultTestFileExtensions() as any as T[];
	const _testExt = _handleFileExtensions(testExt, '|')

	return {
		/** 不使用 testMatch（使用 testRegex 替代） / Not using testMatch (using testRegex instead) */
		testMatch: null as undefined,
		/**
		 * 測試檔案正則表達式模式陣列
		 * Test file regex patterns array
		 *
		 * 匹配以下模式:
		 * - *.test.ts, *.spec.ts, *.tests.ts
		 * - __tests__ 目錄下的測試檔案
		 */
		testRegex: [
			`\\.(tests?|spec)\\.(${_testExt})$`,
			`__tests__\/\.*\\.(tests?|spec)\\.(${_testExt})$`,
		],
	}
}

/**
 * 處理檔案副檔名陣列的核心函數
 * Core function for processing file extension arrays
 *
 * 將輸入轉換為唯一的副檔名陣列
 * Converts input to unique array of extensions
 *
 * @param {T} testExt - 輸入的副檔名（可為陣列或單一值） / Input extension(s)
 * @returns {T[]} 唯一的副檔名陣列 / Unique array of extensions
 */
export function _handleFileExtensionsCore<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>)
{
	return array_unique([testExt].flat()) as T[]
}

/**
 * 處理檔案副檔名並以指定分隔符連接
 * Process file extensions and join with specified separator
 *
 * @param {T} testExt - 輸入的副檔名（可為陣列或單一值） / Input extension(s)
 * @param {string} sep - 分隔符號 / Separator string
 * @returns {string} 連接後的副檔名字串 / Joined extension string
 */
export function _handleFileExtensions<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>, sep: string)
{
	return _handleFileExtensionsCore(testExt).join(sep)
}

/**
 * 修復 Jest 配置中的相容性問題
 * Fix compatibility issues in Jest configuration
 *
 * 處理 testMatch/testRegex 互斥問題以及 testURL 已棄用選項的遷移
 * Handles testMatch/testRegex mutual exclusivity and testURL deprecated option migration
 *
 * @param {T} jestConfig - 原始 Jest 配置 / Original Jest configuration
 * @returns {T} 修復後的 Jest 配置 / Fixed Jest configuration
 */
export function fixJestConfig<T extends IJestConfig>(jestConfig: T): T
{
	/**
	 * testMatch 和 testRegex 是互斥的選項
	 * testMatch and testRegex are mutually exclusive options
	 *
	 * 如果同時設定兩者會造成衝突，因此需要清除其中一個
	 * Having both set causes conflicts, so we need to clear one
	 */
	if (jestConfig.testMatch)
	{
		// 如果使用 testMatch，清除 testRegex
		// If using testMatch, clear testRegex
		jestConfig.testRegex = null;
	}
	else if (jestConfig.testRegex)
	{
		// 如果使用 testRegex，清除 testMatch
		// If using testRegex, clear testMatch
		jestConfig.testMatch = null;
	}

	/**
	 * testURL 選項已被 testEnvironmentOptions.url 取代
	 * testURL option has been replaced by testEnvironmentOptions.url
	 *
	 * @see https://jestjs.io/docs/configuration#testurl-string
	 */
	if (jestConfig.testURL)
	{
		// 確保 testEnvironmentOptions 物件存在
		// Ensure testEnvironmentOptions object exists
		jestConfig.testEnvironmentOptions ??= {};

		// 將 testURL 遷移到 testEnvironmentOptions.url
		// Migrate testURL to testEnvironmentOptions.url
		jestConfig.testURL = (jestConfig.testEnvironmentOptions['url'] ??= jestConfig.testURL) as string
	}

	return jestConfig
}
