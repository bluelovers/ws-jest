/**
 * 測試控制 Jest 測試失敗時顯示的訊息
 * Testing control of Jest test failure messages
 */

import { allOf } from "../src";
import {
	myTestAsymmetricMatcherMessage001,
	myTestAsymmetricMatcherMessage002,
	myTestAsymmetricMatcherMessage003,
	MyTestAsymmetricMatcherMessage004,
	myTestAsymmetricMatcherMessage005,
	myTestAsymmetricMatcherMessage006
} from './lib/throw-msg';

describe(`測試訊息控制`, () =>
{

	const actual = {
		versionOld: '1.2.3',
		versionNew: '2.0.0',
		other: 'data',
		id: 0,
	};

	describe(`測試 myTestAsymmetricMatcherMessage001`, () =>
	{

		test('測試失敗訊息', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: myTestAsymmetricMatcherMessage001('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`測試 myTestAsymmetricMatcherMessage002`, () =>
	{

		test('測試失敗訊息', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: myTestAsymmetricMatcherMessage002('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`測試 myTestAsymmetricMatcherMessage003`, () =>
	{

		test('測試失敗訊息', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: myTestAsymmetricMatcherMessage003('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`測試 allOf 的訊息控制`, () =>
	{

		test('測試 allOf 失敗訊息', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: allOf(
					expect.any(String),
					expect.stringMatching(/^3\./)
				),
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`測試改進版本的訊息控制`, () =>
	{

		test('測試 MyTestAsymmetricMatcherMessage004', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: new MyTestAsymmetricMatcherMessage004('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

		test('測試 myTestAsymmetricMatcherMessage005', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: myTestAsymmetricMatcherMessage005('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

		test('測試 myTestAsymmetricMatcherMessage006', () => {
			expect(() => expect(actual).toMatchObject({
				versionNew: myTestAsymmetricMatcherMessage006('test-predicate'),
			})).toThrowErrorMatchingSnapshot();
		});

	});

})
