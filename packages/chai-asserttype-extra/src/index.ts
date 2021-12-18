/**
 * Created by user on 2018/11/13/013.
 */

import typeDetect from 'type-detect';
import { IAssertion, IAssertionInstalled2, IAssertionStatic, IChaiAssertion, IChaiStatic } from './type';
import { isInfinity, isNaN, isFloat, isInt, isZero } from '@lazy-assert/check-basic';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import _chai from 'chai';

export type ChaiObject = IChaiStatic

export type IAssertionInstalled = {
	[K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
	[k in keyof typeof EnumTypeDetect]: ((expected?: any, msg?: any) => IAssertionInstalled) & IAssertionInstalled;
}

export type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>

export type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
	expect: IExpectStaticInstalled,
	//expect(target: any, message?: string): IAssertionInstalled
}>

export const enum EnumTypeDetect
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

export function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils: any)
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

	addToAssertionLazy(chai, 'integer', isInt, utils);

	addToAssertionLazy(chai, 'float', isFloat, utils);

	addToAssertionLazy(chai, 'infinity', isInfinity, utils);

	addToAssertionLazy(chai, 'finite', isFinite, utils);

	addToAssertionLazy(chai, 'nan', isNaN, utils);

	addToAssertionLazy(chai, 'zero', isZero, utils);
}

export function addToAssertionLazy<T extends ChaiObject>(chai: T,
	key: string | keyof IAssertionInstalled2,
	fnCheck: (v: any) => boolean,
	utils: any,
)
{
	return addToAssertion<T>(chai, key, function ()
	{
		//utils.expectTypes(this, [EnumTypeDetect.number]);

		let obj = utils.flag(this, 'object');

		_assertType(this, key, fnCheck(obj), obj)
	}, utils);
}

export function addToAssertion<T extends ChaiObject>(chai: T,
	key: string,
	fn: (this: IAssertionInstalled) => void,
	utils: any,
	fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void,
)
{
	//chai.Assertion.addProperty(key, fn);
	//chai.Assertion.addMethod(key, fn);

	// @ts-ignore
	return chai.Assertion.addChainableMethod(key, fnMethod || function (...argv)
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

export function _assertType(target: IAssertionInstalled, typeName: string, bool: boolean, obj: any)
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
export function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>
{
	// @ts-ignore
	let o = (chai || require('chai')).use(ChaiPluginAssertType);

	return o;
}

export function list(): ReadonlyArray<string>
{
	// @ts-ignore
	return Object.keys(EnumTypeDetect)
		.concat(['float', 'integer'])
		.sort()
}

export { ChaiPluginAssertType as ChaiPlugin }
export { typeDetect as typeOf }

//namespace ChaiPluginAssertType {}

ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.list = list;

// @ts-ignore
export default ChaiPluginAssertType

// @ts-ignore
//exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);