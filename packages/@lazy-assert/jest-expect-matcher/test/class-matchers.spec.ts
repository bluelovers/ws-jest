/**
 * 測試 Class 版本的 anyOf 與 allOf
 * Testing class-based anyOf and allOf
 */

import { AllOf, AnyOf, NotAnyOf, NotAllOf } from './lib/throw-msg-class';

const actual = {
	versionOld: null as null,
	versionNew: '2.0.0',
	other: 'data',
	id: 0,
};

describe(`測試 Class 版本的 Matchers`, () =>
{

	describe(`AnyOf (OR Logic)`, () =>
	{

		test('AnyOf - 匹配成功', () =>
		{
			expect(actual).toMatchObject({
				versionOld: new AnyOf([expect.any(String), null, undefined]),
			});
		});

		test('AnyOf - 匹配失敗', () =>
		{
			expect(() => expect(actual).toMatchObject({
				versionNew: new AnyOf([null, undefined]),
			})).toThrowErrorMatchingSnapshot();
		});

		test('AnyOf with string matching', () =>
		{
			expect('hello world').toEqual(new AnyOf([expect.stringContaining('hello'), expect.stringContaining('foo')]));
		});

	});

	describe(`AllOf (AND Logic)`, () =>
	{

		test('AllOf - 匹配成功', () =>
		{
			expect(actual).toMatchObject({
				versionNew: new AllOf([
					expect.any(String),
					expect.stringMatching(/^2\./)
				])
			});
		});

		test('AllOf - 匹配失敗', () =>
		{
			expect(() => expect(actual).toMatchObject({
				versionNew: new AllOf([
					expect.any(String),
					expect.stringMatching(/^3\./)
				]),
			})).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`NotAnyOf`, () =>
	{

		test('NotAnyOf - 匹配成功 (所有都失敗)', () =>
		{
			expect('abc').toEqual(new NotAnyOf([expect.stringContaining('x'), expect.stringContaining('y')]));
		});

		test('NotAnyOf - 匹配失敗 (其中一個成功)', () =>
		{
			expect(() => expect('hello').toEqual(new NotAnyOf([expect.stringContaining('x'), expect.stringContaining('ell')]))).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`NotAllOf`, () =>
	{

		test('NotAllOf - 匹配成功 (並非所有都成功)', () =>
		{
			expect('abc').toEqual(new NotAllOf([expect.stringContaining('a'), expect.stringContaining('x')]));
		});

		test('NotAllOf - 匹配失敗 (所有都成功)', () =>
		{
			expect(() => expect('hello').toEqual(new NotAllOf([expect.stringContaining('h'), expect.stringContaining('ello')]))).toThrowErrorMatchingSnapshot();
		});

	});

	describe(`混合使用`, () =>
	{

		test('AllOf 內含 AnyOf', () =>
		{
			expect(actual).toMatchObject({
				versionNew: new AllOf([
					expect.any(String),
					new AnyOf([expect.stringMatching(/^2\./), expect.stringMatching(/^3\./)])
				])
			});
		});

		test('AnyOf 內含 AllOf', () =>
		{
			expect(actual).toMatchObject({
				versionNew: new AnyOf([
					new AllOf([expect.any(String), expect.stringMatching(/^2\./)]),
					null
				])
			});
		});

	});

});
