/**
 * Created by user on 2018/11/13/013.
 */

import CHAI = require('chai');
import typeDetect = require('type-detect');

type ChaiObject = Chai.ChaiStatic | typeof CHAI

enum EnumTypeDetect
{
	array = 'Array',
	boolean = 'boolean',
	date = 'Date',
	function = 'function',
	null = 'null',
	number = 'number',
	object = 'Object',
	regexp = 'RegExp',
	string = 'string',
	undefined = 'undefined',
}

function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils): chai is T
{
	// @ts-ignore
	const Assertion = chai.Assertion;

	Object.entries(EnumTypeDetect)
		.forEach(function ([key, value])
		{
			let fn = function (this)
			{
				utils.expectTypes(this, [value]);
			};

			Assertion.addProperty(key, fn);
			Assertion.addMethod(key, fn);
		})
	;

	Assertion.addProperty('integer', function ()
	{
		let fn = function (this)
		{
			//utils.expectTypes(this, [EnumTypeDetect.number]);

			let obj = utils.flag(this, 'object');

			_assertType(this, 'integer', isInt(obj), obj)
		};

		Assertion.addProperty('integer', fn);
		Assertion.addMethod('integer', fn);
	});

	Assertion.addProperty('float', function ()
	{
		let fn = function (this)
		{
			//utils.expectTypes(this, [EnumTypeDetect.number]);

			let obj = utils.flag(this, 'object');

			_assertType(this, 'float', isFloat(obj), obj)
		};

		Assertion.addProperty('float', fn);
		Assertion.addMethod('float', fn);
	});

	return true
}

function _assertType(target, typeName: string, bool: boolean, obj)
{
	return target.assert(
		isFloat(obj)
		, `expected #{this} to be an ${typeName}`
		, `expected #{this} to not be an ${typeName}`
		, obj,
	);
}

/**
 * auto install this plugin to chai
 */
function install<T extends ChaiObject>(chai?: T): T
{
	return (chai || require('chai')).use(ChaiPluginAssertType)
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
exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
