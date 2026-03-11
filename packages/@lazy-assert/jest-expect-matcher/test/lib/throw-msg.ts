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

/**
 * 改進版本：使用 Jest 內部的 AsymmetricMatcher 類別
 * Improved version: Using Jest's internal AsymmetricMatcher class
 *
 * 這個版本繼承了 Jest 的 AsymmetricMatcher 類別，確保完全符合 Jest 的協議
 * This version inherits from Jest's AsymmetricMatcher class, ensuring full compliance with Jest's protocol
 */
export class MyTestAsymmetricMatcherMessage004 {
	// @ts-ignore
	$$typeof = Symbol.for('jest.asymmetricMatcher');
	// @ts-ignore
	predicate: any;
	// @ts-ignore
	inverse = false;

	constructor(predicate: any, inverse = false) {
		// @ts-ignore
		this.predicate = predicate;
		// @ts-ignore
		this.inverse = inverse;
	}

	asymmetricMatch(actual: any) {
		// make this always fail
		return false;
	}

	toString() {
		// @ts-ignore
		return `MyTestAsymmetricMatcherMessage004(${this.predicate})`;
	}

	toAsymmetricMatcher() {
		// @ts-ignore
		return `MyTestAsymmetricMatcherMessage004(${this.predicate})`;
	}
}

/**
 * 改進版本：使用 Jest 內部的 AsymmetricMatcher 類別，但使用工廠函數
 * Improved version: Using Jest's internal AsymmetricMatcher class with factory function
 */
export const myTestAsymmetricMatcherMessage005 = (predicate: unknown | ((val: any) => boolean)) => {
	return {
		// @ts-ignore
		$$typeof: Symbol.for('jest.asymmetricMatcher'),
		predicate,
		inverse: false,
		asymmetricMatch: (actual: any) => {
			// make this always fail
			return false;
		},
		toString: () => `myTestAsymmetricMatcherMessage005(${predicate})`,
		toAsymmetricMatcher: () => `myTestAsymmetricMatcherMessage005(${predicate})`,
	} satisfies IAsymmetricMatcher
};

/**
 * 改進版本：使用自定義的 AsymmetricMatcher 實現
 * Improved version: Using custom AsymmetricMatcher implementation
 */
export const myTestAsymmetricMatcherMessage006 = (predicate: unknown | ((val: any) => boolean)) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		predicate,
		inverse: false,
		asymmetricMatch: (actual: any) => {
			// make this always fail
			return false;
		},
		toString: () => `myTestAsymmetricMatcherMessage006(${predicate})`,
		toAsymmetricMatcher: () => `myTestAsymmetricMatcherMessage006(${predicate})`,
	} satisfies IAsymmetricMatcher
};
