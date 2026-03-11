import { isZero } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeZero' as const;
/** 類型名稱 / Type name */
const type = 'zero' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為零（0 或 -0）
			 * Check if value is zero (0 or -0)
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
 * 檢查值是否為零
 * Check if value is zero
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export function toBeZero(this: jest.MatcherContext, received: number)
{
	const pass = isZero(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeZero,
};
