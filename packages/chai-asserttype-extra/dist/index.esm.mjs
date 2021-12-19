import typeDetect from 'type-detect';
import { isFloat, isInfinity, isNaN, isZero, isInt } from '@lazy-assert/check-basic';

var EnumTypeDetect;

(function (EnumTypeDetect) {
  EnumTypeDetect["array"] = "Array";
  EnumTypeDetect["boolean"] = "boolean";
  EnumTypeDetect["date"] = "Date";
  EnumTypeDetect["function"] = "function";
  EnumTypeDetect["number"] = "number";
  EnumTypeDetect["object"] = "Object";
  EnumTypeDetect["regexp"] = "RegExp";
  EnumTypeDetect["string"] = "string";
})(EnumTypeDetect || (EnumTypeDetect = {}));

function ChaiPluginAssertType(chai, utils) {
  Object.entries(EnumTypeDetect).forEach(function ([key, value]) {
    let fn = function () {
      this.an(value);
    };

    addToAssertion(chai, key, fn);
  });
  addToAssertionLazy(chai, 'integer', isInt, utils);
  addToAssertionLazy(chai, 'float', isFloat, utils);
  addToAssertionLazy(chai, 'infinity', isInfinity, utils);
  addToAssertionLazy(chai, 'nan', isNaN, utils);
  addToAssertionLazy(chai, 'zero', isZero, utils);
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
  return Object.keys(EnumTypeDetect).concat(['float', 'integer']).sort();
}
const typeOf = typeDetect;

export { ChaiPluginAssertType as ChaiPlugin, ChaiPluginAssertType, EnumTypeDetect, _assertType, addToAssertion, addToAssertionLazy, ChaiPluginAssertType as default, install, list, typeOf };
//# sourceMappingURL=index.esm.mjs.map
