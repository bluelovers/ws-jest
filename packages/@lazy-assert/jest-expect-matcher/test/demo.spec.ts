import { allOf, anyOf } from "../src";
import { anyStringNullOrUndefined, satisfy } from './lib/demo';

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



