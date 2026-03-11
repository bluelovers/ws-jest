import { isNegative } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeNegative' as const;
/** 類型名稱 / Type name */
const type = 'negative' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為負數（小於 0）
			 * Check if value is negative (less than 0)
			 */
			[matcherName](): R;
		}

		interface Expect
		{
			[matcherName](): void;
		}

	}

}

declare module 'expect'
{
	interface Matchers<R extends void | Promise<void>>
	{
		[matcherName](): R;
	}
}

/**
 * 檢查值是否為負數
 * Check if value is negative
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export function toBeNegative(this: jest.MatcherContext, received: number)
{
	const pass = isNegative(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeNegative,
};
