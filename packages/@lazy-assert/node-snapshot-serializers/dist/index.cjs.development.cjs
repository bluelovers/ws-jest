'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * serialize hook：由 `_createSerializer()` 注入 `serialize`，
 * 在每個節點進入循環引用處理之前攔截
 *
 * 回傳 `undefined` 表示不介入，該節點維持一般流程
 *
 * @param value - 目前節點的值
 * @param key - 該節點的鍵名，根節點為空字串
 */

/**
 * 將 hook 回傳的 `newValue` 套用到目前值
 *
 * @param value - 目前節點的值
 * @param hooked - hook 回傳的結果
 * @returns 套用 `newValue` 後的值；未回傳結果或設定 `skip` 時維持原值
 */
function _handleHookNewValue(value, hooked) {
  if (hooked) {
    const newValue = hooked.newValue;
    if (!hooked.skip) {
      value = newValue;
    }
  }
  return value;
}
/**
 * 將 `hooks` 選項標準化 (Normalize) 為單一 hook 函式
 *
 * 單一函式直接執行；陣列則依序執行，各 hook 的 `newValue` 依序疊加為目前值，
 * 命中 `stop` 即停止其餘 hook
 *
 * @param hooks - 單一 hook、陣列或 readonly 陣列
 * @returns 回傳統一形狀的 hook，`value` 必為整條鏈處理完成的節點值，
 * 供 `_createSerializer.serialize` 直接取用
 */
function _handleHookFn(hooks) {
  if (!Array.isArray(hooks)) {
    return (value, key) => {
      const hooked = hooks(value, key);
      return {
        ...hooked,
        value: _handleHookNewValue(value, hooked)
      };
    };
  }
  return (value, key) => {
    let hooked;
    for (const hook of hooks) {
      const curHooked = hook(value, key);
      if (curHooked) {
        hooked = curHooked;
        value = _handleHookNewValue(value, curHooked);
        if (curHooked.stop) {
          break;
        }
      }
    }
    return {
      ...hooked,
      value
    };
  };
}

/**
 * 將 RegExp 轉為字面表示 (Literal Notation)，例如 `/node:test/gi`
 *
 * @param value - 目標正則表達式 (Regular Expression)
 * @returns 含 source 與 flags 的完整字面字串
 */
function _regexpStringify(value) {
  return `/${value.source}/${value.flags}`;
}
/**
 * serializers 形式的 RegExp 支援
 *
 * 依 `node:test` 的 serializer pipeline 契約，serializer 只會收到最外層的值、
 * 並依序把回傳值交給下一個 serializer；因此本函式在收到 RegExp 時轉為字面字串，
 * 其餘值原樣放行給下一個 serializer
 *
 * @param value - pipeline 目前的值
 * @returns RegExp 的字面字串，其餘值原樣回傳
 *
 * @example 直接作為 node:test 的 serializers
 * t.assert.snapshot(/node:test/gi, {
 * 	serializers: [_regexpSerializer],
 * });
 * // snapshot: /node:test/gi
 *
 * @example 串接 createSnapshotStringify，由 `_stringify` 收尾輸出 JSON 格式
 * t.assert.snapshot(/node:test/gi, createSnapshotStringify({
 * 	serializers: [_regexpSerializer],
 * }));
 * // "/node:test/gi"
 *
 * @note 巢狀的 RegExp 不會經過 pipeline，需改用 hook 形式的 `_regexpSerializeHook`
 */
function _regexpSerializer(value) {
  return value instanceof RegExp ? _regexpStringify(value) : value;
}
/**
 * hook 形式的 RegExp 支援：由 `_stringify` 的 replacer 逐節點 (Per-node) 攔截，
 * 巢狀結構中的 RegExp 同樣會被轉成字面字串
 *
 * RegExp 命中時以 `{ newValue: 字面字串, stop: true }` 回傳：
 * RegExp 是葉節點，轉成字串後即由 `JSON.stringify` 直接輸出，不再往下走訪
 *
 * @example
 * t.assert.snapshot(obj, createSnapshotStringify({
 * 	hooks: _regexpSerializeHook,
 * }));
 * // "pattern": "/node:test/gi"
 */
const _regexpSerializeHook = value => {
  if (value instanceof RegExp) {
    return {
      newValue: _regexpStringify(value),
      stop: true
    };
  }
};

/**
 * 移除 `util.inspect` 輸出開頭的 `<ref *n>` 外部參照 (Outer Reference) 標記
 *
 * 該標記只會出現在循環結構的根物件，移除後可讓同一組結構的快照
 * 不因是否有此標記而產生差異
 *
 * @param inspectResult - `util.inspect` 產生的字串
 * @returns 移除標記後的字串
 *
 * @example
 * _nodeInspectResultNoOuterRef('<ref *1> { a: 1 }') // '{ a: 1 }'
 */
function _nodeInspectResultNoOuterRef(inspectResult) {
  return inspectResult.replace(/^\<ref \*\d\> (?=\{)/, '');
}
/**
 * 將任意 inspect 風格函式 (Inspect Function) 包裝成快照 serializer 可用的格式
 *
 * 套用 `_nodeInspectOptions()` 的預設值並移除 `<ref *n>` 標記，
 * 使輸出不帶顏色且深度不受限，快照結果保持穩定
 *
 * @param fn - inspect 風格函式，例如 `util.inspect`
 * @param inspectOptions - 覆寫預設的 inspect 選項
 * @returns `(value) => string` 形式的 serializer，可放入 `serializers` 陣列
 *
 * @example
 * import { inspect } from 'util';
 *
 * t.assert.snapshot(obj, {
 * 	serializers: [
 * 		_nodeSnapshotInspectFnWrapper(inspect),
 * 	],
 * });
 */
function _nodeSnapshotInspectFnWrapper(fn, inspectOptions) {
  inspectOptions = _nodeInspectOptions(inspectOptions);
  return value => {
    return _nodeInspectResultNoOuterRef(fn(value, inspectOptions));
  };
}
/**
 * 合併快照用途的 `InspectOptions` 預設值
 *
 * 預設展開全部深度、非緊湊 (Compact)、依鍵名排序且不輸出顏色，
 * 讓快照輸出不受終端機寬度與屬性走訪順序影響
 *
 * @param inspectOptions - 使用者提供的覆寫值
 * @returns 合併後的選項
 */
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

/**
 * 循環引用標籤的產生函式
 *
 * @param value - 物件首次出現時登記的編號
 * @returns 標籤字串；回傳 `undefined` 時該節點會被略過
 */

/**
 * 依走訪順序處理循環引用 (Circular Reference)
 *
 * 首次見到的物件登記編號後原樣保留給 `JSON.stringify` 往下走訪；
 * 已登記的物件再次出現即交由 `fnLabel` 產生替代標籤
 *
 * @param value - 目前待序列化的值
 * @param runtime - 標籤函式與本輪追蹤狀態
 * @returns 未見過的值原樣回傳，重複出現的值改為標籤字串
 */
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
/**
 * 產生帶編號的循環引用標籤，例如 `[Circular *1]`
 *
 * @param seenIndex - 物件首次出現時登記的編號
 */
function _circularLabelWithIndex(seenIndex) {
  return `[Circular *${seenIndex}]`;
}
/**
 * 產生固定的循環引用標籤 `[Circular]`，不區分編號
 *
 * @param _seenIndex - 相容 `ICircularReferencesLabelFn` 簽名而保留，未使用
 */
function _circularLabel(_seenIndex) {
  return `[Circular]`;
}
/**
 * 補上預設的循環引用標籤策略 (Label Strategy)
 *
 * `fnLabel` 有明確指定時優先採用；
 * 否則依 `circularReferenceWithIndex` 決定標籤是否帶編號
 *
 * @param options - 使用者選項，可為空
 * @returns 保證 `fnLabel` 已存在的選項
 */
function _handleOptions(options) {
  var _options$fnLabel;
  options !== null && options !== void 0 ? options : options = {};
  const fnLabel = (_options$fnLabel = options.fnLabel) !== null && _options$fnLabel !== void 0 ? _options$fnLabel : options.circularReferenceWithIndex ? _circularLabelWithIndex : _circularLabel;
  return {
    ...options,
    fnLabel
  };
}
/**
 * 建立單一快照序列化週期專用的 serializer 狀態
 *
 * 回傳值同時提供 `JSON.stringify` replacer 形式的 `serialize`
 * 與 `seenIndex` / `seenCount` 觀察點
 *
 * @param options - 快照選項，可省略
 */
function _createSerializer(options) {
  const seenCache = new WeakMap();
  const seenCtx = {
    seenCache,
    seenIndex: 0,
    seenCount: 0
  };
  const opts = _handleOptions(options);
  const fnLabel = opts.fnLabel;
  const hook = opts.hooks ? _handleHookFn(opts.hooks) : undefined;
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
      if (hook) {
        const hooked = hook(value, _key);
        if (hooked) {
          value = hooked.value;
        }
      }
      return _handleCircularReferences(value, {
        fnLabel: fnLabel,
        seenCtx
      });
    }
  };
}
/**
 * 建立可直接作為 `t.assert.snapshot(value, options)` 第二參數的
 * 快照序列化選項 (Snapshot Serializer Options)
 *
 * 內部以 `JSON.stringify` 的 replacer 追蹤已走訪的物件：
 * 首次出現者登記編號，再次出現即以 `[Circular]`（或帶編號標籤）字串取代，
 * 使 `node:test` 的快照能涵蓋循環引用 (Circular Reference) 結構。
 * `serializers` 依 pipeline 執行：使用者的 serializer 先跑，
 * 其回傳值再交給內建的 `_stringify` 收尾輸出
 *
 * @param options - 快照選項，可指定標籤策略、注入 `hooks` 或附加其他 serializer
 * @returns 含 `serializers` 的 `AssertSnapshotOptions`，並保留 `_stringify` 供單獨呼叫
 *
 * @example 基本用法
 * import { createSnapshotStringify } from '@lazy-assert/node-snapshot-serializers';
 *
 * const options = createSnapshotStringify();
 * const obj: any = { a: 1 };
 * obj.c = obj;
 *
 * t.assert.snapshot(obj, options);
 * // snapshot:
 * // {
 * //   "a": 1,
 * //   "c": "[Circular]"
 * // }
 *
 * @example 串接自訂 serializers
 * t.assert.snapshot(/node:test/gi, createSnapshotStringify({
 * 	serializers: [_regexpSerializer],
 * }));
 * // 使用者的 serializer 先轉為字面字串，再由 `_stringify` 輸出 JSON 格式
 * // "/node:test/gi"
 *
 * @example 以編號區分不同的循環引用
 * t.assert.snapshot(obj, createSnapshotStringify({
 * 	circularReferenceWithIndex: true,
 * }));
 * // "c": "[Circular *1]"
 */
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
/**
 * 以 `TestContext` 建立綁定共用選項的快照斷言函式 (Bound Snapshot Assertion)
 *
 * 外層 `options` 只在建立時轉換一次、由回傳的函式共用；
 * 單次呼叫若再傳入 `options`，則以該次傳入的選項為準，不影響共用的預設值
 *
 * @param t - 測試上下文 (TestContext)
 * @param options - 共用的快照選項，可省略
 * @returns `(value, options?)` 形式的斷言函式，呼叫時以 value 對快照
 *
 * @example
 * const snapshot = assertSnapshot(t);
 *
 * snapshot(obj); // 共用建立時的預設選項
 * snapshot(obj, { circularReferenceWithIndex: true }); // 該次改用專屬選項
 */
function assertSnapshot(t, options) {
  const snapshotOptions = createSnapshotStringify(options);
  return (value, options) => {
    return t.assert.snapshot(value, options ? createSnapshotStringify(options) : snapshotOptions);
  };
}
/**
 * 將本套件的 serializers 註冊 (Register) 為 `node:test` 測試執行器的全域預設快照 serializers
 *
 * 經 `snapshot.setDefaultSnapshotSerializers()` 註冊後，
 * 不帶 `serializers` 的 `t.assert.snapshot(value)` 也會走本套件的序列化，
 * 循環引用 (Circular Reference) 結構無需逐次傳選項
 *
 * @param options - `snapshot` 模組與註冊用的快照選項
 * @returns 已註冊的選項，保留 `_stringify` 供單獨呼叫
 *
 * @example
 * import { snapshot } from 'node:test';
 *
 * setGlobalSnapshotSerializers({
 * 	snapshot,
 * 	snapshotOptions: { circularReferenceWithIndex: true },
 * });
 *
 * t.assert.snapshot(obj); // 全域生效，輸出 "c": "[Circular *1]"
 */
function setGlobalSnapshotSerializers(options) {
  const snapshotOptions = createSnapshotStringify(options.snapshotOptions);
  options.snapshot.setDefaultSnapshotSerializers(snapshotOptions.serializers);
  return snapshotOptions;
}
/**
 * 以 inspect 格式註冊 (Register) 全域預設快照 serializers
 *
 * `inspect` 先經 `_nodeSnapshotInspectFnWrapper()` 包裝（套用預設 `InspectOptions`、
 * 移除 `<ref *n>` 標記）後排入 pipeline 末尾產生最終字串；
 * `snapshotOptions.serializers` 排在前方先做前置轉換。
 * inspect 格式原生支援循環引用 (Circular Reference)，此路徑不經過 `_stringify`
 *
 * @param options - `snapshot` 模組、inspect 函式（`inspect` 為必填）與可選的快照／inspect 選項
 * @returns 註冊用的 `serializers` 與包裝後的 `inspectFn`，供單獨呼叫或除錯
 *
 * @example
 * import { snapshot } from 'node:test';
 * import { inspect } from 'node:util';
 *
 * setGlobalSnapshotSerializersWithInspect({
 * 	snapshot,
 * 	inspect,
 * });
 *
 * t.assert.snapshot(obj); // inspect 格式輸出，開頭無 `<ref *n>`
 */
function setGlobalSnapshotSerializersWithInspect(options) {
  var _options$snapshotOpti, _options$snapshotOpti2;
  const inspectFn = _nodeSnapshotInspectFnWrapper(options.inspect, options === null || options === void 0 ? void 0 : options.inspectOptions);
  const serializers = [...((_options$snapshotOpti = (_options$snapshotOpti2 = options.snapshotOptions) === null || _options$snapshotOpti2 === void 0 ? void 0 : _options$snapshotOpti2.serializers) !== null && _options$snapshotOpti !== void 0 ? _options$snapshotOpti : []), inspectFn];
  options.snapshot.setDefaultSnapshotSerializers(serializers);
  return {
    serializers,
    inspectFn
  };
}

exports._circularLabel = _circularLabel;
exports._circularLabelWithIndex = _circularLabelWithIndex;
exports._createSerializer = _createSerializer;
exports._handleCircularReferences = _handleCircularReferences;
exports._handleHookFn = _handleHookFn;
exports._handleHookNewValue = _handleHookNewValue;
exports._handleOptions = _handleOptions;
exports._isObjectNotNull = _isObjectNotNull;
exports._nodeInspectOptions = _nodeInspectOptions;
exports._nodeInspectResultNoOuterRef = _nodeInspectResultNoOuterRef;
exports._nodeSnapshotInspectFnWrapper = _nodeSnapshotInspectFnWrapper;
exports._regexpSerializeHook = _regexpSerializeHook;
exports._regexpSerializer = _regexpSerializer;
exports._regexpStringify = _regexpStringify;
exports.assertSnapshot = assertSnapshot;
exports.createSnapshotStringify = createSnapshotStringify;
exports.default = createSnapshotStringify;
exports.setGlobalSnapshotSerializers = setGlobalSnapshotSerializers;
exports.setGlobalSnapshotSerializersWithInspect = setGlobalSnapshotSerializersWithInspect;
//# sourceMappingURL=index.cjs.development.cjs.map
