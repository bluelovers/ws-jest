import { matcherErrorMessage as e, matcherHint as t, EXPECTED_COLOR as o, printWithType as i, printExpected as n, RECEIVED_COLOR as r, printReceived as s } from "jest-matcher-utils";

import { numberInDelta as m } from "num-in-delta";

import { printCloseTo as d } from "expect/build/print";

import { jestAutoInstallExpectExtend as l } from "jest-install-matcher-extends";

import { subAbs as p } from "num-in-delta/lib/util";

function toBeCloseWith(l, u, c, v = 4) {
  const a = "toBeCloseWith", f = 3 === arguments.length ? "precision" : void 0, h = this.isNot, b = {
    isNot: h,
    promise: this.promise,
    secondArgument: f,
    secondArgumentColor: e => e
  };
  if ("number" != typeof u) throw new Error(e(t(a, void 0, void 0, b), `${o("expected")} value must be a number`, i("Expected", u, n)));
  if ("number" != typeof l) throw new Error(e(t(a, void 0, void 0, b), `${r("received")} value must be a number`, i("Received", l, s)));
  let C = !1, x = 0, B = 0;
  Infinity === l && Infinity === u || -Infinity === l && -Infinity === u ? C = !0 : (x = Math.pow(10, -v) / 2, 
  B = Number(p(l, u)), C = m(l, u, c));
  const W = C ? () => t(a, void 0, void 0, b) + "\n\n" + `Expected: not ${n(u)}\n` + (0 === B ? "" : `Received:     ${s(l)}\n\n` + d(B, x, v, h)) : () => t(a, void 0, void 0, b) + "\n\n" + `Expected: ${n(u)}\n` + `Received: ${s(l)}\n\n` + d(B, x, v, h);
  return {
    message: W,
    pass: C
  };
}

var u = {
  toBeCloseWith
};

l({
  toBeCloseWith
});

export { u as default, toBeCloseWith };
//# sourceMappingURL=index.esm.mjs.map
