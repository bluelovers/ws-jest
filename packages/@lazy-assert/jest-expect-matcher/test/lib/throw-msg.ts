/**
 * Created by user on 2026/3/11.
 */
import { IAsymmetricMatcher, SymbolTypeofAsymmetricMatcher } from '../../src/index';

/**
 * 試圖測試當測試失敗時，Jest 顯示的訊息
 *
 * 例如:
 * - 在 "Expected" 欄位的文字
 * - 物件比對的顯示樣式
 *
 * @type {{asymmetricMatch: (actual: any) => boolean, toString: () => string}}
 */
export const myTestAsymmetricMatcherMessage001 = (predicate: unknown | ((val: any) => boolean)) =>
{
	return {
		// 核心邏輯：接收實際的值，回傳布林值
		asymmetricMatch: (actual: any) =>
		{
			// make this always fail
			return false;
		},
		// 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
		toString: () => `myTestAsymmetricMatcherMessage001(${predicate})`,
	} satisfies IAsymmetricMatcher
};

export const myTestAsymmetricMatcherMessage002 = (predicate: unknown | ((val: any) => boolean)) =>
{
	return {
		// 核心邏輯：接收實際的值，回傳布林值
		asymmetricMatch: (actual: any) =>
		{
			// make this always fail
			return false;
		},
		// 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
		toString: () => `myTestAsymmetricMatcherMessage002(${predicate})`,
		jasmineToString: () => `myTestAsymmetricMatcherMessage002(${predicate})`,
	} satisfies IAsymmetricMatcher
};

export const myTestAsymmetricMatcherMessage003 = (predicate: unknown | ((val: any) => boolean)) =>
{
	return {
		// 核心邏輯：接收實際的值，回傳布林值
		asymmetricMatch: (actual: any) =>
		{
			// make this always fail
			return false;
		},
		// 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
		toString: () => `myTestAsymmetricMatcherMessage003(${predicate})`,
		jasmineToString: () => `myTestAsymmetricMatcherMessage003(${predicate})`,
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
	} satisfies IAsymmetricMatcher
};
