const t = /*#__PURE__*/ Symbol.for("jest.asymmetricMatcher");

function _isAsymmetricMatcher(t) {
  return "function" == typeof (null == t ? void 0 : t.asymmetricMatch);
}

const anyOf = t => ({
  asymmetricMatch: r => t.some(t => _isAsymmetricMatcher(t) ? t.asymmetricMatch(r) : r === t),
  toString: () => `AnyOf(${t.map(t => {
    var r;
    return (null === (r = t.toString) || void 0 === r ? void 0 : r.call(t)) || t;
  }).join(", ")})`
}), allOf = t => ({
  asymmetricMatch: r => t.every(t => _isAsymmetricMatcher(t) ? t.asymmetricMatch(r) : r === t),
  toString: () => `AllOf(${t.map(t => {
    var r;
    return (null === (r = t.toString) || void 0 === r ? void 0 : r.call(t)) || t;
  }).join(", ")})`
});

export { t as SymbolTypeofAsymmetricMatcher, _isAsymmetricMatcher, allOf, anyOf };
//# sourceMappingURL=index.esm.mjs.map
