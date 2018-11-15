/**
 * Created by user on 2018/11/15/015.
 */

import chai = require('chai');
import { ITSDiff, ITSOverwrite, ITSPickMember } from 'ts-type';

export { ITSDiff, ITSOverwrite, ITSPickMember }

export type IChaiStatic = typeof chai

export type IExpectStatic = ITSPickMember<IChaiStatic, "expect">

export type IAssertion = ReturnType<IExpectStatic>

export type IExpectStaticFail = ITSPickMember<IExpectStatic, "fail">

export type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>,
}
