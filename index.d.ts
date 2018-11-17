/**
 * Created by user on 2018/11/13/013.
 */
/// <reference types="chai" />
import typeDetect = require('type-detect');
import { IChaiStatic, IAssertion, IAssertionStatic, ITSOverwrite } from './lib/type';
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
enum EnumTypeDetect {
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
function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: (this: IAssertionInstalled) => void, utils: any, fnMethod?: (this: IAssertionInstalled, ...argv: any[]) => void): any;
/**
 * auto install this plugin to chai
 */
function install<T extends ChaiObject>(chai?: T): IChaiInstalled<T>;
function isNum(n: number): boolean;
function isInt(n: number): boolean;
function isFloat(n: number): boolean;
function list(): ReadonlyArray<string>;
//declare namespace ChaiPluginAssertType { }
export = ChaiPluginAssertType;
