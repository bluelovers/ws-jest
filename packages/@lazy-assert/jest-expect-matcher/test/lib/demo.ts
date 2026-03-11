/**
 * Created by user on 2026/3/11.
 */

import { IAsymmetricMatcher } from '../../src/index';

declare global
{
	namespace jest
	{
		/**
		 * 如何在 TypeScript 中獲得型別支援？
		 *
		 * 為了讓開發體驗更好，你可以擴充 Jest 的 expect 型別定義，
		 * 這樣你在輸入時就會有自動補完
		 */
		interface Expect
		{
			/**
			 * 讓 expect.anyOrNull() 可用
			 */
			anyStringNullOrUndefined(): any;

			/**
			 * 讓 expect.satisfy(fn) 可用
			 */
			satisfy(predicate: (val: any) => boolean): any;
		}
	}
}

export const anyStringNullOrUndefined: IAsymmetricMatcher = {
	// 核心邏輯：接收實際的值，回傳布林值
	asymmetricMatch: (actual: any) =>
	{
		return actual === null || actual === undefined || typeof actual === 'string';
	},
	// 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
	toString: () => 'AnyStringNullOrUndefined',
};

export const satisfy = (predicate: (val: any) => boolean) => ({
	asymmetricMatch: (actual: any) => predicate(actual),
	toString: () => `CustomSatisfyMatcher(${predicate.toString()})`,
}) satisfies IAsymmetricMatcher;
