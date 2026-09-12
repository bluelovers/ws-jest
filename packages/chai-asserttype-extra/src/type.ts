/**
 * Created by user on 2018/11/15/015.
 *
 * Chai 類型斷言類型定義
 * Chai type assertion type definitions
 */

import { ITSPickMember } from 'ts-type';
import { EnumTypeDetect } from './index';

/** Chai 靜態類型 / Chai static type */
export type IChaiStatic = Chai.ChaiStatic

/** 斷言函式類型（支援參數和無參數呼叫）/ Assertion function type (supports with/without args) */
export type IFnAssertion01 = ((expected?: any, msg?: any) => Chai.Assertion) & Chai.Assertion;

/**
 * 已安裝的斷言方法介面
 * Installed assertion methods interface
 */
export type IAssertionInstalled2 = {
	[k in keyof typeof EnumTypeDetect]: IFnAssertion01;
} & {
	/** 浮點數檢查 / Float check */
	float: IFnAssertion01;
	/** 整數檢查 / Integer check */
	integer: IFnAssertion01;
	/** 無限大檢查 / Infinity check */
	infinity: IFnAssertion01;
	/** NaN 檢查 / NaN check */
	nan: IFnAssertion01;
	/** 零值檢查 / Zero check */
	zero: IFnAssertion01;
	/** 正數檢查 / Positive check */
	positive: IFnAssertion01;
	/** 負數檢查 / Negative check */
	negative: IFnAssertion01;
}

/**
 * Chai 斷言介面擴展
 * Chai assertion interface extension
 */
export interface IChaiAssertion extends IAssertionInstalled2
{

}

declare global
{
	export namespace Chai
	{
		interface Assertion extends IChaiAssertion
		{

		}
	}
}

/** Expect 靜態類型 / Expect static type */
export type IExpectStatic = ITSPickMember<IChaiStatic, "expect">

/** 斷言類型 / Assertion type */
export type IAssertion = ReturnType<IExpectStatic>

/** Expect 失敗函式類型 / Expect fail function type */
export type IExpectStaticFail = ITSPickMember<IExpectStatic, "fail">

/**
 * 斷言靜態類型
 * Assertion static type
 */
export type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>,
}
