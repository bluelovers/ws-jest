/**
 * Created by user on 2018/11/13/013.
 */
const typeDetect = require("type-detect");
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
    //string = 'string',
    //undefined = 'undefined',
})(EnumTypeDetect || (EnumTypeDetect = {}));
function ChaiPluginAssertType(chai, utils) {
    // @ts-ignore
    const Assertion = chai.Assertion;
    Object.entries(EnumTypeDetect)
        .forEach(function ([key, value]) {
        let fn = function () {
            utils.expectTypes(this, [value]);
        };
        addToAssertion(chai, key, fn, utils);
    });
    addToAssertion(chai, 'integer', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'integer', isInt(obj), obj);
    }, utils);
    addToAssertion(chai, 'float', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'float', isFloat(obj), obj);
    }, utils);
}
function addToAssertion(chai, key, fn, utils) {
    //chai.Assertion.addProperty(key, fn);
    //chai.Assertion.addMethod(key, fn);
    // @ts-ignore
    return chai.Assertion.addChainableMethod(key, function (v) {
        if (typeof v !== 'undefined') {
            let obj = utils.flag(this, 'object');
            new chai.Assertion(obj).to.be.deep.equal(v);
        }
    }, fn);
}
function _assertType(target, typeName, bool, obj) {
    return target.assert(bool, `expected #{this} to be an ${typeName}`, `expected #{this} to not be an ${typeName}`, obj);
}
/**
 * auto install this plugin to chai
 */
function install(chai) {
    let o = (chai || require('chai')).use(ChaiPluginAssertType);
    return o;
}
function isNum(n) {
    return n === +n;
}
function isInt(n) {
    return n === (n | 0);
}
function isFloat(n) {
    return n === +n && n !== (n | 0);
}
function list() {
    return Object.keys(EnumTypeDetect)
        .concat(['float', 'integer'])
        .sort();
}
//namespace ChaiPluginAssertType{}
ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.isNum = isNum;
ChaiPluginAssertType.isInt = isInt;
ChaiPluginAssertType.isFloat = isFloat;
ChaiPluginAssertType.list = list;
module.exports = ChaiPluginAssertType;
// @ts-ignore
//exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
