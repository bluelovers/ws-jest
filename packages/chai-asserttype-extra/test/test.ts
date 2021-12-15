/**
 * Created by user on 2018/11/15/015.
 */

// @ts-ignore
import ChaiPluginAssertType = require('chai-asserttype-extra');

import _chai = require('chai');

//chai.use(ChaiPluginAssertType);
const chai = ChaiPluginAssertType.install(_chai);

let { expect } = chai;

export { expect }

const tests: {
	propName: string,
	input: unknown,
	errMsg?: string,
	throw?: boolean,
	not?: boolean,
}[] = [
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
	{
		propName: 'float',
		input: '27.5',
		not: true,
	},
	{
		propName: 'function',
		input: '27.5',
		not: true,
	},
	{
		propName: 'regexp',
		input: '27.5',
		not: true,
	},
	{
		propName: 'number',
		input: '27.5',
		not: true,
	},
	{
		propName: 'integer',
		input: '27.5',
		not: true,
	},
	{
		propName: 'boolean',
		input: '27.5',
		not: true,
	},
	{
		propName: 'array',
		input: '27.5',
		not: true,
	},
];

tests.forEach(function (testData)
{
	let method = expect(testData.input).to.be;

	if (testData.not)
	{
		method = method.not
	}

	if (testData.throw)
	{
		console.log(`expect(${JSON.stringify(testData.input)}) should throw when ${testData.not ? 'not ' : ''}${testData.propName}`);

		expect(function ()
		{
			method[testData.propName]();
		}, testData.errMsg).to.throw();

		expect(function ()
		{
			method[testData.propName];
		}, testData.errMsg).to.throw();
	}
	else
	{
		console.log(`expect(${JSON.stringify(testData.input)}) should is ${testData.not ? 'not ' : ''}${testData.propName}`);

		method[testData.propName]();
		method[testData.propName];
	}
});

console.log(`all test x ${tests.length} done`);
