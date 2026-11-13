function _nodeInspectResultNoOuterRef(e) {
  return e.replace(/^\<ref \*\d\> (?=\{)/, "");
}

function _nodeSnapshotInspectFnWrapper(e, n) {
  return n = _nodeInspectOptions(n), t => _nodeInspectResultNoOuterRef(e(t, n));
}

function _nodeInspectOptions(e) {
  return {
    depth: Infinity,
    compact: !1,
    sorted: !0,
    colors: !1,
    ...e
  };
}

function _isObjectNotNull(e) {
  return "object" == typeof e && null !== e;
}

function _handleCircularReferences(e, n) {
  const {seenCtx: t} = n;
  if (_isObjectNotNull(e)) {
    if (t.seenCache.has(e)) return n.fnLabel(t.seenCache.get(e));
    t.seenCache.set(e, ++t.seenIndex), t.seenCount++;
  }
  return e;
}

function _circularLabelWithIndex(e) {
  return `[Circular *${e}]`;
}

function _circularLabel(e) {
  return "[Circular]";
}

function _handleOptions(e) {
  var n;
  null != e || (e = {});
  const t = null !== (n = e.fnLabel) && void 0 !== n ? n : e.circularReferenceWithIndex ? _circularLabelWithIndex : _circularLabel;
  return {
    ...e,
    fnLabel: t
  };
}

function _createSerializer(e) {
  const n = new WeakMap, t = {
    seenCache: n,
    seenIndex: 0,
    seenCount: 0
  }, r = _handleOptions(e).fnLabel;
  return {
    seenCache: n,
    seenIndex: () => t.seenIndex,
    seenCount: () => t.seenCount,
    test: e => _isObjectNotNull(e),
    serialize: (e, n) => _handleCircularReferences(n, {
      fnLabel: r,
      seenCtx: t
    })
  };
}

function createSnapshotStringify(e) {
  var n;
  const _stringify = n => {
    const t = _createSerializer(e);
    return JSON.stringify(n, t.serialize, 2);
  };
  return {
    serializers: [ ...null !== (n = null == e ? void 0 : e.serializers) && void 0 !== n ? n : [], _stringify ],
    _stringify
  };
}

export { _circularLabel, _circularLabelWithIndex, _createSerializer, _handleCircularReferences, _handleOptions, _isObjectNotNull, _nodeInspectOptions, _nodeInspectResultNoOuterRef, _nodeSnapshotInspectFnWrapper, createSnapshotStringify, createSnapshotStringify as default };
//# sourceMappingURL=index.esm.mjs.map
