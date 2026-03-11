import { createNewCheckTypes } from '../util/lazy-check-types';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeInteger' as const;
/** 類型名稱 / Type name */
const type = 'integer' as const;

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為整數
			 * Check if value is an integer
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
 * 檢查值是否為整數
 * Check if value is an integer
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
export const toBeInteger = createNewCheckTypes(matcherName, type)

export default {
	toBeInteger,
};
