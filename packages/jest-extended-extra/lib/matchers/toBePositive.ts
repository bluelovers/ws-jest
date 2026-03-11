import { isPositive } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBePositive' as const;
/** 類型名稱 / Type name */
const type = 'positive' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為正數（大於 0）
			 * Check if value is positive (greater than 0)
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
 * 檢查值是否為正數
 * Check if value is positive
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export function toBePositive(this: jest.MatcherContext, received: number)
{
	const pass = isPositive(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBePositive,
};
