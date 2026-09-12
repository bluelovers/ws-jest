import { DiffOptions } from 'jest-matcher-utils';
/**
 * 差異訊息列舉
 * Difference message enumeration
 */
export declare const enum EnumDiffMessage {
    /** 僅行分隔符號不同 / Contents have differences only in line separators */
    LINE_SEPARATORS = "Contents have differences only in line separators"
}
/**
 * 核心字串差異比較函式
 * Core string difference comparison function
 *
 * 檢測行分隔符號（CRLF/LF）差異，若僅有行分隔符號不同則顯示特殊訊息
 * Detects line separator (CRLF/LF) differences, shows special message if only line separators differ
 *
 * @param received - 實際接收到的字串 / Received string
 * @param expected - 預期的字串 / Expected string
 * @param options - Jest 差異比較選項 / Jest diff options
 * @returns 差異訊息陣列 / Array of difference messages
 */
export declare function _stringDiffCore(received: string, expected: string, options?: DiffOptions): string[];
/**
 * 取得格式化的字串差異結果
 * Get formatted string difference result
 *
 * 將差異陣列以雙換行符號連接成單一字串
 * Joins difference array into single string with double line breaks
 *
 * @param received - 實際接收到的字串 / Received string
 * @param expected - 預期的字串 / Expected string
 * @param options - Jest 差異比較選項 / Jest diff options
 * @returns 格式化的差異字串 / Formatted difference string
 */
export declare function _stringDiff(received: string, expected: string, options?: DiffOptions): string;
