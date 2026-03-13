import { MatcherHintOptions } from 'jest-matcher-utils';
import { IMatcherContext } from '@lazy-assert/jest-global-types-extra';
/**
 * 處理 Jest 匹配器提示選項
 * Handle Jest matcher hint options
 *
 * 自動設定 isNot、promise 等上下文相關選項
 * Automatically sets context-related options like isNot, promise
 *
 * @param context - 匹配器上下文 / Matcher context
 * @param options - 選項物件 / Options object
 * @returns 處理後的選項 / Processed options
 */
export declare function handleJestMatcherHintOptions(context: IMatcherContext, options?: MatcherHintOptions): MatcherHintOptions;
/**
 * 產生通過訊息（用於 .not 斷言）
 * Generate pass message (for .not assertions)
 *
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
export declare function passMessage(received: any, matcherName: string, type: string): () => string;
/**
 * 產生失敗訊息
 * Generate fail message
 *
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
export declare function failMessage(received: any, matcherName: string, type: string): () => string;
/**
 * 自動選擇並產生對應的訊息
 * Automatically select and generate appropriate message
 *
 * 根據通過與否自動選擇使用通過或失敗訊息
 * Automatically chooses pass or fail message based on result
 *
 * @param pass - 是否通過 / Whether passed
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
export declare function autoMessage(pass: boolean, received: any, matcherName: string, type: string): () => string;
