/**
 * Created by user on 2018/11/15/015.
 */

import chai = require('chai');

export type IChaiStatic = typeof chai

export type IPickMember<T, K extends keyof T> = T[K]

export type IDiff<T extends keyof any, U extends keyof any> =
	({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type IOverwrite<T, U> = Pick<T, IDiff<keyof T, keyof U>> & U;

export type IExpectStatic = IPickMember<IChaiStatic, "expect">

export type IAssertion = ReturnType<IExpectStatic>

export type IExpectStaticFail = IPickMember<IExpectStatic, "fail">

export type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>,
}
