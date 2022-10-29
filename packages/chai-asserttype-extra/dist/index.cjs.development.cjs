'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typeDetect = require('type-detect');
var checkBasic = require('@lazy-assert/check-basic');
var arrayHyperUnique = require('array-hyper-unique');

exports.EnumTypeDetect = void 0;
(function (EnumTypeDetect) {
  EnumTypeDetect["array"] = "Array";
  EnumTypeDetect["boolean"] = "boolean";
  EnumTypeDetect["date"] = "Date";
  EnumTypeDetect["function"] = "function";
  EnumTypeDetect["number"] = "number";
  EnumTypeDetect["object"] = "Object";
  EnumTypeDetect["regexp"] = "RegExp";
  EnumTypeDetect["string"] = "string";
})(exports.EnumTypeDetect || (exports.EnumTypeDetect = {}));
function ChaiPluginAssertType(chai, utils) {
  Object.entries(exports.EnumTypeDetect).forEach(function ([key, value]) {
    let fn = function () {
      this.an(value);
    };
    addToAssertion(chai, key, fn);
  });
  addToAssertionLazy(chai, 'integer', checkBasic.isInt, utils);
  addToAssertionLazy(chai, 'float', checkBasic.isFloat, utils);
  addToAssertionLazy(chai, 'infinity', checkBasic.isInfinity, utils);
  addToAssertionLazy(chai, 'nan', checkBasic.isNaN, utils);
  addToAssertionLazy(chai, 'zero', checkBasic.isZero, utils);
  addToAssertionLazy(chai, 'positive', checkBasic.isPositive, utils);
  addToAssertionLazy(chai, 'negative', checkBasic.isNegative, utils);
}
function addToAssertionLazy(chai, key, fnCheck, utils) {
  return addToAssertion(chai, key, function () {
    let obj = utils.flag(this, 'object');
    _assertType(this, key, fnCheck(obj), obj);
  });
}
function addToAssertion(chai, key, fn, utils, fnMethod) {
  return chai.Assertion.addChainableMethod(key, fnMethod || function (...argv) {
    if (argv.length) {
      this.deep.equal(...argv);
    }
  }, fn);
}
function _assertType(target, typeName, bool, obj) {
  return target.assert(bool, `expected #{this} to be an ${typeName}`, `expected #{this} to not be an ${typeName}`, obj);
}
function install(chai) {
  let o = (chai || require('chai')).use(ChaiPluginAssertType);
  return o;
}
function list() {
  return arrayHyperUnique.array_unique_overwrite(Object.keys(exports.EnumTypeDetect).concat(['float', 'integer', 'nan', 'zero', 'positive', 'negative'])).sort();
}
const ChaiPlugin = {
  install
};
const typeOf = typeDetect;

exports.ChaiPlugin = ChaiPlugin;
exports.ChaiPluginAssertType = ChaiPluginAssertType;
exports._assertType = _assertType;
exports.addToAssertion = addToAssertion;
exports.addToAssertionLazy = addToAssertionLazy;
exports.default = ChaiPlugin;
exports.install = install;
exports.list = list;
exports.typeOf = typeOf;
//# sourceMappingURL=index.cjs.development.cjs.map
