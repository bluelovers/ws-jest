"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("jest-matcher-utils"), t = require("num-in-delta"), i = require("expect-print-close-to"), r = require("jest-install-matcher-extends"), n = require("num-in-delta/lib/util"), o = require("@lazy-assert/jest-util");

function toBeCloseWith(r, s, c, a = 4) {
  const d = "toBeCloseWith", p = this.isNot, l = o.handleJestMatcherHintOptions(this, {
    secondArgument: 3 === arguments.length ? "precision" : void 0
  });
  if ("number" != typeof s) throw new Error(e.matcherErrorMessage(e.matcherHint(d, void 0, void 0, l), `${e.EXPECTED_COLOR("expected")} value must be a number`, e.printWithType("Expected", s, e.printExpected)));
  if ("number" != typeof r) throw new Error(e.matcherErrorMessage(e.matcherHint(d, void 0, void 0, l), `${e.RECEIVED_COLOR("received")} value must be a number`, e.printWithType("Received", r, e.printReceived)));
  let u = !1, h = 0, m = 0;
  Infinity === r && Infinity === s || -Infinity === r && -Infinity === s ? u = !0 : (h = Math.pow(10, -a) / 2, 
  m = Number(n.subAbs(r, s)), u = t.numberInDelta(r, s, c));
  const v = u ? () => e.matcherHint(d, void 0, void 0, l) + "\n\n" + `Expected: not ${e.printExpected(s)}\n` + (0 === m ? "" : `Received:     ${e.printReceived(r)}\n\n` + i.printCloseTo(m, h, a, p)) : () => e.matcherHint(d, void 0, void 0, l) + "\n\n" + `Expected: ${e.printExpected(s)}\n` + `Received: ${e.printReceived(r)}\n\n` + i.printCloseTo(m, h, a, p);
  return {
    message: v,
    pass: u,
    actual: r,
    expected: s,
    name: d
  };
}

var s = {
  toBeCloseWith
};

r.jestAutoInstallExpectExtend({
  toBeCloseWith
}), exports.default = s, exports.toBeCloseWith = toBeCloseWith;
//# sourceMappingURL=index.cjs.production.min.cjs.map
