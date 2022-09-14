import { diff as n } from "jest-matcher-utils";

import { crlf as r, chkcrlf as i } from "crlf-normalize";

var e;

function _stringDiffCore(e, t, f) {
  const o = [ "" ];
  return r(t) === r(e) ? (o.push("Contents have differences only in line separators"), 
  o.push(n(i(t), i(e)))) : o.push(n(t, e, f)), o;
}

function _stringDiff(n, r, i) {
  return _stringDiffCore(n, r, i).join("\n\n");
}

!function(n) {
  n.LINE_SEPARATORS = "Contents have differences only in line separators";
}(e || (e = {}));

export { e as EnumDiffMessage, _stringDiff, _stringDiffCore };
//# sourceMappingURL=index.esm.mjs.map
