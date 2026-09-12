'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typeDetect = require('type-detect');
var checkBasic = require('@lazy-assert/check-basic');
var arrayHyperUnique = require('array-hyper-unique');

let EnumTypeDetect = /*#__PURE__*/function (EnumTypeDetect) {
  EnumTypeDetect["array"] = "Array";
  EnumTypeDetect["boolean"] = "boolean";
  EnumTypeDetect["date"] = "Date";
  EnumTypeDetect["function"] = "function";
  EnumTypeDetect["number"] = "number";
  EnumTypeDetect["object"] = "Object";
  EnumTypeDetect["regexp"] = "RegExp";
  EnumTypeDetect["string"] = "string";
  return EnumTypeDetect;
}({});
/**
 * Chai 類型斷言外掛程式主函式
 * Chai type assertion plugin main function
 *
 * 為 Chai 添加各種類型檢查方法（array、boolean、number、string 等）
 * Adds various type checking methods to Chai (array, boolean, number, string, etc.)
 *
 * @param chai - Chai 實例 / Chai instance
 * @param utils - Chai 工具物件 / Chai utilities
 */
function ChaiPluginAssertType(chai, utils) {
  // @ts-ignore
  Object.entries(EnumTypeDetect).forEach(function ([key, value]) {
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
/**
 * 延遲添加類型斷言方法
 * Lazily add type assertion method
 *
 * 使用外部檢查函數來驗證類型
 * Uses external check function to validate type
 *
 * @param chai - Chai 實例 / Chai instance
 * @param key - 方法名稱 / Method name
 * @param fnCheck - 類型檢查函數 / Type check function
 * @param utils - Chai 工具物件 / Chai utilities
 */
function addToAssertionLazy(chai, key, fnCheck, utils) {
  return addToAssertion(chai, key, function () {
    let obj = utils.flag(this, 'object');
    _assertType(this, key, fnCheck(obj), obj);
  });
}
/**
 * 添加斷言方法到 Chai
 * Add assertion method to Chai
 *
 * @param chai - Chai 實例 / Chai instance
 * @param key - 方法名稱 / Method name
 * @param fn - 斷言函數 / Assertion function
 * @param utils - Chai 工具物件 / Chai utilities
 * @param fnMethod - 可鏈式呼叫的方法函數 / Chainable method function
 */
function addToAssertion(chai, key, fn, utils, fnMethod) {
  // @ts-ignore
  return chai.Assertion.addChainableMethod(key, fnMethod || function (...argv) {
    if (argv.length) {
      // @ts-ignore
      this.deep.equal(...argv);
    }
  }, fn);
}
/**
 * 執行類型斷言
 * Execute type assertion
 *
 * @param target - 斷言目標 / Assertion target
 * @param typeName - 類型名稱 / Type name
 * @param bool - 檢查結果 / Check result
 * @param obj - 檢查的物件 / Object being checked
 */
function _assertType(target, typeName, bool, obj) {
  // @ts-ignore
  return target.assert(bool, `expected #{this} to be an ${typeName}`, `expected #{this} to not be an ${typeName}`, obj);
}
/**
 * 自動安裝此外掛程式到 Chai
 * Auto-install this plugin to Chai
 *
 * @param chai - 可選的 Chai 實例 / Optional Chai instance
 * @returns 已安裝的 Chai 實例 / Installed Chai instance
 */
function install(chai) {
  // @ts-ignore
  let o = (chai || require('chai')).use(ChaiPluginAssertType);
  return o;
}
/**
 * 取得所有支援的類型檢查方法列表
 * Get list of all supported type checking methods
 *
 * @returns 類型名稱陣列 / Array of type names
 */
function list() {
  // @ts-ignore
  return arrayHyperUnique.array_unique_overwrite(Object.keys(EnumTypeDetect).concat(['float', 'integer', 'nan', 'zero', 'positive', 'negative'])).sort();
}
const ChaiPlugin = {
  install
};
const typeOf = typeDetect;

exports.ChaiPlugin = ChaiPlugin;
exports.ChaiPluginAssertType = ChaiPluginAssertType;
exports.EnumTypeDetect = EnumTypeDetect;
exports._assertType = _assertType;
exports.addToAssertion = addToAssertion;
exports.addToAssertionLazy = addToAssertionLazy;
exports.default = ChaiPlugin;
exports.install = install;
exports.list = list;
exports.typeOf = typeOf;
//# sourceMappingURL=index.cjs.development.cjs.map
