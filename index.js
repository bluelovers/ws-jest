"use strict";
/**
 * Created by user on 2018/11/13/013.
 */
const typeDetect = require("type-detect");
const check_1 = require("./lib/check");
var EnumTypeDetect;
(function (EnumTypeDetect) {
    EnumTypeDetect["array"] = "Array";
    EnumTypeDetect["boolean"] = "boolean";
    EnumTypeDetect["date"] = "Date";
    EnumTypeDetect["function"] = "function";
    //null = 'null',
    EnumTypeDetect["number"] = "number";
    EnumTypeDetect["object"] = "Object";
    EnumTypeDetect["regexp"] = "RegExp";
    EnumTypeDetect["string"] = "string";
    //undefined = 'undefined',
})(EnumTypeDetect || (EnumTypeDetect = {}));
function ChaiPluginAssertType(chai, utils) {
    // @ts-ignore
    const Assertion = chai.Assertion;
    // @ts-ignore
    Object.entries(EnumTypeDetect)
        .forEach(function ([key, value]) {
        let fn = function () {
            this.an(value);
            //utils.expectTypes(this, [value]);
        };
        addToAssertion(chai, key, fn, utils);
    });
    /*
    const oldString = Assertion.prototype.string;

    addToAssertion(chai, 'string', function ()
    {
        //utils.expectTypes(this, [EnumTypeDetect.number]);

        this.an('string')

    }, utils, function (...argv)
    {
        if (argv.length)
        {
            this.equal(...argv)
        }
    });
    */
    addToAssertion(chai, 'integer', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'integer', check_1.isInt(obj), obj);
    }, utils);
    addToAssertion(chai, 'float', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'float', check_1.isFloat(obj), obj);
    }, utils);
}
function addToAssertion(chai, key, fn, utils, fnMethod) {
    //chai.Assertion.addProperty(key, fn);
    //chai.Assertion.addMethod(key, fn);
    // @ts-ignore
    return chai.Assertion.addChainableMethod(key, fnMethod || function (...argv) {
        if (argv.length) {
            // @ts-ignore
            this.deep.equal(...argv);
        }
        /*
        if (typeof v !== 'undefined')
        {
            //let obj = utils.flag(this, 'object');
            //new chai.Assertion(obj).to.be.deep.equal(v);
            this.deep.equal(v);
        }
        */
    }, fn);
}
function _assertType(target, typeName, bool, obj) {
    // @ts-ignore
    return target.assert(bool, `expected #{this} to be an ${typeName}`, `expected #{this} to not be an ${typeName}`, obj);
}
/**
 * auto install this plugin to chai
 */
function install(chai) {
    // @ts-ignore
    let o = (chai || require('chai')).use(ChaiPluginAssertType);
    return o;
}
function list() {
    return Object.keys(EnumTypeDetect)
        .concat(['float', 'integer'])
        .sort();
}
//namespace ChaiPluginAssertType {}
ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.isNum = check_1.isNum;
ChaiPluginAssertType.isInt = check_1.isInt;
ChaiPluginAssertType.isFloat = check_1.isFloat;
ChaiPluginAssertType.list = list;
module.exports = ChaiPluginAssertType;
// @ts-ignore
//exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
//# sourceMappingURL=index.js.map