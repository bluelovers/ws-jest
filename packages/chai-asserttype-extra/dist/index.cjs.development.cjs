'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typeDetect = require('type-detect');
var checkBasic = require('@lazy-assert/check-basic');
var arrayHyperUnique = require('array-hyper-unique');

/**
 * Created by user on 2018/11/13/013.
 */
exports.EnumTypeDetect = void 0;
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
})(exports.EnumTypeDetect || (exports.EnumTypeDetect = {}));
function ChaiPluginAssertType(chai, utils) {
  // @ts-ignore
  Object.entries(exports.EnumTypeDetect).forEach(function ([key, value]) {
    let fn = function () {
      this.an(value);
      //utils.expectTypes(this, [value]);
    };

    addToAssertion(chai, key, fn);
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
    //utils.expectTypes(this, [EnumTypeDetect.number]);
    let obj = utils.flag(this, 'object');
    _assertType(this, key, fnCheck(obj), obj);
  });
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
  // @ts-ignore
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
