import { isInfinity } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeInfinity' as const;
/** 類型名稱 / Type name */
const type = 'infinity' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為無限大（Infinity 或 -Infinity）
			 * Check if value is infinity (Infinity or -Infinity)
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
 * 檢查值是否為無限大
 * Check if value is infinity
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export function toBeInfinity(this: jest.MatcherContext, received: number)
{
	const pass = isInfinity(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeInfinity,
};
