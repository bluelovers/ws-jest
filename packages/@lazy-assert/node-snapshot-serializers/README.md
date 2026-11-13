# @lazy-assert/node-snapshot-serializers

讓 `node:test` 的 `t.assert.snapshot()` 能序列化循環引用 (Circular Reference) 結構的快照序列化器 (Snapshot Serializer)。

`node:test` 內建的快照序列化以 `JSON.stringify` 為基礎，遇到循環結構會拋出 `ERR_INVALID_STATE`；本套件以 replacer 追蹤已走訪的物件，將重複出現的參照取代為 `[Circular]` 字串。

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

### 帶編號的循環引用標籤 / Indexed Circular Labels

`circularReferenceWithIndex: true` 會以 `[Circular *n]` 標記，可區分不同的循環引用：

```ts
t.assert.snapshot(obj, createSnapshotStringify({
	circularReferenceWithIndex: true,
}));
// "c": "[Circular *1]"
```

### 自訂 inspect 格式 / Custom inspect Serializer

以 `_nodeSnapshotInspectFnWrapper()` 包裝 `util.inspect`，
輸出 inspect 格式並移除開頭的 `<ref *n>` 標記：

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

## API

| 匯出 / Export | 說明 / Description |
| :--- | :--- |
| `createSnapshotStringify(options?)` | 建立可直接傳給 `t.assert.snapshot(value, options)` 的快照選項，預設以 `[Circular]` 標記循環引用 |
| `_nodeSnapshotInspectFnWrapper(fn, inspectOptions?)` | 將 inspect 風格函式包裝成快照 serializer，套用預設 `InspectOptions` 並移除 `<ref *n>` |
| `_nodeInspectResultNoOuterRef(text)` | 移除 `util.inspect` 輸出開頭的 `<ref *n>` 標記 |
| `IAssertSnapshotOptions` | 快照選項擴充：`circularReferenceWithIndex` 與自訂 `fnLabel` |
