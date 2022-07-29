import t from "type-detect";

import { isInt as e, isFloat as n, isInfinity as i, isNaN as o, isZero as s, isPositive as a, isNegative as r } from "@lazy-assert/check-basic";

import { array_unique_overwrite as d } from "array-hyper-unique";

var c;

function ChaiPluginAssertType(t, d) {
  Object.entries(c).forEach((function([e, n]) {
    addToAssertion(t, e, (function() {
      this.an(n);
    }));
  })), addToAssertionLazy(t, "integer", e, d), addToAssertionLazy(t, "float", n, d), 
  addToAssertionLazy(t, "infinity", i, d), addToAssertionLazy(t, "nan", o, d), addToAssertionLazy(t, "zero", s, d), 
  addToAssertionLazy(t, "positive", a, d), addToAssertionLazy(t, "negative", r, d);
}

function addToAssertionLazy(t, e, n, i) {
  return addToAssertion(t, e, (function() {
    let t = i.flag(this, "object");
    _assertType(this, e, n(t), t);
  }));
}

function addToAssertion(t, e, n, i, o) {
  return t.Assertion.addChainableMethod(e, o || function(...t) {
    t.length && this.deep.equal(...t);
  }, n);
}

function _assertType(t, e, n, i) {
  return t.assert(n, `expected #{this} to be an ${e}`, `expected #{this} to not be an ${e}`, i);
}

function install(t) {
  return (t || require("chai")).use(ChaiPluginAssertType);
}

function list() {
  return d(Object.keys(c).concat([ "float", "integer", "nan", "zero", "positive", "negative" ])).sort();
}

!function(t) {
  t.array = "Array", t.boolean = "boolean", t.date = "Date", t.function = "function", 
  t.number = "number", t.object = "Object", t.regexp = "RegExp", t.string = "string";
}(c || (c = {}));

const u = {
  install
}, l = t;

export { u as ChaiPlugin, ChaiPluginAssertType, c as EnumTypeDetect, _assertType, addToAssertion, addToAssertionLazy, u as default, install, list, l as typeOf };
//# sourceMappingURL=index.esm.mjs.map
