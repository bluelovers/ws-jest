import { ITSOverwrite, ITSPickMember } from 'ts-type/lib/type/record';
import typeDetect from 'type-detect';

export declare type IChaiStatic = Chai.ChaiStatic;
export declare type IFnAssertion01 = ((expected?: any, msg?: any) => Chai.Assertion) & Chai.Assertion;
export declare type IAssertionInstalled2 = {
	[k in keyof typeof EnumTypeDetect]: IFnAssertion01;
} & {
	float: IFnAssertion01;
	integer: IFnAssertion01;
	infinity: IFnAssertion01;
	finite: IFnAssertion01;
	nan: IFnAssertion01;
};
export declare type IExpectStatic = ITSPickMember<IChaiStatic, "expect">;
export declare type IAssertion = ReturnType<IExpectStatic>;
export declare type IExpectStaticFail = ITSPickMember<IExpectStatic, "fail">;
export declare type IAssertionStatic<T = IAssertion> = {
	(target: any, message?: string): T;
	fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>;
};
export declare type ChaiObject = IChaiStatic;
export declare type IAssertionInstalled = {
	[K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
	[k in keyof typeof EnumTypeDetect]: ((expected?: any, msg?: any) => IAssertionInstalled) & IAssertionInstalled;
};
export declare type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>;
export declare type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
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
export declare namespace ChaiPluginAssertType {
	export var addToAssertion: typeof addToAssertion;
	export var ChaiPlugin: typeof ChaiPluginAssertType;
	export var typeOf: typeof typeDetect;
	export var install: typeof install;
	var _a: typeof ChaiPluginAssertType;
	export var list: typeof list;
	export { _a as default };
}
export declare function addToAssertionLazy<T extends ChaiObject>(chai: T, key: string | keyof IAssertionInstalled2, fnCheck: (v: any) => boolean, utils: any): void;
export declare function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: (this: IAssertionInstalled) => void, utils: any, fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void): void;
export declare function _assertType(target: IAssertionInstalled, typeName: string, bool: boolean, obj: any): any;
/**
 * auto install this plugin to chai
 */
export declare function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>;
export declare function list(): ReadonlyArray<string>;
export default ChaiPluginAssertType;

export {
	ChaiPluginAssertType as ChaiPlugin,
	typeDetect as typeOf,
};

export {};
