import { autoMessage } from '@lazy-assert/jest-util';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeFinite' as const;
/** 類型名稱 / Type name */
const type = 'finite' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為有限數字（非 Infinity）
			 * Check if value is a finite number (not Infinity)
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
 * 檢查值是否為有限數字
 * Check if value is finite
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export function toBeFinite(this: jest.MatcherContext, received: number)
{
	const pass = isFinite(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeFinite,
};
