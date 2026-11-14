# @lazy-assert/node-snapshot-serializers

讓 `node:test` 的 `t.assert.snapshot()` 能序列化循環引用 (Circular Reference) 結構的快照序列化器 (Snapshot Serializer)。

`node:test` 內建的快照序列化以 `JSON.stringify` 為基礎，遇到循環結構會拋出 `ERR_INVALID_STATE`；本套件以 replacer 追蹤已走訪的物件，將重複出現的參照取代為 `[Circular]` 字串，並可透過逐節點 (Per-node) `hooks` 改寫 RegExp 等 `JSON.stringify` 會輸出為 `{}` 的葉節點。

## Installation

```bash
# Using yarn
yarn add @lazy-assert/node-snapshot-serializers

# Using yarn-tool
yarn-tool add @lazy-assert/node-snapshot-serializers

# yt is an alias for yarn-tool
yt add @lazy-assert/node-snapshot-serializers

# Using pnpm
pnpm add @lazy-assert/node-snapshot-serializers

# Using npm
npm install @lazy-assert/node-snapshot-serializers
```

## Usage

### Basic Usage

```ts
import { test, type TestContext } from 'node:test';
import { createSnapshotStringify } from '@lazy-assert/node-snapshot-serializers';

const options = createSnapshotStringify();

test('circular structure', (t: TestContext) => {
	const obj: any = { a: 1, b: 2 };
	obj.c = obj;
	obj.d = { d1: obj };

	t.assert.snapshot(obj, options);
	// snapshot:
	// {
	//   "a": 1,
	//   "b": 2,
	//   "c": "[Circular]",
	//   "d": {
	//     "d1": "[Circular]"
	//   }
	// }
});
```

### Indexed Circular Labels

`circularReferenceWithIndex: true` 會以 `[Circular *n]` 標記，可區分不同的循環引用：

```ts
t.assert.snapshot(obj, createSnapshotStringify({
	circularReferenceWithIndex: true,
}));
// "c": "[Circular *1]"
```

### Serializers Pipeline

`node:test` 的 serializer 以 pipeline 方式依序傳遞：value 交給第一個 serializer、其回傳值再餵給下一個，全部執行完後的結果即為快照內容。

`createSnapshotStringify()` 把使用者的 serializers 排在前段先做前置轉換，再交給內建 `_stringify` 以 JSON 格式收尾：

```ts
import { createSnapshotStringify, _regexpSerializer } from '@lazy-assert/node-snapshot-serializers';

t.assert.snapshot(/node:test/gi, createSnapshotStringify({
	serializers: [_regexpSerializer],
}));
// "/node:test/gi"
```

注意：pipeline 只收到最外層的值，巢狀節點不會經過使用者的 serializer，需改用 hooks（見下節）。

### Per-node Hooks

`hooks` 可傳入單一 hook 或陣列（含 readonly），在 `_stringify` 的 replacer 內逐節點 (Per-node) 攔截：

```ts
import { createSnapshotStringify, _regexpSerializeHook } from '@lazy-assert/node-snapshot-serializers';

t.assert.snapshot(obj, createSnapshotStringify({
	hooks: _regexpSerializeHook, // 陣列形式亦可：hooks: [hookA, hookB]
}));
// "pattern": "/node:test/gi"
```

hook 回傳 `{ newValue, stop?, skip? }` 或 `undefined`（不介入）：

- `newValue` — 該節點改寫後的值
- `stop` — 陣列形式下停止執行其餘 hook
- `skip` — 不以 `newValue` 取代目前值，保留原值繼續流程

自訂 hook 範例：

```ts
import type { ISerializeHookFn } from '@lazy-assert/node-snapshot-serializers';

const toPlainHook: ISerializeHookFn = (value) =>
	value instanceof Map ? { newValue: Object.fromEntries(value) } : undefined;
```

### Custom inspect Serializer

以 `_nodeSnapshotInspectFnWrapper()` 包裝 `util.inspect`，
輸出 inspect 格式並移除開頭的 `<ref *n>` 標記（inspect 原生支援循環引用）：

```ts
import { inspect } from 'util';
import { _nodeSnapshotInspectFnWrapper } from '@lazy-assert/node-snapshot-serializers';

t.assert.snapshot(obj, {
	serializers: [
		_nodeSnapshotInspectFnWrapper(inspect),
	],
});
// {
//   Symbol(c): 'Symbol(c)',
//   a: 1,
//   b: 2,
//   c: [Circular *1],
//   d: {
//     d1: [Circular *1]
//   }
// }
```

若要全域註冊 inspect 形式，見下方 [Global Serializers](#global-serializers)。

### Bound Assertion

`assertSnapshot(t, options?)` 以 `TestContext` 建立綁定共用選項的斷言函式，單次呼叫可再覆寫選項：

```ts
import { assertSnapshot, _regexpSerializeHook } from '@lazy-assert/node-snapshot-serializers';

const snapshot = assertSnapshot(t, { circularReferenceWithIndex: true });

snapshot(obj); // 共用建立時的選項
snapshot(obj, { hooks: _regexpSerializeHook }); // 該次改用專屬選項
```

### Global Serializers

將 serializers 註冊為 `node:test` 的全域預設快照 serializers 後，
`t.assert.snapshot(value)` 不需再傳選項；下列兩種形式依需求二擇一：

```ts
import { snapshot } from 'node:test';
import { inspect } from 'node:util';
import {
	setGlobalSnapshotSerializers,
	setGlobalSnapshotSerializersWithInspect,
} from '@lazy-assert/node-snapshot-serializers';

// JSON 形式：以 [Circular] 標籤序列化循環引用
setGlobalSnapshotSerializers({
	snapshot,
	snapshotOptions: { circularReferenceWithIndex: true },
});

// inspect 形式：inspect 輸出並移除 <ref *n> 標記
setGlobalSnapshotSerializersWithInspect({ snapshot, inspect });

// 之後直接對快照
t.assert.snapshot(obj);
```

## API

| Export | Description |
| :--- | :--- |
| `createSnapshotStringify(options?)` | 建立可直接傳給 `t.assert.snapshot(value, options)` 的快照選項，預設以 `[Circular]` 標記循環引用 |
| `assertSnapshot(t, options?)` | 以 `TestContext` 建立綁定共用選項的斷言函式，單次呼叫可覆寫選項 |
| `setGlobalSnapshotSerializers(options)` | 以 JSON 形式註冊 `node:test` 全域預設快照 serializers |
| `setGlobalSnapshotSerializersWithInspect(options)` | 以 inspect 形式註冊全域預設快照 serializers，`inspect` 為必填 |
| `_nodeSnapshotInspectFnWrapper(fn, inspectOptions?)` | 將 inspect 風格函式包裝成快照 serializer，套用預設 `InspectOptions` 並移除 `<ref *n>` |
| `_nodeInspectResultNoOuterRef(text)` | 移除 `util.inspect` 輸出開頭的 `<ref *n>` 標記 |
| `_regexpSerializer(value)` | serializers 形式：pipeline 收到 RegExp 時轉為 `/source/flags` 字面字串，其餘值原樣放行 |
| `_regexpSerializeHook` | hooks 形式：逐節點將 RegExp 轉為字面字串，可處理巢狀結構 |
| `_regexpStringify(regexp)` | RegExp 轉為 `/source/flags` 字面字串 |
| `_handleHookFn(hooks)` | 將單一或陣列 hooks 標準化 (Normalize) 為單一 hook 函式 |
| `ISerializeHookFn` / `ISerializeHookResult` | hook 型別：回傳 `{ newValue, stop?, skip? }` 或 `undefined` 表示不介入 |
| `IAssertSnapshotOptions` | 快照選項擴充：`circularReferenceWithIndex`、自訂 `fnLabel` 與逐節點 `hooks` |
| `ISetGlobalSnapshotSerializersOptions` | 全域註冊選項：`snapshot` 模組、`snapshotOptions` 與 inspect 相關欄位 |
