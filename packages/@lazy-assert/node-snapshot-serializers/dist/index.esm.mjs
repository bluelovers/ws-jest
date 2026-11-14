function _handleHookNewValue(e, n) {
  return n && (n.skip || (e = n.newValue)), e;
}

function _handleHookFn(e) {
  return Array.isArray(e) ? (n, t) => {
    let r;
    for (const s of e) {
      const e = s(n, t);
      if (e && (r = e, n = _handleHookNewValue(n, e), e.stop)) break;
    }
    return {
      ...r,
      value: n
    };
  } : (n, t) => {
    const r = e(n, t);
    return {
      ...r,
      value: _handleHookNewValue(n, r)
    };
  };
}

function _regexpStringify(e) {
  return `/${e.source}/${e.flags}`;
}

function _regexpSerializer(e) {
  return e instanceof RegExp ? _regexpStringify(e) : e;
}

const _regexpSerializeHook = e => {
  if (e instanceof RegExp) return {
    newValue: _regexpStringify(e),
    stop: !0
  };
};

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
  }, r = _handleOptions(e), s = r.fnLabel, i = r.hooks ? _handleHookFn(r.hooks) : void 0;
  return {
    seenCache: n,
    seenIndex: () => t.seenIndex,
    seenCount: () => t.seenCount,
    test: e => _isObjectNotNull(e),
    serialize: (e, n) => {
      if (i) {
        const t = i(n, e);
        t && (n = t.value);
      }
      return _handleCircularReferences(n, {
        fnLabel: s,
        seenCtx: t
      });
    }
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

function assertSnapshot(e, n) {
  const t = createSnapshotStringify(n);
  return (n, r) => e.assert.snapshot(n, r ? createSnapshotStringify(r) : t);
}

function setGlobalSnapshotSerializers(e) {
  const n = createSnapshotStringify(e.snapshotOptions);
  return e.snapshot.setDefaultSnapshotSerializers(n.serializers), n;
}

function setGlobalSnapshotSerializersWithInspect(e) {
  var n, t;
  const r = _nodeSnapshotInspectFnWrapper(e.inspect, null == e ? void 0 : e.inspectOptions), s = [ ...null !== (n = null === (t = e.snapshotOptions) || void 0 === t ? void 0 : t.serializers) && void 0 !== n ? n : [], r ];
  return e.snapshot.setDefaultSnapshotSerializers(s), {
    serializers: s,
    inspectFn: r
  };
}

export { _circularLabel, _circularLabelWithIndex, _createSerializer, _handleCircularReferences, _handleHookFn, _handleHookNewValue, _handleOptions, _isObjectNotNull, _nodeInspectOptions, _nodeInspectResultNoOuterRef, _nodeSnapshotInspectFnWrapper, _regexpSerializeHook, _regexpSerializer, _regexpStringify, assertSnapshot, createSnapshotStringify, createSnapshotStringify as default, setGlobalSnapshotSerializers, setGlobalSnapshotSerializersWithInspect };
//# sourceMappingURL=index.esm.mjs.map
