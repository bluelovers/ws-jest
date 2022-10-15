"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("jest-matcher-utils"), r = require("crlf-normalize");

function _stringDiffCore(s, f, i) {
  const n = [ "" ];
  return r.crlf(f) === r.crlf(s) ? (n.push("Contents have differences only in line separators"), 
  n.push(e.diff(r.chkcrlf(f), r.chkcrlf(s)))) : n.push(e.diff(f, s, i)), n;
}

exports.EnumDiffMessage = void 0, (exports.EnumDiffMessage || (exports.EnumDiffMessage = {})).LINE_SEPARATORS = "Contents have differences only in line separators", 
exports._stringDiff = function _stringDiff(e, r, s) {
  return _stringDiffCore(e, r, s).join("\n\n");
}, exports._stringDiffCore = _stringDiffCore;
//# sourceMappingURL=index.cjs.production.min.cjs.map
