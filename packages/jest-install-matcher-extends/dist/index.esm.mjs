function getGlobalExpect() {
  return "undefined" != typeof global && global.expect ? global.expect : "undefined" != typeof globalThis && globalThis.expect ? globalThis.expect : "undefined" != typeof window && window.expect ? window.expect : void 0;
}

function jestInstallExpectExtend(e, t) {
  return (null != t ? t : getGlobalExpect()).extend(e);
}

function jestAutoInstallExpectExtend(e, t) {
  var l;
  const n = null !== (l = null == t ? void 0 : t.expect) && void 0 !== l ? l : getGlobalExpect();
  var o, x;
  void 0 !== n ? (n.extend(e), null == t || null === (o = t.cbExists) || void 0 === o || o.call(t, e, t)) : null == t || null === (x = t.cbNotExists) || void 0 === x || x.call(t, e, t);
}

export { jestAutoInstallExpectExtend as default, getGlobalExpect, jestAutoInstallExpectExtend, jestInstallExpectExtend };
//# sourceMappingURL=index.esm.mjs.map
