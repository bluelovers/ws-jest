import { AssertSnapshotOptions, TestContext, snapshot as snapshotModule } from 'node:test';
import { ITSPickExtra, ITSRequiredWith, ITSValueOrArrayMaybeReadonly } from 'ts-type';
import { InspectOptions } from 'util';

/**
 * serialize hook 的回傳結果
 *
 * 以 `newValue` 描述節點如何被改寫，
 * `stop` / `skip` 決定其餘 hook 與改寫值的處理方式
 */
export interface ISerializeHookResult {
	/** 該節點改寫後的值；未設定 `skip` 時取代目前值 */
	newValue: unknown;
	/** 為 `true` 時停止執行其餘 hook；`hooks` 為單一函式時不生效 */
	stop?: boolean;
	/** 為 `true` 時不以 `newValue` 取代目前值，保留原值繼續流程 */
	skip?: boolean;
	/**
	 * 只有經過 {@link _handleHookFn} 標準化 hook 才會回傳的合法值
	 *
	 * 自定義 hook 本身即使回傳 `value` 也會被忽略
	 */
	readonly value?: unknown;
}
/**
 * serialize hook：由 `_createSerializer()` 注入 `serialize`，
 * 在每個節點進入循環引用處理之前攔截
 *
 * 回傳 `undefined` 表示不介入，該節點維持一般流程
 *
 * @param value - 目前節點的值
 * @param key - 該節點的鍵名，根節點為空字串
 */
export type ISerializeHookFn<T extends Partial<ISerializeHookResult> = ISerializeHookResult> = (value: unknown, key: string) => T | undefined;
/**
 * 將 hook 回傳的 `newValue` 套用到目前值
 *
 * @param value - 目前節點的值
 * @param hooked - hook 回傳的結果
 * @returns 套用 `newValue` 後的值；未回傳結果或設定 `skip` 時維持原值
 */
export declare function _handleHookNewValue(value: unknown, hooked: ISerializeHookResult): unknown;
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
export declare function _handleHookFn(hooks: ITSValueOrArrayMaybeReadonly<ISerializeHookFn>): ISerializeHookFn<ITSPickExtra<ISerializeHookResult, "value">>;
/**
 * 將 RegExp 轉為字面表示 (Literal Notation)，例如 `/node:test/gi`
 *
 * @param value - 目標正則表達式 (Regular Expression)
 * @returns 含 source 與 flags 的完整字面字串
 */
export declare function _regexpStringify(value: RegExp): string;
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
export declare function _regexpSerializer(value: unknown): unknown;
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
export declare const _regexpSerializeHook: ISerializeHookFn;
/**
 * `node:test` 快照選項的擴充 (Snapshot Serializer Options)
 *
 * 在 `AssertSnapshotOptions` 之上增加循環引用 (Circular Reference) 的標籤策略，
 * 與 `createSnapshotStringify()` 搭配使用
 */
export interface IAssertSnapshotOptions extends AssertSnapshotOptions {
	/** 以 `[Circular *n]` 形式標記重複出現的物件；未啟用時固定輸出 `[Circular]` */
	circularReferenceWithIndex?: boolean;
	/** 自訂循環引用標籤的產生函式，有指定時優先於 `circularReferenceWithIndex` */
	fnLabel?: ICircularReferencesLabelFn;
	/**
	 * 逐節點 (Per-node) 攔截的 serialize hook，可傳入單一函式或陣列（含 readonly）；
	 * 相較 `serializers` 只收到最外層值，hooks 可處理巢狀結構中的節點，
	 * 陣列由 `_handleHookFn()` 依序串接執行
	 */
	hooks?: ITSValueOrArrayMaybeReadonly<ISerializeHookFn>;
}
/**
 * `createSnapshotStringify()` 的回傳值
 *
 * 可直接作為 `t.assert.snapshot(value, options)` 的第二參數；
 * `_stringify` 則保留單獨呼叫、將任意值序列化為字串的入口
 */
export interface ICreateSnapshotResult extends AssertSnapshotOptions {
	/** 與 `serializers` 陣列內建相同的序列化函式，供單獨呼叫、除錯輸出結果 */
	_stringify: (obj: any) => string;
}
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
export declare function _nodeInspectResultNoOuterRef(inspectResult: string): string;
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
export declare function _nodeSnapshotInspectFnWrapper(fn: (value: unknown, options?: InspectOptions) => string, inspectOptions?: InspectOptions): (value: unknown) => string;
/**
 * 合併快照用途的 `InspectOptions` 預設值
 *
 * 預設展開全部深度、非緊湊 (Compact)、依鍵名排序且不輸出顏色，
 * 讓快照輸出不受終端機寬度與屬性走訪順序影響
 *
 * @param inspectOptions - 使用者提供的覆寫值
 * @returns 合併後的選項
 */
export declare function _nodeInspectOptions(inspectOptions?: InspectOptions): InspectOptions;
/** 判斷是否為非 `null` 的物件型別，作為循環引用追蹤的判定門檻 */
export declare function _isObjectNotNull(value: unknown): value is object;
/**
 * 循環引用追蹤狀態 (Seen Context)
 *
 * 由同一輪序列化共用，序列化結束後即丟棄、不跨快照保留
 */
export interface ISeenCtx {
	/** 已走訪物件與其首次出現編號的對應，以 `WeakMap` 保存、不阻止垃圾回收 (Garbage Collection) */
	seenCache: WeakMap<object, number>;
	/** 編號計數器，新物件以 `++seenIndex` 取得編號，從 1 起算 */
	seenIndex: number;
	/** 已登記編號的物件數量 */
	seenCount: number;
}
/**
 * 循環引用標籤的產生函式
 *
 * @param value - 物件首次出現時登記的編號
 * @returns 標籤字串；回傳 `undefined` 時該節點會被略過
 */
export type ICircularReferencesLabelFn = (value?: number) => string | undefined;
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
export declare function _handleCircularReferences(value: unknown, runtime: {
	fnLabel: ICircularReferencesLabelFn;
	seenCtx: ISeenCtx;
}): unknown;
/**
 * 產生帶編號的循環引用標籤，例如 `[Circular *1]`
 *
 * @param seenIndex - 物件首次出現時登記的編號
 */
export declare function _circularLabelWithIndex(seenIndex: number): string;
/**
 * 產生固定的循環引用標籤 `[Circular]`，不區分編號
 *
 * @param _seenIndex - 相容 `ICircularReferencesLabelFn` 簽名而保留，未使用
 */
export declare function _circularLabel(_seenIndex?: number): string;
/**
 * 補上預設的循環引用標籤策略 (Label Strategy)
 *
 * `fnLabel` 有明確指定時優先採用；
 * 否則依 `circularReferenceWithIndex` 決定標籤是否帶編號
 *
 * @param options - 使用者選項，可為空
 * @returns 保證 `fnLabel` 已存在的選項
 */
export declare function _handleOptions(options?: IAssertSnapshotOptions): ITSRequiredWith<IAssertSnapshotOptions, "fnLabel">;
/**
 * 建立單一快照序列化週期專用的 serializer 狀態
 *
 * 回傳值同時提供 `JSON.stringify` replacer 形式的 `serialize`
 * 與 `seenIndex` / `seenCount` 觀察點
 *
 * @param options - 快照選項，可省略
 */
export declare function _createSerializer(options?: IAssertSnapshotOptions): {
	seenCache: WeakMap<object, number>;
	/** 觀察點：目前已登記的最大編號 */
	seenIndex(): number;
	/** 觀察點：已登記編號的物件數量 */
	seenCount(): number;
	/** 只對物件節點執行序列化，其餘值交由 `JSON.stringify` 內建行為處理 */
	test: (value: unknown) => value is object;
	/** `JSON.stringify` 的 replacer 形式：以 `(key, value)` 接收每個節點，先經 hook 攔截再判斷是否為重複出現的物件 */
	serialize: (_key: any, value: unknown) => unknown;
};
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
export declare function createSnapshotStringify(options?: IAssertSnapshotOptions): ICreateSnapshotResult;
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
export declare function assertSnapshot(t: TestContext, options?: IAssertSnapshotOptions): (value: any, options?: IAssertSnapshotOptions) => void;
/**
 * `setGlobalSnapshotSerializers()` 系列的共用選項
 *
 * `inspect` 與 `inspectOptions` 只有 inspect 形式會用到
 */
export interface ISetGlobalSnapshotSerializersOptions {
	/** `node:test` 匯出的 `snapshot` 模組，用來註冊全域預設 serializers */
	snapshot: typeof snapshotModule;
	/**
	 * 快照選項：`setGlobalSnapshotSerializers()` 整份傳入 `createSnapshotStringify()`；
	 * inspect 形式只取用其中的 `serializers` 排入 pipeline 前段
	 */
	snapshotOptions?: IAssertSnapshotOptions;
	/** inspect 風格函式 (Inspect Function)，例如 `node:util` 的 `inspect`；inspect 形式為必填 */
	inspect?: typeof import("node:util").inspect;
	/** inspect 的覆寫選項，由 `_nodeSnapshotInspectFnWrapper()` 與預設值合併 */
	inspectOptions?: InspectOptions;
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
export declare function setGlobalSnapshotSerializers(options: ISetGlobalSnapshotSerializersOptions): ICreateSnapshotResult;
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
export declare function setGlobalSnapshotSerializersWithInspect(options: ITSRequiredWith<ISetGlobalSnapshotSerializersOptions, "inspect">): {
	serializers: (((value: unknown) => string) | ((value: any) => any))[];
	inspectFn: (value: unknown) => string;
};

export {
	createSnapshotStringify as default,
};

export {};
