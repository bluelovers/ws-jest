"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("jest-matcher-utils"), r = require("crlf-normalize");

let i = /*#__PURE__*/ function(e) {
  return e.LINE_SEPARATORS = "Contents have differences only in line separators", 
  e;
}({});

function _stringDiffCore(n, f, t) {
  const s = [ "" ];
  return r.crlf(f) === r.crlf(n) ? (s.push(i.LINE_SEPARATORS), s.push(e.diff(r.chkcrlf(f), r.chkcrlf(n)))) : s.push(e.diff(f, n, t)), 
  s;
}

exports.EnumDiffMessage = i, exports._stringDiff = function _stringDiff(e, i, n) {
  return _stringDiffCore(e, i, n).join(r.EnumLineBreak.LF + r.EnumLineBreak.LF);
}, exports._stringDiffCore = _stringDiffCore;
//# sourceMappingURL=index.cjs.production.min.cjs.map
