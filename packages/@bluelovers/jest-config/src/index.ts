/**
 * 核心入口模組 - 提供 Jest 配置混合功能
 * Core Entry Module - Provides Jest configuration mixing functionality
 */

import { _requireResolve, fixJestConfig, makeTestRegexConfig } from './helper';
import {
	defaultCoveragePathIgnorePatterns,
	defaultModuleFileExtensions,
	defaultTestFileExtensions,
	defaultTestPathIgnorePatterns, defaultTransform,
} from './defaults';
import { IOptionsPrintJestConfigInfo, printJestConfigInfo } from './print';
import { IJestConfig } from './types';
import { getJestCacheDirectory } from 'jest-cache-directory';

// 重新匯出輔助函數和類型 / Re-export helper functions and types
export * from './helper';
export * from './defaults';
export * from './print';

/** Jest 快取目錄路徑 / Jest cache directory path */
const cacheDirectory = getJestCacheDirectory();

export { cacheDirectory }

/**
 * 混合 Jest 配置函數 - 將預設配置與使用者自定義配置合併
 * Mix Jest configuration function - Merges default config with user custom config
 *
 * 此函數提供了一個完整的 Jest 配置模板，包含 TypeScript 支援、快取管理、覆蓋率收集等功能
 * This function provides a complete Jest configuration template with TypeScript support,
 * cache management, coverage collection, and more.
 *
 * @param {T} jestConfig - 使用者自定義的 Jest 配置 / User custom Jest configuration
 * @param {boolean} autoPrint - 是否自動印出配置資訊 / Whether to auto print config info
 * @param {IOptionsPrintJestConfigInfo} options - 印出配置的選項 / Options for printing config
 * @returns {T} 合併後的完整 Jest 配置 / Merged complete Jest configuration
 */
export function mixinJestConfig<T extends IJestConfig>(jestConfig?: T, autoPrint?: boolean,
	options?: IOptionsPrintJestConfigInfo)
{
	// @ts-ignore
	// 如果未提供配置則使用空對象 / Use empty object if no config provided
	jestConfig ??= {};

	/**
	 * 建立基礎 Jest 配置物件
	 * Create base Jest configuration object
	 *
	 * 包含以下預設設定:
	 * - 快取目錄管理 / Cache directory management
	 * - 單一工作執行緒以確保測試穩定性 / Single worker for test stability
	 * - 自動清除模擬物件 / Auto clear mocks
	 * - 無測試時仍通過 / Pass with no tests
	 * - TypeScript 檔案支援 / TypeScript file support
	 * - 覆蓋率使用 v8 提供者 / Coverage using v8 provider
	 */
	const newJestConfig = fixJestConfig({
		globals: {
			// ts-jest 全域配置預留位置 / ts-jest global config placeholder
//			'ts-jest': {
//				//tsconfig: 'tsconfig.spec.json',
//			},
		},
		/** 快取目錄路徑 / Cache directory path */
		cacheDirectory,
		/** 最大工作執行緒數（設為 1 確保測試順序執行） / Max workers (set to 1 for sequential execution) */
		maxWorkers: 1,
		/** 每次測試前清除模擬物件 / Clear mocks before each test */
		clearMocks: true,
		/** 無測試檔案時仍視為通過 / Pass even when no test files */
		passWithNoTests: true,
		/** 模組檔案副檔名列表 / Module file extensions list */
		moduleFileExtensions: defaultModuleFileExtensions(),
		// 測試環境設定（預設 node） / Test environment setting
		//testEnvironment: 'node',
		// 測試匹配模式 / Test match patterns
		//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
		// 合併測試正則配置 / Merge test regex config
		...makeTestRegexConfig(defaultTestFileExtensions()),
		/** 測試路徑忽略模式 / Test path ignore patterns */
		testPathIgnorePatterns: defaultTestPathIgnorePatterns(),
		// 測試執行器設定 / Test runner setting
		//testRunner: 'jest-circus/runner',
		/** 環境設置後載入的檔案 / Files to load after environment setup */
		setupFilesAfterEnv: [
			// 可選擇性啟用的 Jest 擴充套件 / Optional Jest extensions
			//"jest-chain",
			//"jest-extended/all",
			//"jest-extended-extra",
			//"jest-num-close-with",
			/**
			 * 跨平台測試支援參考 / Cross-platform testing support reference
			 * @see https://medium.com/doctolib/how-to-run-the-same-jest-test-suite-across-several-platforms-jest-os-detection-plugin-included-f8113832482b
			 * @see https://github.com/doctolib/jest-os-detection
			 */
			//'jest-os-detection',
		],
		// 轉換器設定（後面單獨處理） / Transform setting (handled separately below)
		//transform: defaultTransform(),
		/** 詳細輸出模式 / Verbose output mode */
		verbose: true,
		/**
		 * 覆蓋率提供者設定為 v8
		 * Coverage provider set to v8
		 *
		 * 若使用 collectCoverage: true 時未設為 v8，Node.js 除錯點可能會失效
		 * If not set to v8 with collectCoverage: true, Node.js debug points may fail
		 */
		coverageProvider: 'v8',
		/** 是否收集覆蓋率 / Whether to collect coverage */
		collectCoverage: false,
		/** 覆蓋率忽略路徑模式 / Coverage path ignore patterns */
		coveragePathIgnorePatterns: defaultCoveragePathIgnorePatterns(),
		/**
		 * Jest 模組解析器參考 / Jest module resolver reference
		 * @see https://github.com/facebook/jest/issues/9771#issuecomment-872764344
		 */
		//resolver: 'jest-node-exports-resolver',
		// 合併使用者自定義配置 / Merge user custom config
		...jestConfig,
	});

	/**
	 * 設定轉換器（如果尚未設定）
	 * Set up transform (if not already set)
	 *
	 * 使用預設的 ts-jest 轉換器，並支援 jest-tsd-transform 和 jest-chain-transform 鏈式轉換
	 * Uses default ts-jest transformer with support for jest-tsd-transform and jest-chain-transform chaining
	 */
	newJestConfig.transform ??= defaultTransform({
		jestConfig,
		autoPrint,
		options,
		newJestConfig,
	});

	// 如果啟用自動印出，則顯示配置資訊 / If autoPrint enabled, display config info
	autoPrint && printJestConfigInfo(newJestConfig, options);

	return newJestConfig
}

/**
 * 預設匯出 - mixinJestConfig 函數
 * Default export - mixinJestConfig function
 */
export default mixinJestConfig
