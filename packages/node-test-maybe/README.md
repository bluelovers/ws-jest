# node-test-maybe

基於 Node.js 原生測試執行器（`node:test`）的非阻斷測試工具：讓某些測試「可以通過，也可以失敗」，且失敗時不影響整次執行的結束狀態（exit code）。

A non-blocking test helper built on Node.js's native test runner (`node:test`): some tests are *allowed to pass or fail*, and a failure does **not** affect the run's exit code.

## 特色 (Features)

- 基於 Node 原生 `node:test`，無需額外測試框架
- 失敗是非阻斷的：也許（maybe）失敗只會顯示為 TODO，不會讓 exit code 變成非零
- 三重元數據，互相不衝突，各管一層 / Three orthogonal layers of metadata, each covering a different concern:
  - `[maybe] ` 前綴 → 人眼看得到 / 可攜帶（內建 reporter 只看 test name）
  - `tags: ['maybe']` → 機器可讀（自訂 reporter / 標籤過濾器）
  - `todo: true` → Node 原生的「非阻斷失敗」語意
- 保留使用者自帶的 `tags`，再追加 `maybe` 標籤
- 提供 `runMaybe()` 程式化 API，回傳結構化的 maybe-aware 摘要

---

- Built on Node's native `node:test`, no extra test framework needed
- Failures are non-blocking: a maybe failure only shows as a TODO and never turns the exit code non-zero
- Three orthogonal layers of metadata, each covering a different concern:
  - `[maybe] ` prefix → human-visible, portable metadata (the built-in reporter only shows the name)
  - `tags: ['maybe']` → machine-readable metadata for custom reporters / tag filters
  - `todo: true` → Node-native non-blocking failure semantics
- Preserves the user's own `tags` and appends the `maybe` tag
- Provides a programmatic `runMaybe()` API returning a structured, maybe-aware summary


## Installation

```bash
# Using yarn
yarn add node-test-maybe

# Using yarn-tool
yarn-tool add node-test-maybe
# yt is an alias for yarn-tool
yt add node-test-maybe

# Using pnpm
pnpm add node-test-maybe

# Using npm
npm install node-test-maybe
```

## 使用方式

### 寫一個 maybe 測試

`maybe` 直接掛在 Node 原生 `test` 上，所以可以 `test.maybe(...)` 直接呼叫；同時也提供獨立的 `maybe` / `testMaybe` 匯出。

```typescript
import test, { maybe } from 'node-test-maybe';

// test.maybe(...) 直接掛在原生 test 上 / attached onto the native test
test.maybe('external API is up', () => {
	// 這個測試「可以成功，也可以失敗」/ this test may pass or fail
	// 失敗時只會顯示為 TODO，不會讓程序失敗 / a failure only shows as a TODO
	assert.equal(actual, expected);
});

// 等價的獨立寫法 / equivalent standalone form
maybe('external API is up', () => {
	assert.equal(actual, expected);
});

// 帶 options（使用者自帶的 tags 會被保留） / with options (user tags are preserved)
maybe('network call', { tags: ['network', 'external'], timeout: 5000 }, () => {
	// ...
});
```

### 三種參數形式 (Three call signatures)

```typescript
// maybe(name, fn)
maybe('external API', () => { /* ... */ });

// maybe(name, options, fn)
maybe('network call', { tags: ['network'], timeout: 5000 }, () => { /* ... */ });

// maybe(fn) —— 名稱從函式名稱推導 / name derived from the function
maybe(function myCheck() { /* ... */ });
```

### 搭配 `t.assert.snapshot` 的非阻斷範例 (Non-blocking example with `t.assert.snapshot`)

下列測試依賴 Node 快照序列化器（snapshot serializers）修復 circular structure 問題，因此「預期會失敗」；用 `maybe` 包起來後，錯誤訊息仍會顯示，但不會讓整次執行失敗。

The following test depends on a Node fix for circular structures in snapshot serializers, so it is *expected to fail*; wrapped with `maybe`, the error is still printed but never fails the run.

```typescript
/**
 * this test is expected to fail until nodejs fixes the snapshot serializer issue
 * because the default snapshot serializers
 * cannot handle circular structures
 *
 * test will show the error message but not fail the test at end of run
 *
 * @example
 * ⚠ [maybe] circular structure without snapshot serializers (1.438ms)
 * Error [ERR_INVALID_STATE]: Invalid state: The provided serializers did not generate a string.
 * {
 *   code: 'ERR_INVALID_STATE',
 *   input: <ref *1> { a: 1, b: 2, c: [Circular *1], d: { d1: [Circular *1] } },
 *   cause: TypeError [Error]: Converting circular structure to JSON
 *       --> starting at object with constructor 'Object'
 *       --- property 'c' closes the circle
 *       at stringify (<anonymous>)
 * }
 */
maybe('circular structure without snapshot serializers', (t: TestContext) => {
	let obj = _createCircularStructure();

	t.assert.snapshot('This test is expected to fail until nodejs fixes the snapshot serializer issue');

	t.assert.snapshot(obj, {
		/**
		 * try reset serializers to void 0
		 * to see if it works
		 */
		serializers: void 0,
	});

	t.assert.snapshot('Good news: the test passed! nodejs issue is fixed!');
});
```

### 程式化執行並收集結果 (Programmatic run with summary)

`runMaybe()` 啟動測試執行器（自動偵測 `tsx` / `node`），透過 `--test-reporter` 收集結果，回傳結構化的 `IMaybeRunSummary`。

```typescript
import { runMaybe } from 'node-test-maybe/run';

const summary = await runMaybe({
	files: ['test/**/*.node-test.ts'],
});

// summary.todo already deducts the maybe count (raw value kept in summary.rawTodo)
console.log(summary);

// only hard failures fail the process; maybe failures are non-blocking
if (!summary.ok) {
	process.exitCode = 1;
}
```

## CLI

`node-test-maybe` 的 maybe 測試本質上是 Node 原生 `node:test` 測試（只是標記了 `todo`），所以你可以用任何 Node 測試執行方式直接跑；搭配本套件提供的 reporter / collector，可以得到「maybe-aware」的報表。

A maybe test is just a Node native `node:test` test (only marked `todo`), so you can run it with any Node test runner; pairing it with this package's reporter / collector yields a maybe-aware report.

### Run directly, built-in reporter

```bash
# run directly: a failing maybe test only shows as a TODO, exit code stays 0
node --test
```

### Using the maybe-aware reporter, TS source

```bash
# 需要 tsx 才能載入 .ts reporter
tsx --test-reporter=./reporter.ts --test test/*.node-test.ts
```

### Using the maybe-aware reporter, built .js

發佈後套件只含編譯結果，可直接用原生 `node` 載入 `.js` reporter：

```bash
node --test --test-reporter=node-test-maybe/reporter.js test/
# minimal reporter
node --test --test-reporter=node-test-maybe/reporter-min.js test/
```

reporter 可透過環境變數或選項微調：

| Option | Default | Description |
|--------------|---------------|-------------------|
| `maybeOnly` | `false` | 只輸出 maybe 結果的 `◌ MAYBE` 標記，其餘訊息原樣透過 |
| `showZero` | `false` | 是否列出數值為 0 的摘要行（預設隱藏） |

### 用 collector 收集 JSON 摘要

`run-collector.js` 是一個 JSON collector，最後一行輸出單一 JSON 物件，供 `runMaybe()` 解析：

```bash
node --test --test-reporter=./run-collector.js --test test/fixtures/sample.mjs
```

### 套件內建範例指令 (Built-in demo scripts)

本套件 `package.json` 提供可直接執行的範例：
The package ships runnable demos via `package.json` scripts:

```bash
# TypeScript 範例：runMaybe + 報表 / TS demo: runMaybe + report
pnpm run demo:run-maybe          # tsx test/example/run-maybe.ts

# 純 JS 範例：不依賴 tsx / plain JS demo, no tsx needed
pnpm run demo:run-maybe:js       # node test/example/run-maybe-js.mjs

# 直接示範 collector / direct collector demo
pnpm run demo:run-collector:js   # node --test --test-reporter=./run-collector.js --test test/fixtures/sample.mjs
```

## API Reference

### Functions

| Export | Description |
|--------------|-------------------|
| `maybe(name, fn)`<br>`maybe(name, options, fn)`<br>`maybe(fn)` | 註冊一個 maybe 測試：可通過也可失敗，失敗不影響 exit code |
| `testMaybe` | `maybe` 的別名 |
| `test` | Node 原生 `node:test`，並附加 `test.maybe` |
| `buildMaybeName(name)` | 產生人眼看得到的名稱：`'[maybe] ' + name` |
| `buildMaybeTags(tags?)` | 保留使用者 tags 並追加 `'maybe'` |
| `runMaybe(runOptions?, options?)` | 程式化執行並回傳 `IMaybeRunSummary` |

### Constants

| Constant | Value | Description |
|----------------|-----------|-------------------|
| `MAYBE_TAG` | `'maybe'` | machine-readable tag |
| `MAYBE_PREFIX` | `'[maybe] '` | human-visible name prefix |

### `runMaybe` 選項 (Options)

| Option | Type | Default | Description |
|--------------|------------|---------------|-------------------|
| `silent` | `boolean` | `false` | 不印出精簡報表 |
| `reporterOptions` | `Partial<IReporterOptions>` | env / built-in | reporter 微調（如 `showZero`） |
| `cwd` | `string` | `process.cwd()` | 子行程工作目錄 |
| `output` | `WritableStream` | `process.stdout` | 報表寫入位置 |
| `runner` | `EnumRunner \| string` | `EnumRunner.Auto` | 強制指定執行器（見下） |

`runner` 可接受 `EnumRunner` 成員或任意字串（如 `'bun'` 或執行器絕對路徑）：

- `EnumRunner.Auto`（預設）：可解析到 `tsx` 就用 `tsx`，否則用 `node`
- `EnumRunner.Node`：永遠用 `node --test` + 內建 `run-collector.js`
- `EnumRunner.Tsx`：永遠用 `tsx`（真的沒有就自然失敗）
- 其他字串：原樣當作指令使用

### `IMaybeRunSummary` 回傳值

| Field | Type | Description |
|-------------|------------|-------------------|
| `total` | `number` | 測試總數 |
| `passed` | `number` | 通過數 |
| `failed` | `number` | 硬失敗數（maybe 失敗不算） |
| `skipped` | `number` | 略過數 |
| `cancelled` | `number` | 取消數 |
| `todo` | `number` | 真實 TODO 數（已扣除 maybe） |
| `rawTodo` | `number` | 扣除前的原始 TODO 數 |
| `maybePassed` | `number` | maybe 通過數 |
| `maybeFailed` | `number` | maybe 失敗數（非阻斷） |
| `maybeTotal` | `number` | maybe 總數 |
| `files` | `string[]` | 參與的檔案 |
| `ok` | `boolean` | 沒有硬失敗時為 `true` |

## 設計說明 (Implementation notes)

maybe 測試是建構在 `todo: true` 之上，因此 Node 會把它算進自己的 `todo` 桶子裡。`runMaybe()` 會從 Node 的 `todo` 數量中扣掉 maybe 數量，讓回傳的 `todo` 反映真正的待辦項目。

Because a maybe test is built on `todo: true`, Node counts it inside its own `todo` bucket. `runMaybe()` deducts the maybe count from Node's `todo` so the returned `todo` reflects real pending TODOs.
