import { stringify as e, EXPECTED_COLOR as t, RECEIVED_COLOR as n } from "jest-matcher-utils";

function printCloseTo(o, i, r, c) {
  const p = e(o), s = p.includes("e") ? i.toExponential(0) : 0 <= r && r < 20 ? i.toFixed(r + 1) : e(i);
  return `Expected precision:  ${c ? "    " : ""}  ${e(r)}\nExpected difference: ${c ? "not " : ""}< ${t(s)}\nReceived difference: ${c ? "    " : ""}  ${n(p)}`;
}

export { printCloseTo as default, printCloseTo };
//# sourceMappingURL=index.esm.mjs.map
