
import { isFloat, isInt, isNum } from '../src/index';

//const TEST_BIG_NUMBER = 14206147658;
const TEST_BIG_NUMBER = Number.MAX_SAFE_INTEGER;
const TEST_BIG_F = Number.MAX_SAFE_INTEGER * 0.5 - 0.9;

describe(`TEST_BIG_NUMBER: (${TEST_BIG_NUMBER})`, () =>
{
	test(`isNum(TEST_BIG_NUMBER)`, () =>
	{
		expect(isNum(TEST_BIG_NUMBER)).toBeTruthy();
	});

	test(`isInt(TEST_BIG_NUMBER)`, () =>
	{
		expect(isInt(TEST_BIG_NUMBER)).toBeTruthy();
	});

	test(`isFloat(TEST_BIG_NUMBER)`, () =>
	{
		expect(isFloat(TEST_BIG_NUMBER)).toBeFalsy();
	});

})

describe(`TEST_BIG_F: (${TEST_BIG_F})`, () =>
{
	test(`isNum(TEST_BIG_F)`, () =>
	{
		expect(isNum(TEST_BIG_F)).toBeTruthy();
	});

	test(`isInt(TEST_BIG_F)`, () =>
	{
		expect(isInt(TEST_BIG_F)).toBeFalsy();
	});

	test(`isFloat(TEST_BIG_F)`, () =>
	{
		expect(isFloat(TEST_BIG_F)).toBeTruthy();
	});

})
