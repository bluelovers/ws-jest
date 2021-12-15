/**
 * Created by user on 2018/11/13/013.
 */

import CHAI = require('chai');
import typeDetect = require('type-detect');
import { IAssertion, IAssertionStatic, IChaiStatic, ITSOverwrite } from './lib/type';
import { isFloat, isInt, isNum } from './lib/check';

export type ChaiObject = IChaiStatic

export type IAssertionInstalled = {
	[K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
	[k in keyof typeof EnumTypeDetect]: ((expected?, msg?) => IAssertionInstalled) & IAssertionInstalled;
} & {
	float: ((expected?, msg?) => IAssertionInstalled) & IAssertionInstalled;
	integer: ((expected?, msg?) => IAssertionInstalled) & IAssertionInstalled;
}

export type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>

export type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
	expect: IExpectStaticInstalled,
	//expect(target: any, message?: string): IAssertionInstalled
}>

enum EnumTypeDetect
{
	array = 'Array',
	boolean = 'boolean',
	date = 'Date',
	function = 'function',
	//null = 'null',
	number = 'number',
	object = 'Object',
	regexp = 'RegExp',
	string = 'string',
	//undefined = 'undefined',
}

function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils)
{
	// @ts-ignore
	const Assertion = chai.Assertion;

	// @ts-ignore
	Object.entries(EnumTypeDetect)
		.forEach(function ([key, value])
		{
			let fn = function (this: IAssertionInstalled)
			{
				this.an(value)

				//utils.expectTypes(this, [value]);
			};

			addToAssertion(chai, key, fn, utils);
		})
	;

	/*
	const oldString = Assertion.prototype.string;

	addToAssertion(chai, 'string', function ()
	{
		//utils.expectTypes(this, [EnumTypeDetect.number]);

		this.an('string')

	}, utils, function (...argv)
	{
		if (argv.length)
		{
			this.equal(...argv)
		}
	});
	*/

	addToAssertion(chai, 'integer', function ()
	{
		//utils.expectTypes(this, [EnumTypeDetect.number]);

		let obj = utils.flag(this, 'object');

		_assertType(this, 'integer', isInt(obj), obj)
	}, utils);

	addToAssertion(chai, 'float', function ()
	{
		//utils.expectTypes(this, [EnumTypeDetect.number]);

		let obj = utils.flag(this, 'object');

		_assertType(this, 'float', isFloat(obj), obj)
	}, utils);
}

function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: (this: IAssertionInstalled) => void , utils, fnMethod?: (this: IAssertionInstalled, ...argv) => void)
{
	//chai.Assertion.addProperty(key, fn);
	//chai.Assertion.addMethod(key, fn);

	// @ts-ignore
	return chai.Assertion.addChainableMethod(key, fnMethod || function(...argv)
	{
		if (argv.length)
		{
			// @ts-ignore
			this.deep.equal(...argv)
		}

		/*
		if (typeof v !== 'undefined')
		{
			//let obj = utils.flag(this, 'object');
			//new chai.Assertion(obj).to.be.deep.equal(v);
			this.deep.equal(v);
		}
		*/
	}, fn)
}

function _assertType(target: IAssertionInstalled, typeName: string, bool: boolean, obj)
{
	// @ts-ignore
	return target.assert(
		bool
		, `expected #{this} to be an ${typeName}`
		, `expected #{this} to not be an ${typeName}`
		, obj,
	);
}

/**
 * auto install this plugin to chai
 */
function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>
{
	// @ts-ignore
	let o = (chai || require('chai')).use(ChaiPluginAssertType);

	return o;
}

function list(): ReadonlyArray<string>
{
	return Object.keys(EnumTypeDetect)
		.concat(['float', 'integer'])
		.sort()
}

//namespace ChaiPluginAssertType {}

ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.isNum = isNum;
ChaiPluginAssertType.isInt = isInt;
ChaiPluginAssertType.isFloat = isFloat;
ChaiPluginAssertType.list = list;

// @ts-ignore
export = ChaiPluginAssertType

// @ts-ignore
//exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
