import { matcherErrorMessage as e, matcherHint as t, EXPECTED_COLOR as o, printWithType as i, printExpected as n, RECEIVED_COLOR as r, printReceived as s } from "jest-matcher-utils";

import { numberInDelta as m } from "num-in-delta";

import { printCloseTo as d } from "expect-print-close-to";

import { jestAutoInstallExpectExtend as l } from "jest-install-matcher-extends";

import { subAbs as a } from "num-in-delta/lib/util";

import { handleJestMatcherHintOptions as p } from "@lazy-assert/jest-util";

function toBeCloseWith(l, u, c, f = 4) {
  const v = "toBeCloseWith", h = this.isNot, b = p(this, {
    secondArgument: 3 === arguments.length ? "precision" : void 0
  });
  if ("number" != typeof u) throw new Error(e(t(v, void 0, void 0, b), `${o("expected")} value must be a number`, i("Expected", u, n)));
  if ("number" != typeof l) throw new Error(e(t(v, void 0, void 0, b), `${r("received")} value must be a number`, i("Received", l, s)));
  let x = !1, y = 0, B = 0;
  return Infinity === l && Infinity === u || -Infinity === l && -Infinity === u ? x = !0 : (y = Math.pow(10, -f) / 2, 
  B = Number(a(l, u)), x = m(l, u, c)), {
    message: x ? () => t(v, void 0, void 0, b) + "\n\n" + `Expected: not ${n(u)}\n` + (0 === B ? "" : `Received:     ${s(l)}\n\n` + d(B, y, f, h)) : () => t(v, void 0, void 0, b) + "\n\n" + `Expected: ${n(u)}\n` + `Received: ${s(l)}\n\n` + d(B, y, f, h),
    pass: x,
    actual: l,
    expected: u,
    name: v
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
