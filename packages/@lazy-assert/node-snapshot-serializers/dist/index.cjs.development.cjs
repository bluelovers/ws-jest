'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _nodeInspectResultNoOuterRef(inspectResult) {
  return inspectResult.replace(/^\<ref \*\d\> (?=\{)/, '');
}
function _nodeSnapshotInspectFnWrapper(fn, inspectOptions) {
  inspectOptions = _nodeInspectOptions(inspectOptions);
  return value => {
    return _nodeInspectResultNoOuterRef(fn(value, inspectOptions));
  };
}
function _nodeInspectOptions(inspectOptions) {
  return {
    depth: Infinity,
    compact: false,
    sorted: true,
    colors: false,
    ...inspectOptions
  };
}
function _isObjectNotNull(value) {
  return typeof value === 'object' && value !== null;
}
function _handleCircularReferences(value, runtime) {
  const {
    seenCtx
  } = runtime;
  if (_isObjectNotNull(value)) {
    if (seenCtx.seenCache.has(value)) {
      return runtime.fnLabel(seenCtx.seenCache.get(value));
    }
    seenCtx.seenCache.set(value, ++seenCtx.seenIndex);
    seenCtx.seenCount++;
  }
  return value;
}
function _circularLabelWithIndex(seenIndex) {
  return `[Circular *${seenIndex}]`;
}
function _circularLabel(_seenIndex) {
  return `[Circular]`;
}
function _handleOptions(options) {
  var _options$fnLabel;
  options !== null && options !== void 0 ? options : options = {};
  const fnLabel = (_options$fnLabel = options.fnLabel) !== null && _options$fnLabel !== void 0 ? _options$fnLabel : options.circularReferenceWithIndex ? _circularLabelWithIndex : _circularLabel;
  return {
    ...options,
    fnLabel
  };
}
function _createSerializer(options) {
  const seenCache = new WeakMap();
  const seenCtx = {
    seenCache,
    seenIndex: 0,
    seenCount: 0
  };
  const opts = _handleOptions(options);
  const fnLabel = opts.fnLabel;
  return {
    seenCache,
    seenIndex() {
      return seenCtx.seenIndex;
    },
    seenCount() {
      return seenCtx.seenCount;
    },
    test: value => _isObjectNotNull(value),
    serialize: (_key, value) => {
      return _handleCircularReferences(value, {
        fnLabel: fnLabel,
        seenCtx
      });
    }
  };
}
function createSnapshotStringify(options) {
  var _options$serializers;
  const _stringify = obj => {
    const serializer = _createSerializer(options);
    const result = JSON.stringify(obj, serializer.serialize, 2);
    return result;
  };
  return {
    serializers: [...((_options$serializers = options === null || options === void 0 ? void 0 : options.serializers) !== null && _options$serializers !== void 0 ? _options$serializers : []), _stringify],
    _stringify
  };
}

exports._circularLabel = _circularLabel;
exports._circularLabelWithIndex = _circularLabelWithIndex;
exports._createSerializer = _createSerializer;
exports._handleCircularReferences = _handleCircularReferences;
exports._handleOptions = _handleOptions;
exports._isObjectNotNull = _isObjectNotNull;
exports._nodeInspectOptions = _nodeInspectOptions;
exports._nodeInspectResultNoOuterRef = _nodeInspectResultNoOuterRef;
exports._nodeSnapshotInspectFnWrapper = _nodeSnapshotInspectFnWrapper;
exports.createSnapshotStringify = createSnapshotStringify;
exports.default = createSnapshotStringify;
//# sourceMappingURL=index.cjs.development.cjs.map
