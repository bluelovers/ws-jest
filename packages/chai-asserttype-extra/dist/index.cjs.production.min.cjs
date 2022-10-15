"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("type-detect"), t = require("@lazy-assert/check-basic"), s = require("array-hyper-unique");

function _interopDefaultLegacy(e) {
  return e && "object" == typeof e && "default" in e ? e : {
    default: e
  };
}

var n, i = _interopDefaultLegacy(e);

function ChaiPluginAssertType(e, s) {
  Object.entries(exports.EnumTypeDetect).forEach((function([t, s]) {
    addToAssertion(e, t, (function() {
      this.an(s);
    }));
  })), addToAssertionLazy(e, "integer", t.isInt, s), addToAssertionLazy(e, "float", t.isFloat, s), 
  addToAssertionLazy(e, "infinity", t.isInfinity, s), addToAssertionLazy(e, "nan", t.isNaN, s), 
  addToAssertionLazy(e, "zero", t.isZero, s), addToAssertionLazy(e, "positive", t.isPositive, s), 
  addToAssertionLazy(e, "negative", t.isNegative, s);
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

exports.EnumTypeDetect = void 0, (n = exports.EnumTypeDetect || (exports.EnumTypeDetect = {})).array = "Array", 
n.boolean = "boolean", n.date = "Date", n.function = "function", n.number = "number", 
n.object = "Object", n.regexp = "RegExp", n.string = "string";

const r = {
  install
}, o = i.default;

exports.ChaiPlugin = r, exports.ChaiPluginAssertType = ChaiPluginAssertType, exports._assertType = _assertType, 
exports.addToAssertion = addToAssertion, exports.addToAssertionLazy = addToAssertionLazy, 
exports.default = r, exports.install = install, exports.list = function list() {
  return s.array_unique_overwrite(Object.keys(exports.EnumTypeDetect).concat([ "float", "integer", "nan", "zero", "positive", "negative" ])).sort();
}, exports.typeOf = o;
//# sourceMappingURL=index.cjs.production.min.cjs.map
