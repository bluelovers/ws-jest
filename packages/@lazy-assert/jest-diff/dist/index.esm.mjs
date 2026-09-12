import { diff as r } from "jest-matcher-utils";

import { crlf as n, chkcrlf as t, EnumLineBreak as i } from "crlf-normalize";

let e = /*#__PURE__*/ function(r) {
  return r.LINE_SEPARATORS = "Contents have differences only in line separators", 
  r;
}({});

function _stringDiffCore(i, f, o) {
  const s = [ "" ];
  return n(f) === n(i) ? (s.push(e.LINE_SEPARATORS), s.push(r(t(f), t(i)))) : s.push(r(f, i, o)), 
  s;
}

function _stringDiff(r, n, t) {
  return _stringDiffCore(r, n, t).join(i.LF + i.LF);
}

export { e as EnumDiffMessage, _stringDiff, _stringDiffCore };
//# sourceMappingURL=index.esm.mjs.map
