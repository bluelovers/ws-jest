/**
 * 類型定義模組 - 定義 Jest 配置相關的型別介面
 * Type Definitions Module - Defines type interfaces for Jest configuration
 */

import { InitialOptionsTsJest, JestConfigWithTsJest } from 'ts-jest';
import { IOptionsPrintJestConfigInfo } from './print';

/**
 * Jest 配置型別別名
 * Jest configuration type alias
 *
 * 支援 ts-jest 提供的兩種配置型別
 * Supports both configuration types provided by ts-jest
 */
export type IJestConfig = (InitialOptionsTsJest | JestConfigWithTsJest) & {
	/**
	 * testURL 選項已被 testEnvironmentOptions.url 取代
	 * testURL option has been replaced by testEnvironmentOptions.url
	 *
	 * @see https://jestjs.io/docs/configuration#testurl-string
	 * @deprecated
	 */
	testURL?: string;
};

/**
 * 執行時期配置介面
 * Runtime configuration interface
 *
 * 用於在配置生成過程中傳遞上下文資訊
 * Used to pass context information during configuration generation
 */
export interface IRuntime<T extends IJestConfig = IJestConfig>
{
	/** 原始 Jest 配置 / Original Jest configuration */
	jestConfig: T,
	/** 是否自動印出配置 / Whether to auto print configuration */
	autoPrint: boolean,
	/** 印出配置的選項 / Options for printing configuration */
	options: IOptionsPrintJestConfigInfo,
	/** 新生成的配置（可選） / Newly generated configuration (optional) */
	newJestConfig?: T,
}
