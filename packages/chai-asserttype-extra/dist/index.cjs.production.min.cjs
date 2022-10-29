"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e, t = require("type-detect"), s = require("@lazy-assert/check-basic"), n = require("array-hyper-unique");

function ChaiPluginAssertType(e, t) {
  Object.entries(exports.EnumTypeDetect).forEach((function([t, s]) {
    addToAssertion(e, t, (function() {
      this.an(s);
    }));
  })), addToAssertionLazy(e, "integer", s.isInt, t), addToAssertionLazy(e, "float", s.isFloat, t), 
  addToAssertionLazy(e, "infinity", s.isInfinity, t), addToAssertionLazy(e, "nan", s.isNaN, t), 
  addToAssertionLazy(e, "zero", s.isZero, t), addToAssertionLazy(e, "positive", s.isPositive, t), 
  addToAssertionLazy(e, "negative", s.isNegative, t);
}

function addToAssertionLazy(e, t, s, n) {
  return addToAssertion(e, t, (function() {
    let e = n.flag(this, "object");
    _assertType(this, t, s(e), e);
  }));
}

function addToAssertion(e, t, s, n, i) {
  return e.Assertion.addChainableMethod(t, i || function(...e) {
    e.length && this.deep.equal(...e);
  }, s);
}

function _assertType(e, t, s, n) {
  return e.assert(s, `expected #{this} to be an ${t}`, `expected #{this} to not be an ${t}`, n);
}

function install(e) {
  return (e || require("chai")).use(ChaiPluginAssertType);
}

exports.EnumTypeDetect = void 0, (e = exports.EnumTypeDetect || (exports.EnumTypeDetect = {})).array = "Array", 
e.boolean = "boolean", e.date = "Date", e.function = "function", e.number = "number", 
e.object = "Object", e.regexp = "RegExp", e.string = "string";

const i = {
  install
}, r = t;

exports.ChaiPlugin = i, exports.ChaiPluginAssertType = ChaiPluginAssertType, exports._assertType = _assertType, 
exports.addToAssertion = addToAssertion, exports.addToAssertionLazy = addToAssertionLazy, 
exports.default = i, exports.install = install, exports.list = function list() {
  return n.array_unique_overwrite(Object.keys(exports.EnumTypeDetect).concat([ "float", "integer", "nan", "zero", "positive", "negative" ])).sort();
}, exports.typeOf = r;
//# sourceMappingURL=index.cjs.production.min.cjs.map
