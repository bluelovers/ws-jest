import check from 'check-types';
import { ITSKeyofByExtractType } from 'ts-type/lib/helper/record/pick-type';
import { ICustomMatcherResult, IMatcherContext } from '@lazy-assert/jest-global-types-extra';
/**
 * 建立新的類型檢查匹配器
 * Create new type check matcher
 *
 * 使用 check-types 函式庫來驗證數值類型
 * Uses check-types library to validate number type
 *
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱（來自 check-types）/ Type name (from check-types)
 * @returns 匹配器函數 / Matcher function
 */
export declare function createNewCheckTypes(matcherName: string, type: ITSKeyofByExtractType<typeof check, ((...argv: any[]) => any)> | string): (this: IMatcherContext, received: number) => ICustomMatcherResult;
