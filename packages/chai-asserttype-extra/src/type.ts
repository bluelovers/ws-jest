/**
 * Created by user on 2018/11/15/015.
 */

import { ITSPickMember } from 'ts-type/lib/type/record';
import { EnumTypeDetect } from './index';

export type IChaiStatic = Chai.ChaiStatic

export type IFnAssertion01 = ((expected?: any, msg?: any) => Chai.Assertion) & Chai.Assertion;

export type IAssertionInstalled2 = {
	[k in keyof typeof EnumTypeDetect]: IFnAssertion01;
} & {
	float: IFnAssertion01;
	integer: IFnAssertion01;
	infinity: IFnAssertion01;
	nan: IFnAssertion01;
	zero: IFnAssertion01;
}

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

export type IExpectStatic = ITSPickMember<IChaiStatic, "expect">

export type IAssertion = ReturnType<IExpectStatic>

export type IExpectStaticFail = ITSPickMember<IExpectStatic, "fail">

export type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>,
}
