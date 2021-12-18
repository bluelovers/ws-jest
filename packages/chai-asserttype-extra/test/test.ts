/**
 * Created by user on 2018/11/15/015.
 */

// @ts-ignore
import ChaiPluginAssertType from '../src/index';

import _chai from 'chai';

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

	{
		propName: 'nan',
		input: NaN,
	},
	{
		propName: 'infinity',
		input: Infinity,
	},
	{
		propName: 'finite',
		input: 1,
	},
	{
		propName: 'finite',
		input: Infinity,
		not: true,
	},
];

tests.forEach(function (testData)
{
	let method = expect(testData.input).to.be as any;

	if (testData.not)
	{
		method = method.not
	}

	if (testData.throw)
	{
		console.log(`expect(${JSON.stringify(testData.input)}) should throw when ${testData.not ? 'not ' : ''}${testData.propName}`);

		expect(function ()
		{
			// ts-ignore
			method[testData.propName]();
		}, testData.errMsg).to.throw();

		expect(function ()
		{
			// ts-ignore
			method[testData.propName];
		}, testData.errMsg).to.throw();
	}
	else
	{
		console.log(`expect(${JSON.stringify(testData.input)}) should is ${testData.not ? 'not ' : ''}${testData.propName}`);

		// ts-ignore
		method[testData.propName]();
		// ts-ignore
		method[testData.propName];
	}
});

console.log(`all test x ${tests.length} done`);
