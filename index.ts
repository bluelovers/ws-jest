/**
 * Created by user on 2018/11/13/013.
 */

import CHAI = require('chai');
import typeDetect = require('type-detect');
import { IChaiStatic, IAssertion, IExpectStatic, IAssertionStatic, ITSOverwrite } from './lib/type';

export type ChaiObject = IChaiStatic

export type IAssertionInstalled = {
	[K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
	[k in keyof typeof EnumTypeDetect]: ((expected?) => IAssertionInstalled) & IAssertionInstalled;
} & {
	float: ((expected?) => IAssertionInstalled) & IAssertionInstalled;
	integer: ((expected?) => IAssertionInstalled) & IAssertionInstalled;
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
	//string = 'string',
	//undefined = 'undefined',
}

function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils)
{
	// @ts-ignore
	const Assertion = chai.Assertion;

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

	addToAssertion(chai, 'integer', function (this)
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

function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: (this: IAssertionInstalled) => void , utils)
{
	//chai.Assertion.addProperty(key, fn);
	//chai.Assertion.addMethod(key, fn);

	// @ts-ignore
	return chai.Assertion.addChainableMethod(key, function(v)
	{
		if (typeof v !== 'undefined')
		{
			//let obj = utils.flag(this, 'object');
			//new chai.Assertion(obj).to.be.deep.equal(v);
			this.deep.equal(v);
		}
	}, fn)
}

function _assertType(target: IAssertionInstalled, typeName: string, bool: boolean, obj)
{
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
	let o = (chai || require('chai')).use(ChaiPluginAssertType);

	return o;
}

function isNum(n: number)
{
	return n === +n
}

function isInt(n: number)
{
	return n === (n | 0)
}

function isFloat(n: number)
{
	return n === +n && n !== (n | 0);
}

function list(): ReadonlyArray<string>
{
	return Object.keys(EnumTypeDetect)
		.concat(['float', 'integer'])
		.sort()
}

//namespace ChaiPluginAssertType{}

ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.isNum = isNum;
ChaiPluginAssertType.isInt = isInt;
ChaiPluginAssertType.isFloat = isFloat;
ChaiPluginAssertType.list = list;

export = ChaiPluginAssertType

// @ts-ignore
//exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
