"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("type-detect"), t = require("@lazy-assert/check-basic"), s = require("array-hyper-unique");

let i = /*#__PURE__*/ function(e) {
  return e.array = "Array", e.boolean = "boolean", e.date = "Date", e.function = "function", 
  e.number = "number", e.object = "Object", e.regexp = "RegExp", e.string = "string", 
  e;
}({});

function ChaiPluginAssertType(e, s) {
  Object.entries(i).forEach(function([t, s]) {
    addToAssertion(e, t, function() {
      this.an(s);
    });
  }), addToAssertionLazy(e, "integer", t.isInt, s), addToAssertionLazy(e, "float", t.isFloat, s), 
  addToAssertionLazy(e, "infinity", t.isInfinity, s), addToAssertionLazy(e, "nan", t.isNaN, s), 
  addToAssertionLazy(e, "zero", t.isZero, s), addToAssertionLazy(e, "positive", t.isPositive, s), 
  addToAssertionLazy(e, "negative", t.isNegative, s);
}

function addToAssertionLazy(e, t, s, i) {
  return addToAssertion(e, t, function() {
    let e = i.flag(this, "object");
    _assertType(this, t, s(e), e);
  });
}

function addToAssertion(e, t, s, i, n) {
  return e.Assertion.addChainableMethod(t, n || function(...e) {
    e.length && this.deep.equal(...e);
  }, s);
}

function _assertType(e, t, s, i) {
  return e.assert(s, `expected #{this} to be an ${t}`, `expected #{this} to not be an ${t}`, i);
}

function install(e) {
  return (e || require("chai")).use(ChaiPluginAssertType);
}

const n = {
  install
}, r = e;

exports.ChaiPlugin = n, exports.ChaiPluginAssertType = ChaiPluginAssertType, exports.EnumTypeDetect = i, 
exports._assertType = _assertType, exports.addToAssertion = addToAssertion, exports.addToAssertionLazy = addToAssertionLazy, 
exports.default = n, exports.install = install, exports.list = function list() {
  return s.array_unique_overwrite(Object.keys(i).concat([ "float", "integer", "nan", "zero", "positive", "negative" ])).sort();
}, exports.typeOf = r;
//# sourceMappingURL=index.cjs.production.min.cjs.map
