/**
 * Created by user on 2018/11/13/013.
 */
import CHAI = require('chai');
import typeDetect = require('type-detect');
declare type ChaiObject = Chai.ChaiStatic | typeof CHAI;
declare function ChaiPluginAssertType<T extends ChaiObject>(chai: T, utils: any): void;
declare namespace ChaiPluginAssertType {
    var addToAssertion: typeof addToAssertion;
    var ChaiPlugin: typeof ChaiPluginAssertType;
    var typeOf: typeof typeDetect;
    var install: typeof install;
    var default: typeof ChaiPluginAssertType;
    var isNum: typeof isNum;
    var isInt: typeof isInt;
    var isFloat: typeof isFloat;
    var list: typeof list;
}
declare function addToAssertion<T extends ChaiObject>(chai: T, key: string, fn: any): any;
/**
 * auto install this plugin to chai
 */
declare function install<T extends ChaiObject>(chai?: T): T;
declare function isNum(n: number): boolean;
declare function isInt(n: number): boolean;
declare function isFloat(n: number): boolean;
declare function list(): ReadonlyArray<string>;
export = ChaiPluginAssertType;
