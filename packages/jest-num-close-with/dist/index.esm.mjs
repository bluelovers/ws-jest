import { matcherErrorMessage as e, matcherHint as t, EXPECTED_COLOR as o, printWithType as i, printExpected as n, RECEIVED_COLOR as r, printReceived as s } from "jest-matcher-utils";

import { numberInDelta as m } from "num-in-delta";

import { printCloseTo as d } from "expect-print-close-to";

import { jestAutoInstallExpectExtend as l } from "jest-install-matcher-extends";

import { subAbs as p } from "num-in-delta/lib/util";

function toBeCloseWith(l, c, u, v = 4) {
  const a = "toBeCloseWith", f = 3 === arguments.length ? "precision" : void 0, h = this.isNot, b = {
    isNot: h,
    promise: this.promise,
    secondArgument: f,
    secondArgumentColor: e => e
  };
  if ("number" != typeof c) throw new Error(e(t(a, void 0, void 0, b), `${o("expected")} value must be a number`, i("Expected", c, n)));
  if ("number" != typeof l) throw new Error(e(t(a, void 0, void 0, b), `${r("received")} value must be a number`, i("Received", l, s)));
  let C = !1, x = 0, B = 0;
  Infinity === l && Infinity === c || -Infinity === l && -Infinity === c ? C = !0 : (x = Math.pow(10, -v) / 2, 
  B = Number(p(l, c)), C = m(l, c, u));
  const W = C ? () => t(a, void 0, void 0, b) + "\n\n" + `Expected: not ${n(c)}\n` + (0 === B ? "" : `Received:     ${s(l)}\n\n` + d(B, x, v, h)) : () => t(a, void 0, void 0, b) + "\n\n" + `Expected: ${n(c)}\n` + `Received: ${s(l)}\n\n` + d(B, x, v, h);
  return {
    message: W,
    pass: C
  };
}

var c = {
  toBeCloseWith
};

l({
  toBeCloseWith
});

export { c as default, toBeCloseWith };
//# sourceMappingURL=index.esm.mjs.map
