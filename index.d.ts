/**
 * Created by user on 2018/11/13/013.
 */
/// <reference types="chai" />
import typeDetect = require('type-detect');
import { IAssertion, IAssertionStatic, IChaiStatic, ITSOverwrite } from './lib/type';
export declare type ChaiObject = IChaiStatic;
export declare type IAssertionInstalled = {
    [K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
    [k in keyof typeof EnumTypeDetect]: ((expected?: any, msg?: any) => IAssertionInstalled) & IAssertionInstalled;
} & {
    float: ((expected?: any, msg?: any) => IAssertionInstalled) & IAssertionInstalled;
    integer: ((expected?: any, msg?: any) => IAssertionInstalled) & IAssertionInstalled;
};
export declare type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>;
export declare type IChaiInstalled<T extends IChaiStatic> = ITSOverwrite<T, {
    expect: IExpectStaticInstalled;
}>;
declare enum EnumTypeDetect {
    array = "Array",
    boolean = "boolean",
    date = "Date",
    function = "function",
    number = "number",
    object = "Object",
    regexp = "RegExp",
    string = "string"
}
declare function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils: any): void;
declare namespace ChaiPluginAssertType {
    export var addToAssertion: <T extends Chai.ChaiStatic>(chai: T, key: string, fn: (this: IAssertionInstalled) => void, utils: any, fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void) => void;
    export var ChaiPlugin: typeof import(".");
    export var typeOf: typeof typeDetect;
    export var install: <T extends Chai.ChaiStatic>(chai?: T) => IChaiInstalled<T>;
    var _a: typeof import(".");
    export var isNum: typeof import("./lib/check").isNum;
    export var isInt: typeof import("./lib/check").isInt;
    export var isFloat: typeof import("./lib/check").isFloat;
    export var list: () => readonly string[];
    export { _a as default };
}
export = ChaiPluginAssertType;
