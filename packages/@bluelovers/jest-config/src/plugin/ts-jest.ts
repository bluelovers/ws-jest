/**
 * ts-jest 轉換器配置模組 - 提供 ts-jest 的預設選項設定
 * ts-jest Transformer Configuration Module - Provides default options for ts-jest
 */

import { TsJestTransformerOptions } from 'ts-jest';
import { IRuntime } from '../types';
import { array_unique } from 'array-hyper-unique';

/**
 * 取得預設的 ts-jest 轉換器選項
 * Get default ts-jest transformer options
 *
 * 此函數會合併使用者自定義的 ts-jest 設定與預設值，確保測試環境的最佳配置
 * This function merges user custom ts-jest settings with defaults for optimal test environment
 *
 * 主要調整項目:
 * - 禁用輸出檔案（noEmit: true）
 * - 允許未使用的參數和標籤（用於測試開發）
 * - 禁用嚴格的型別檢查選項（確保測試能順利執行）
 *
 * Key adjustments:
 * - Disable file output (noEmit: true)
 * - Allow unused parameters and labels (for test development)
 * - Disable strict type checking options (ensure tests run smoothly)
 *
 * @param runtime - 執行時期配置，包含原始 Jest 配置 / Runtime configuration containing original Jest config
 * @returns ts-jest 轉換器選項 / ts-jest transformer options
 */
export function defaultTsJestTransformerOptions(runtime: IRuntime)
{
	/**
	 * 取得使用者自定義的 ts-jest 設定（如果存在）
	 * Get user custom ts-jest settings (if exists)
	 *
	 * 從 jestConfig.globals['ts-jest'] 中讀取既有設定
	 * Reads existing settings from jestConfig.globals['ts-jest']
	 */
	const old: TsJestTransformerOptions = (runtime.jestConfig.globals?.['ts-jest'] ?? {}) as TsJestTransformerOptions;

	/**
	 * 處理 tsconfig 設定物件
	 * Process tsconfig settings object
	 *
	 * 如果使用者提供了物件形式的 tsconfig，則使用它；否則建立空物件
	 * Uses user-provided object tsconfig or creates empty object
	 */
	const tsconfig = typeof old.tsconfig === 'object' ? old.tsconfig : {};

	const types = array_unique([...(tsconfig.types ?? []), 'jest']);

	/**
	 * 回傳合併後的 ts-jest 選項
	 * Return merged ts-jest options
	 *
	 * 預設值優先於使用者設定，但使用者設定可覆蓋預設值
	 * Defaults take precedence but user settings can override them
	 */
	return {
		// 保留既有設定 / Preserve existing settings
		...old,
		tsconfig: {
			/**
			 * 不輸出編譯後的檔案（僅用於型別檢查和轉換）
			 * Don't emit compiled files (only for type checking and transformation)
			 */
			noEmit: true,
			/**
			 * 不僅輸出宣告檔案（確保完整編譯）
			 * Don't emit declaration only (ensure full compilation)
			 */
			emitDeclarationOnly: false,
			/**
			 * 允許未使用的參數（測試中常見佔位符）
			 * Allow unused parameters (common placeholders in tests)
			 */
			noUnusedParameters: false,
			/**
			 * 允許未使用的標籤（方便測試標記）
			 * Allow unused labels (convenient for test marking)
			 */
			allowUnusedLabels: true,
			/**
			 * 允許未使用的區域變數（測試開發彈性）
			 * Allow unused locals (flexibility in test development)
			 */
			noUnusedLocals: false,
			/**
			 * 允許從索引簽名進行屬性存取（簡化測試語法）
			 * Allow property access from index signature (simpler test syntax)
			 */
			noPropertyAccessFromIndexSignature: false,
			/**
			 * 允許隱含的 any 型別（減少測試中的型別宣告負擔）
			 * Allow implicit any type (reduce type declaration overhead in tests)
			 */
			noImplicitAny: false,
			// 合併使用者自定義的 tsconfig 設定 / Merge user custom tsconfig settings
			...tsconfig,
			types,
		},
	} as TsJestTransformerOptions
}
