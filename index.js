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
    EnumTypeDetect["null"] = "null";
    EnumTypeDetect["number"] = "number";
    EnumTypeDetect["object"] = "Object";
    EnumTypeDetect["regexp"] = "RegExp";
    EnumTypeDetect["string"] = "string";
    EnumTypeDetect["undefined"] = "undefined";
})(EnumTypeDetect || (EnumTypeDetect = {}));
function ChaiPluginAssertType(chai, utils) {
    // @ts-ignore
    const Assertion = chai.Assertion;
    Object.entries(EnumTypeDetect)
        .forEach(function ([key, value]) {
        let fn = function () {
            utils.expectTypes(this, [value]);
        };
        addToAssertion(chai, key, fn);
    });
    addToAssertion(chai, 'integer', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'integer', isInt(obj), obj);
    });
    addToAssertion(chai, 'float', function () {
        //utils.expectTypes(this, [EnumTypeDetect.number]);
        let obj = utils.flag(this, 'object');
        _assertType(this, 'float', isFloat(obj), obj);
    });
}
function addToAssertion(chai, key, fn) {
    //chai.Assertion.addProperty(key, fn);
    //chai.Assertion.addMethod(key, fn);
    // @ts-ignore
    return chai.Assertion.addChainableMethod(key, fn, fn);
}
function _assertType(target, typeName, bool, obj) {
    return target.assert(isFloat(obj), `expected #{this} to be an ${typeName}`, `expected #{this} to not be an ${typeName}`, obj);
}
/**
 * auto install this plugin to chai
 */
function install(chai) {
    return (chai || require('chai')).use(ChaiPluginAssertType);
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
ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect;
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.isNum = isNum;
ChaiPluginAssertType.isInt = isInt;
ChaiPluginAssertType.isFloat = isFloat;
ChaiPluginAssertType.list = list;
// @ts-ignore
exports = ChaiPluginAssertType = Object.freeze(ChaiPluginAssertType);
module.exports = ChaiPluginAssertType;
