import { matcherErrorMessage as e, matcherHint as t, EXPECTED_COLOR as o, printWithType as i, printExpected as n, RECEIVED_COLOR as r, printReceived as s } from "jest-matcher-utils";

import { numberInDelta as m } from "num-in-delta";

import { printCloseTo as d } from "expect-print-close-to";

import { jestAutoInstallExpectExtend as l } from "jest-install-matcher-extends";

import { subAbs as a } from "num-in-delta/lib/util";

import { handleJestMatcherHintOptions as c } from "@lazy-assert/jest-util";

function toBeCloseWith(l, p, u, f = 4) {
  const v = "toBeCloseWith", h = this.isNot, b = c(this, {
    secondArgument: 3 === arguments.length ? "precision" : void 0
  });
  if ("number" != typeof p) throw new Error(e(t(v, void 0, void 0, b), `${o("expected")} value must be a number`, i("Expected", p, n)));
  if ("number" != typeof l) throw new Error(e(t(v, void 0, void 0, b), `${r("received")} value must be a number`, i("Received", l, s)));
  let x = !1, y = 0, B = 0;
  Infinity === l && Infinity === p || -Infinity === l && -Infinity === p ? x = !0 : (y = Math.pow(10, -f) / 2, 
  B = Number(a(l, p)), x = m(l, p, u));
  const C = x ? () => t(v, void 0, void 0, b) + "\n\n" + `Expected: not ${n(p)}\n` + (0 === B ? "" : `Received:     ${s(l)}\n\n` + d(B, y, f, h)) : () => t(v, void 0, void 0, b) + "\n\n" + `Expected: ${n(p)}\n` + `Received: ${s(l)}\n\n` + d(B, y, f, h);
  return {
    message: C,
    pass: x,
    actual: l,
    expected: p,
    name: v
  };
}

var p = {
  toBeCloseWith
};

l({
  toBeCloseWith
});

export { p as default, toBeCloseWith };
//# sourceMappingURL=index.esm.mjs.map
