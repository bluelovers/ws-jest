'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typeDetect = require('type-detect');
var checkBasic = require('@lazy-assert/check-basic');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var typeDetect__default = /*#__PURE__*/_interopDefaultLegacy(typeDetect);

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
  return Object.keys(exports.EnumTypeDetect).concat(['float', 'integer']).sort();
}
ChaiPluginAssertType.addToAssertion = addToAssertion;
ChaiPluginAssertType.ChaiPlugin = ChaiPluginAssertType;
ChaiPluginAssertType.typeOf = typeDetect__default["default"];
ChaiPluginAssertType.install = install;
ChaiPluginAssertType.default = ChaiPluginAssertType;
ChaiPluginAssertType.list = list;

Object.defineProperty(exports, 'typeOf', {
	enumerable: true,
	get: function () { return typeDetect__default["default"]; }
});
exports.ChaiPlugin = ChaiPluginAssertType;
exports.ChaiPluginAssertType = ChaiPluginAssertType;
exports._assertType = _assertType;
exports.addToAssertion = addToAssertion;
exports.addToAssertionLazy = addToAssertionLazy;
exports["default"] = ChaiPluginAssertType;
exports.install = install;
exports.list = list;
//# sourceMappingURL=index.cjs.development.cjs.map
