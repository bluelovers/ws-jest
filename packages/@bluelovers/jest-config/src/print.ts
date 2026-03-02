/**
 * 配置資訊印出模組 - 格式化並顯示 Jest 配置資訊
 * Configuration Info Print Module - Formats and displays Jest configuration info
 */

import { applyStyleBorderless, Table } from '@yarn-tool/table';
import { TableConstructorOptions } from 'cli-table3';
import { console } from 'debug-color2';
import { inspect } from 'util';
import { name as jName, version as jVersion } from '../package.json';
import { IJestConfig } from './types';

/**
 * 建立無邊框表格實例
 * Create borderless table instance
 *
 * 用於以整齊的格式顯示 Jest 配置資訊
 * Used to display Jest configuration info in a neat format
 *
 * @param {TableConstructorOptions} options - 表格建構選項 / Table constructor options
 * @returns {Table} 無邊框表格實例 / Borderless table instance
 */
export function _newTableBorderless(options?: TableConstructorOptions)
{
	/**
	 * 建立表格實例，設定欄位對齊方式
	 * Create table instance with column alignment settings
	 */
	let table = new Table({
		/** 欄位對齊方式（右對齊, 左對齊） / Column alignments (right, left) */
		colAligns: ['right', 'left'],
		/**
		 * 移除所有邊框字元，創造簡潔的外觀
		 * Remove all border characters for clean appearance
		 */
		chars: {
			top: '',
			'top-mid': '',
			'top-left': '',
			'top-right': '',
			bottom: '',
			'bottom-mid': '',
			'bottom-left': '',
			'bottom-right': '',
			left: '',
			'left-mid': '',
			mid: '',
			'mid-mid': '',
			right: '',
			'right-mid': '',
			middle: '',
		},
		...options,
	});

	// 套用無邊框樣式 / Apply borderless style
	table = applyStyleBorderless(table);

	return table;
}

/**
 * 印出 Jest 配置資訊的選項介面
 * Options interface for printing Jest config info
 */
export interface IOptionsPrintJestConfigInfo
{
	/** 目前工作目錄 / Current working directory */
	cwd?: string;
	/** 配置文件路徑 / Configuration file path */
	file?: string;
}

/**
 * 印出 Jest 配置資訊
 * Print Jest configuration information
 *
 * 以表格格式顯示當前 Jest 配置的關鍵資訊，方便除錯和確認設定
 * Displays key info of current Jest config in table format for debugging and verification
 *
 * @param {IJestConfig} jestConfig - Jest 配置物件 / Jest configuration object
 * @param {IOptionsPrintJestConfigInfo} options - 印出選項 / Print options
 */
export function printJestConfigInfo(jestConfig: IJestConfig, options?: IOptionsPrintJestConfigInfo)
{
	// 建立無邊框表格 / Create borderless table
	const table = _newTableBorderless();

	// 初始化選項（若未提供） / Initialize options (if not provided)
	options ??= {};
	// @ts-ignore
	jestConfig ??= {};

	/**
	 * 添加基本資訊行到表格
	 * Add basic info rows to table
	 */
	// 套件名稱和版本 / Package name and version
	table.push([`${jName}:`, jVersion]);
	// Node.js 版本 / Node.js version
	table.push([`process.versions.node:`, process.versions.node]);
	// 目前工作目錄 / Current working directory
	table.push(['cwd:', options.cwd ?? process.cwd()]);

	// 配置文件路徑（如果提供） / Config file path (if provided)
	options.file?.length && table.push(['file:', options.file]);

	// 快取目錄（如果設定） / Cache directory (if set)
	jestConfig.cacheDirectory?.length && table.push(['cacheDirectory:', jestConfig.cacheDirectory]);

	// 根目錄（如果設定） / Root directory (if set)
	jestConfig.rootDir?.length && table.push(['rootDir:', jestConfig.rootDir]);
	// 根目錄陣列（如果設定） / Roots array (if set)
	jestConfig.roots?.length && table.push(['roots:', inspect(jestConfig.roots)]);

	// Preset 設定（如果設定） / Preset setting (if set)
	jestConfig.preset?.length && table.push(['preset:', jestConfig.preset]);

	// 轉換器配置（如果設定） / Transform config (if set)
	jestConfig.transform && table.push(['transform:', inspect(jestConfig.transform, {
		/** 檢視深度限制 / Inspection depth limit */
		depth: 3
	})]);

	/**
	 * 輸出表格到控制台
	 * Output table to console
	 */
	// 分隔線 / Separator line
	console.gray.log('─'.repeat(20));
	// 標題 / Title
	console.log(`jest.config`);
	// 表格內容 / Table content
	console.log(table.toString());
	// 分隔線 / Separator line
	console.gray.log('─'.repeat(20));
}
