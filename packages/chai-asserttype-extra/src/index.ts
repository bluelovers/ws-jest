/**
 * Created by user on 2018/11/13/013.
 *
 * Chai 類型斷言外掛程式
 * Chai type assertion plugin
 */

import typeDetect from 'type-detect';
import { IAssertionInstalled2, IAssertionStatic, IChaiStatic } from './type';
import { isFloat, isInfinity, isInt, isNaN, isNegative, isPositive, isZero } from '@lazy-assert/check-basic';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import { array_unique_overwrite } from 'array-hyper-unique';

/** Chai 物件類型 / Chai object type */
export type ChaiObject = IChaiStatic

/** 已安裝斷言類型 / Installed assertion type */
export type IAssertionInstalled = Chai.Assertion & IAssertionInstalled2

/** 已安裝 Expect 靜態類型 / Installed expect static type */
export type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>

/** 已安裝 Chai 類型 / Installed Chai type */
export type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
	expect: IExpectStaticInstalled,
}>

/**
 * 類型檢測列舉
 * Type detection enumeration
 */
export const enum EnumTypeDetect
{
	/** 陣列 / Array */
	array = 'Array',
	/** 布林值 / Boolean */
	boolean = 'boolean',
	/** 日期 / Date */
	date = 'Date',
	/** 函式 / Function */
	function = 'function',
	/** 數字 / Number */
	number = 'number',
	/** 物件 / Object */
	object = 'Object',
	/** 正規表示式 / RegExp */
	regexp = 'RegExp',
	/** 字串 / String */
	string = 'string',
	//undefined = 'undefined',
}

/**
 * Chai 類型斷言外掛程式主函式
 * Chai type assertion plugin main function
 *
 * 為 Chai 添加各種類型檢查方法（array、boolean、number、string 等）
 * Adds various type checking methods to Chai (array, boolean, number, string, etc.)
 *
 * @param chai - Chai 實例 / Chai instance
 * @param utils - Chai 工具物件 / Chai utilities
 */
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

	// 添加自定義類型檢查 / Add custom type checks
	addToAssertionLazy(chai, 'integer', isInt, utils);
	addToAssertionLazy(chai, 'float', isFloat, utils);
	addToAssertionLazy(chai, 'infinity', isInfinity, utils);
	addToAssertionLazy(chai, 'nan', isNaN, utils);
	addToAssertionLazy(chai, 'zero', isZero, utils);
	addToAssertionLazy(chai, 'positive', isPositive, utils);
	addToAssertionLazy(chai, 'negative', isNegative, utils);
}

/**
 * 延遲添加類型斷言方法
 * Lazily add type assertion method
 *
 * 使用外部檢查函數來驗證類型
 * Uses external check function to validate type
 *
 * @param chai - Chai 實例 / Chai instance
 * @param key - 方法名稱 / Method name
 * @param fnCheck - 類型檢查函數 / Type check function
 * @param utils - Chai 工具物件 / Chai utilities
 */
export function addToAssertionLazy<T extends ChaiObject>(chai: T,
	key: keyof IAssertionInstalled2,
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

/**
 * 添加斷言方法到 Chai
 * Add assertion method to Chai
 *
 * @param chai - Chai 實例 / Chai instance
 * @param key - 方法名稱 / Method name
 * @param fn - 斷言函數 / Assertion function
 * @param utils - Chai 工具物件 / Chai utilities
 * @param fnMethod - 可鏈式呼叫的方法函數 / Chainable method function
 */
export function addToAssertion<T extends ChaiObject>(chai: T,
	key: string,
	fn: (this: IAssertionInstalled) => void,
	utils: any,
	fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void,
)
{
	// @ts-ignore
	return chai.Assertion.addChainableMethod(key, fnMethod || function (...argv)
	{
		if (argv.length)
		{
			// @ts-ignore
			this.deep.equal(...argv)
		}
	}, fn)
}

/**
 * 執行類型斷言
 * Execute type assertion
 *
 * @param target - 斷言目標 / Assertion target
 * @param typeName - 類型名稱 / Type name
 * @param bool - 檢查結果 / Check result
 * @param obj - 檢查的物件 / Object being checked
 */
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
 * 自動安裝此外掛程式到 Chai
 * Auto-install this plugin to Chai
 *
 * @param chai - 可選的 Chai 實例 / Optional Chai instance
 * @returns 已安裝的 Chai 實例 / Installed Chai instance
 */
export function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>
{
	// @ts-ignore
	let o = (chai || require('chai')).use(ChaiPluginAssertType);

	return o;
}

/**
 * 取得所有支援的類型檢查方法列表
 * Get list of all supported type checking methods
 *
 * @returns 類型名稱陣列 / Array of type names
 */
export function list(): ReadonlyArray<keyof IAssertionInstalled2>
{
	// @ts-ignore
	return array_unique_overwrite(Object.keys(EnumTypeDetect)
		.concat([
			'float',
			'integer',
			'nan',
			'zero',
			'positive',
			'negative',
		]))
		.sort()
}

/** Chai 外掛程式物件 / Chai plugin object */
export const ChaiPlugin = {
	install,
}

/** 類型檢測函數 / Type detect function */
export const typeOf = typeDetect;

export default ChaiPlugin
