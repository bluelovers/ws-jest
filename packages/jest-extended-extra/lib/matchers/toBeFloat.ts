import { createNewCheckTypes } from '../util/lazy-check-types';

/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeFloat' as const;
/** 類型名稱 / Type name */
const type = 'float' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查值是否為浮點數（非整數）
			 * Check if value is a float (non-integer)
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
 * 檢查值是否為浮點數
 * Check if value is a float
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
export const toBeFloat = createNewCheckTypes(matcherName, type)

export default {
	toBeFloat,
};
