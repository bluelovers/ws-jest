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
		toString: () => `myTestAsymmetricMatcherMessage001:toString(${predicate})`,
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
		toString: () => `myTestAsymmetricMatcherMessage002:toString(${predicate})`,
		jasmineToString: () => `myTestAsymmetricMatcherMessage002:toAsymmetricMatcher(${predicate})`,
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
		toString: () => `myTestAsymmetricMatcherMessage003:toString(${predicate})`,
		jasmineToString: () => `myTestAsymmetricMatcherMessage003:toAsymmetricMatcher(${predicate})`,
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
		return `MyTestAsymmetricMatcherMessage004:toString(${this.predicate})`;
	}

	toAsymmetricMatcher() {
		// @ts-ignore
		return `MyTestAsymmetricMatcherMessage004:toAsymmetricMatcher(${this.predicate})`;
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
		toString: () => `myTestAsymmetricMatcherMessage005:toString(${predicate})`,
		toAsymmetricMatcher: () => `myTestAsymmetricMatcherMessage005:toAsymmetricMatcher(${predicate})`,
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
		toString: () => `myTestAsymmetricMatcherMessage006:toString(${predicate})`,
		toAsymmetricMatcher: () => `myTestAsymmetricMatcherMessage006:toAsymmetricMatcher(${predicate})`,
	} satisfies IAsymmetricMatcher
};

/**
 * 測試 007: 只有 asymmetricMatch 和 toAsymmetricMatcher，且有 $$typeof
 * 目的: 測試是否只需要 toAsymmetricMatcher 就能在物件比對失敗時顯示簡短訊息
 */
export const myTestAsymmetricMatcherMessage007 = (predicate: unknown) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		asymmetricMatch: (actual: any) => false,
		toAsymmetricMatcher: () => `Matcher007(${predicate})`,
	}
};

/**
 * 測試 008: 只有 asymmetricMatch 和 toString，且有 $$typeof
 * 目的: 測試在有 $$typeof 的情況下，toString 是否會被忽略（相對於 toAsymmetricMatcher）
 */
export const myTestAsymmetricMatcherMessage008 = (predicate: unknown) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		asymmetricMatch: (actual: any) => false,
		toString: () => `Matcher008(${predicate})`,
	}
};

/**
 * 測試 009: 同時有 toString 和 toAsymmetricMatcher，且有 $$typeof
 * 目的: 測試優先權
 */
export const myTestAsymmetricMatcherMessage009 = (predicate: unknown) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		asymmetricMatch: (actual: any) => false,
		toString: () => `Matcher009:toString(${predicate})`,
		toAsymmetricMatcher: () => `Matcher009:toAsymmetricMatcher(${predicate})`,
	}
};

/**
 * 測試 010: 沒有 $$typeof，只有 asymmetricMatch 和 toAsymmetricMatcher
 * 目的: 測試 $$typeof 是否為必要
 */
export const myTestAsymmetricMatcherMessage010 = (predicate: unknown) => {
	return {
		asymmetricMatch: (actual: any) => false,
		toAsymmetricMatcher: () => `Matcher010(${predicate})`,
	}
};

/**
 * 測試 011: 使用 jasmineToString (Jest 內部有時會用到)
 * 目的: 測試 jasmineToString 的效果
 */
export const myTestAsymmetricMatcherMessage011 = (predicate: unknown) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		asymmetricMatch: (actual: any) => false,
 	jasmineToString: () => `Matcher011(${predicate})`,
	}
};

/**
 * 測試 012: 測試 inverse 屬性的效果
 */
export const myTestAsymmetricMatcherMessage012 = (predicate: unknown, inverse = false) => {
	return {
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		inverse,
		asymmetricMatch: (actual: any) => false,
		toAsymmetricMatcher: () => `Matcher012(inverse=${inverse})`,
	}
};

/**
 * 最簡化的 AsymmetricMatcher 實作 (The most simplified AsymmetricMatcher implementation)
 *
 * 經過測試，若要讓 Jest 在斷言失敗時顯示自定義的簡短訊息（而非整個物件結構）：
 * 1. 必須包含 `$$typeof: Symbol.for('jest.asymmetricMatcher')`
 * 2. 必須包含 `asymmetricMatch(actual: any): boolean` 核心邏輯
 * 3. 必須包含 `toAsymmetricMatcher(): string` 用於顯示在 "Expected" 欄位
 *
 * 其他屬性如 `inverse`, `predicate`, `toString`, `jasmineToString` 在此場景下皆可省略。
 * 其中 `toString` 在沒有 `$$typeof` 時會被顯示，但會導致顯示整個物件結構。
 */
export const myTestAsymmetricMatcherMessageSimplified = (name: string) => {
	return {
		// 1. 標記此物件為 Jest 的 AsymmetricMatcher，這是觸發自定義訊息的關鍵
		// @ts-ignore
		$$typeof: SymbolTypeofAsymmetricMatcher,
		// 2. 核心比對邏輯
		asymmetricMatch: (actual: any) => false,
		// 3. 定義失敗時在 "Expected" 欄位顯示的名稱/訊息
		toAsymmetricMatcher: () => `SimplifiedMatcher(${name})`,
	}
};
