/// <reference types="jest" />
/// <reference types="expect" />
import { AsymmetricMatchers } from 'expect';

type IExpectAsymmetricMatcher = ReturnType<AsymmetricMatchers['anything']>;

export const SymbolTypeofAsymmetricMatcher = Symbol.for('jest.asymmetricMatcher');

/**
 * 要製作一個能像 expect.any() 或 expect.stringMatching() 這樣放在物件屬性中的匹配器，
 * 你不需要使用 expect.extend（那是用來做斷言的），
 * 而是要定義一個 符合 Jest 內部協議的類別或物件。
 *
 * 核心原理：asymmetricMatch 協議
 * Jest 在比對物件時，會檢查屬性值是否包含一個名為 asymmetricMatch 的方法。
 * 如果有，它就會呼叫該方法並傳入 actual 值。
 *
 * @see '@types/jest'
 */
export interface IAsymmetricMatcher<T extends unknown = unknown> extends jest.AsymmetricMatcher, IExpectAsymmetricMatcher
{
	/**
	 * 核心邏輯：接收實際的值，回傳布林值
	 */
	asymmetricMatch(actual: T | unknown): boolean;
	/**
	 * 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
	 * @FIXME: 實際顯示效果沒有發生作用
	 */
	toString(): string;

	/**
	 * @see '@types/jest'
	 * @see jasmine.Any - expect.any()
	 * @see jasmine.ObjectContaining - expect.objectContaining(sample: any)
	 */
	jasmineToString?(): string;
}

export type ICustomAsymmetricMatcher<TMatcher extends (...args: any[]) => any = (...args: any[]) => any> = (
	...args: Parameters<TMatcher>
) => IAsymmetricMatcher

export function _isAsymmetricMatcher<T>(matcher: unknown | IAsymmetricMatcher<T>): matcher is IAsymmetricMatcher<T>
{
	return typeof (matcher as IAsymmetricMatcher)?.asymmetricMatch === 'function'
}

/**
 * 概念：建立一個「容器」Matcher
 *
 * 我們可以製作一個 `expect.all()` 或 `expect.anyOf()`，
 * 讓它內部去呼叫其他 Matcher 的 `asymmetricMatch` 方法。
 *
 * 實作「聯集 (OR)」：expect.anyOf
 * 這能解決：「可以是字串 OR 也可以是 null」 的問題。
 *
 * 這種做法的好處是完全解耦。
 * 你不需要為每一種組合（如 NullableString、NullableNumber）都寫一個新的 Matcher，而是像樂高一樣組裝
 * 可串接原生 Matcher 與常數
 *
 * @example
 * // Nullable String:
 * anyOf(expect.any(String), null)

 * // Optional Number:
 * anyOf(expect.any(Number), undefined)

 * // 特定範圍或 Null:
 * anyOf(expect.stringMatching(/v1/), null)
 */
export const anyOf = ((...matchers: (unknown | IAsymmetricMatcher)[]) => ({
	asymmetricMatch: (actual) =>
		matchers.some((matcher) => {
			// 如果傳入的是原生的 Matcher (有 asymmetricMatch 方法)
			if (_isAsymmetricMatcher(matcher))
			{
				return matcher.asymmetricMatch(actual);
			}
			// 如果傳入的是普通的值 (如 null, '1.2.3')
			return actual === matcher;
		}),
	toString: () => `AnyOf(${matchers.map(m => m.toString?.() || m).join(', ')})`,
})) satisfies ICustomAsymmetricMatcher;

/**
 * 實作「交集 (AND)」：expect.allOf
 *
 * 如果你希望一個值同時符合多個條件（例如：必須是字串，且長度大於 5）
 */
export const allOf = ((...matchers: (unknown | IAsymmetricMatcher)[]) => ({
	asymmetricMatch: (actual: any) =>
		matchers.every(matcher => {
			if (_isAsymmetricMatcher(matcher))
			{
				return matcher.asymmetricMatch(actual);
			}
			return actual === matcher;
		}),
	toString: () => `AllOf(${matchers.map(m => m.toString?.() || m).join(', ')})`,
})) satisfies ICustomAsymmetricMatcher;
