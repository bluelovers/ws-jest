/**
 * Created by user on 2018/11/15/015.
 */

import ChaiPluginAssertType = require('chai-asserttype-extra');

import _chai = require('chai');

//chai.use(ChaiPluginAssertType);
const chai = ChaiPluginAssertType.install(_chai);

let { expect } = chai;

export { expect }

const tests = [
	{
		propName: 'integer',
		input: 27,
	},
	{
		propName: 'integer',
		input: 27.5,
		throw: true,
	},
	{
		propName: 'float',
		input: 27.5,
	},
	{
		propName: 'float',
		input: 27,
		throw: true,
	},
] as {
	propName: string,
	input: unknown,
	errMsg?: string,
	throw?: boolean,
}[];

tests.forEach(function (testData)
{
	if (testData.throw)
	{
		console.log(`expect(${testData.input}) should throw when ${testData.propName}`);

		expect(function ()
		{
			expect(testData.input).to.be[testData.propName]();
		}, testData.errMsg).to.throw();

		expect(function ()
		{
			expect(testData.input).to.be[testData.propName];
		}, testData.errMsg).to.throw();
	}
	else
	{
		console.log(`expect(${testData.input}) should is ${testData.propName}`);

		expect(testData.input).to.be[testData.propName]();
		expect(testData.input).to.be[testData.propName];
	}
});

console.log(`all test x ${tests.length} done`);
