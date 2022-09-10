import { ITSOverwrite, ITSPickMember } from 'ts-type/lib/type/record';
import typeDetect from 'type-detect';

export type IChaiStatic = Chai.ChaiStatic;
export type IFnAssertion01 = ((expected?: any, msg?: any) => Chai.Assertion) & Chai.Assertion;
export type IAssertionInstalled2 = {
	[k in keyof typeof EnumTypeDetect]: IFnAssertion01;
} & {
	float: IFnAssertion01;
	integer: IFnAssertion01;
	infinity: IFnAssertion01;
	nan: IFnAssertion01;
	zero: IFnAssertion01;
	positive: IFnAssertion01;
	negative: IFnAssertion01;
};
declare global {
	export namespace Chai {
		interface Assertion extends IChaiAssertion {
		}
	}
}
export type IExpectStatic = ITSPickMember<IChaiStatic, "expect">;
export type IAssertion = ReturnType<IExpectStatic>;
export type IExpectStaticFail = ITSPickMember<IExpectStatic, "fail">;
export type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>;
};
export type ChaiObject = IChaiStatic;
export type IAssertionInstalled = Chai.Assertion & IAssertionInstalled2;
export type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>;
export type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
	expect: IExpectStaticInstalled;
}>;
export declare const enum EnumTypeDetect {
	array = "Array",
	boolean = "boolean",
	date = "Date",
	function = "function",
	number = "number",
	object = "Object",
	regexp = "RegExp",
	string = "string"
}
export declare function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils: any): void;
export declare function addToAssertionLazy<T extends ChaiObject>(chai: T, key: keyof IAssertionInstalled2, fnCheck: (v: any) => boolean, utils: any): void;
export declare function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: (this: IAssertionInstalled) => void, utils: any, fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void): void;
export declare function _assertType(target: IAssertionInstalled, typeName: string, bool: boolean, obj: any): any;
/**
 * auto install this plugin to chai
 */
export declare function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>;
export declare function list(): ReadonlyArray<keyof IAssertionInstalled2>;
export declare const ChaiPlugin: {
	install: typeof install;
};
export declare const typeOf: typeof typeDetect;

export {
	ChaiPlugin as default,
};

export {};
