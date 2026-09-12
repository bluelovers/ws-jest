"use strict";

function _isAsymmetricMatcher(t) {
  return "function" == typeof (null == t ? void 0 : t.asymmetricMatch);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SymbolTypeofAsymmetricMatcher = /*#__PURE__*/ Symbol.for("jest.asymmetricMatcher"), 
exports._isAsymmetricMatcher = _isAsymmetricMatcher, exports.allOf = t => ({
  asymmetricMatch: e => t.every(t => _isAsymmetricMatcher(t) ? t.asymmetricMatch(e) : e === t),
  toString: () => `AllOf(${t.map(t => {
    var e;
    return (null === (e = t.toString) || void 0 === e ? void 0 : e.call(t)) || t;
  }).join(", ")})`
}), exports.anyOf = t => ({
  asymmetricMatch: e => t.some(t => _isAsymmetricMatcher(t) ? t.asymmetricMatch(e) : e === t),
  toString: () => `AnyOf(${t.map(t => {
    var e;
    return (null === (e = t.toString) || void 0 === e ? void 0 : e.call(t)) || t;
  }).join(", ")})`
});
//# sourceMappingURL=index.cjs.production.min.cjs.map
