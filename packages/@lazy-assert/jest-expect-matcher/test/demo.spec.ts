import { allOf, anyOf, IAsymmetricMatcher } from "../src";

const anyStringNullOrUndefined: IAsymmetricMatcher = {
	// 核心邏輯：接收實際的值，回傳布林值
	asymmetricMatch: (actual: any) => {
		return actual === null || actual === undefined || typeof actual === 'string';
	},
	// 當測試失敗時，Jest 顯示在 "Expected" 欄位的文字
	toString: () => 'AnyStringNullOrUndefined'
};

const satisfy = (predicate: (val: any) => boolean) => ({
	asymmetricMatch: (actual: any) => predicate(actual),
	toString: () => `CustomSatisfyMatcher(${predicate.toString()})`
}) satisfies IAsymmetricMatcher;

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

describe(`示範自定義 Asymmetric Matcher`, () =>
{

	const actual = {
		// 測試通過
		versionOld: null as null,
		versionNew: '2.0.0',
		other: 'data',
		id: 0,
	};

	describe(`無需呼叫`, () =>
	{

		test('anyStringNullOrUndefined', () => {
			expect(actual).toMatchObject({
				versionOld: anyStringNullOrUndefined,
				versionNew: '2.0.0',
			});

			expect(() => expect(actual).toMatchObject({
				id: anyStringNullOrUndefined,
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`「可傳參」的工廠函式`, () =>
	{

		test('satisfy(fn)', () => {
			expect(actual).toMatchObject({
				versionOld: satisfy(val => val === null || val === '1.2.3'),
				versionNew: '2.0.0'
			});

			expect(() => expect(actual).toMatchObject({
				versionNew: satisfy(val => val === null || val === '1.2.3'),
			})).toThrowErrorMatchingSnapshot();
		});

		test('anyOf(...)', () => {
			expect(actual).toMatchObject({
				// 串接了原生 Matcher 與常數
				versionOld: anyOf(expect.any(String), null, undefined),
				versionNew: '2.0.0'
			});

			expect(() => expect(actual).toMatchObject({
				versionNew: anyOf(null, undefined),
			})).toThrowErrorMatchingSnapshot();
		});

		test('allOf(...)', () => {
			expect(actual).toMatchObject({
				versionNew: allOf(
					expect.any(String),
					expect.stringMatching(/^2\./)
				)
			});

			expect(() => expect(actual).toMatchObject({
				versionNew: allOf(
					expect.any(String),
					expect.stringMatching(/^3\./)
				),
			})).toThrowErrorMatchingSnapshot();
		});

	});

})



