/**
 * Created by user on 2018/11/13/013.
 */
/// <reference types="chai" />
import typeDetect = require('type-detect');
import { IChaiStatic, IAssertion, IAssertionStatic, IOverwrite } from './lib/type';
export declare type ChaiObject = IChaiStatic;
export declare type IAssertionInstalled = {
    [K in keyof IAssertion]: IAssertion[K] & IAssertionInstalled;
} & {
    [k in keyof typeof EnumTypeDetect]: (() => IAssertionInstalled) & IAssertionInstalled;
} & {
    float: (() => IAssertionInstalled) & IAssertionInstalled;
    integer: (() => IAssertionInstalled) & IAssertionInstalled;
};
export declare type IExpectStaticInstalled = IAssertionStatic<IAssertionInstalled>;
export declare type IChaiInstalled<T extends IChaiStatic> = IOverwrite<T, {
    expect: IExpectStaticInstalled;
}>;
declare enum EnumTypeDetect {
    array = "Array",
    boolean = "boolean",
    date = "Date",
    function = "function",
    number = "number",
    object = "Object",
    regexp = "RegExp"
}
declare function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils: any): void;
declare namespace ChaiPluginAssertType {
    var addToAssertion: typeof addToAssertion;
    var ChaiPlugin: {
        <T extends Chai.ChaiStatic>(chai: T, utils: any): void;
        addToAssertion: typeof addToAssertion;
        ChaiPlugin: any;
        typeOf: typeof typeDetect;
        install: typeof install;
        default: any;
        isNum: typeof isNum;
        isInt: typeof isInt;
        isFloat: typeof isFloat;
        list: typeof list;
    };
    var typeOf: typeof typeDetect;
    var install: typeof install;
    var default: {
        <T extends Chai.ChaiStatic>(chai: T, utils: any): void;
        addToAssertion: typeof addToAssertion;
        ChaiPlugin: any;
        typeOf: typeof typeDetect;
        install: typeof install;
        default: any;
        isNum: typeof isNum;
        isInt: typeof isInt;
        isFloat: typeof isFloat;
        list: typeof list;
    };
    var isNum: typeof isNum;
    var isInt: typeof isInt;
    var isFloat: typeof isFloat;
    var list: typeof list;
}
declare function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: any): any;
/**
 * auto install this plugin to chai
 */
declare function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>;
declare function isNum(n: number): boolean;
declare function isInt(n: number): boolean;
declare function isFloat(n: number): boolean;
declare function list(): ReadonlyArray<string>;
//declare namespace ChaiPluginAssertType { }
export = ChaiPluginAssertType;
