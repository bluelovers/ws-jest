# node-test-maybe

基於 Node.js 原生測試執行器（`node:test`）的非阻斷測試工具：讓某些測試「可以通過，也可以失敗」，且失敗時不影響整次執行的結束狀態（exit code）。

A non-blocking test helper built on Node.js's native test runner (`node:test`): some tests are *allowed to pass or fail*, and a failure does **not** affect the run's exit code.

## 特色 (Features)

- 基於 Node 原生 `node:test`，無需額外測試框架 / Built on Node's native `node:test`, no extra test framework needed
- 失敗是非阻斷的：也許（maybe）失敗只會顯示為 TODO，不會讓 exit code 變成非零 / Failures are non-blocking: a maybe failure only shows as a TODO and never turns the exit code non-zero
- 三重元數據，互相不衝突，各管一層 / Three orthogonal layers of metadata, each covering a different concern:
  - `[maybe] ` 前綴 → 人眼看得到 / 可攜帶（內建 reporter 只看 test name） / `[maybe] ` prefix → human-visible, portable metadata (the built-in reporter only shows the name)
  - `tags: ['maybe']` → 機器可讀（自訂 reporter / 標籤過濾器） / `tags: ['maybe']` → machine-readable metadata for custom reporters / tag filters
  - `todo: true` → Node 原生的「非阻斷失敗」語意 / `todo: true` → Node-native non-blocking failure semantics
- 保留使用者自帶的 `tags`，再追加 `maybe` 標籤 / Preserves the user's own `tags` and appends the `maybe` tag
- 提供 `runMaybe()` 程式化 API，回傳結構化的 maybe-aware 摘要 / Provides a programmatic `runMaybe()` API returning a structured, maybe-aware summary

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add node-test-maybe

# 使用 yarn-tool / Using yarn-tool
yarn-tool add node-test-maybe
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add node-test-maybe

# 使用 pnpm / Using pnpm
pnpm add node-test-maybe

# 使用 npm / Using npm
npm install node-test-maybe
```

## 使用方式 (Usage)

### 寫一個 maybe 測試 (Writing a maybe test)

`maybe` 直接掛在 Node 原生 `test` 上，所以可以 `test.maybe(...)` 直接呼叫；同時也提供獨立的 `maybe` / `testMaybe` 匯出。

`maybe` is attached directly onto Node's native `test`, so you can call `test.maybe(...)`; standalone `maybe` / `testMaybe` exports are also provided.

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

### 程式化執行並收集結果 (Programmatic run with summary)

`runMaybe()` 啟動測試執行器（自動偵測 `tsx` / `node`），透過 `--test-reporter` 收集結果，回傳結構化的 `IMaybeRunSummary`。

`runMaybe()` spawns the test runner (auto-detecting `tsx` / `node`), collects results via `--test-reporter`, and resolves a structured `IMaybeRunSummary`.

```typescript
import { runMaybe } from 'node-test-maybe/run';

const summary = await runMaybe({
	files: ['test/**/*.node-test.ts'],
});

// summary.todo 已經扣除 maybe 的數量（原始值保留在 summary.rawTodo）
// summary.todo already deducts the maybe count (raw value kept in summary.rawTodo)
console.log(summary);

// 只有「硬失敗」才讓程序失敗；maybe 失敗是非阻斷的
// only hard failures fail the process; maybe failures are non-blocking
if (!summary.ok) {
	process.exitCode = 1;
}
```

## API 參考 (API Reference)

### 函式 (Functions)

| 匯出 (Export) | 說明 (Description) |
|--------------|-------------------|
| `maybe(name, fn)`<br>`maybe(name, options, fn)`<br>`maybe(fn)` | 註冊一個 maybe 測試：可通過也可失敗，失敗不影響 exit code / Register a maybe test: may pass or fail, failure does not affect exit code |
| `testMaybe` | `maybe` 的別名 / Alias of `maybe` |
| `test` | Node 原生 `node:test`，並附加 `test.maybe` / The native `node:test` with `test.maybe` attached |
| `buildMaybeName(name)` | 產生人眼看得到的名稱：`'[maybe] ' + name` / Build the human-visible name |
| `buildMaybeTags(tags?)` | 保留使用者 tags 並追加 `'maybe'` / Preserve user tags and append `'maybe'` |
| `runMaybe(runOptions?, options?)` | 程式化執行並回傳 `IMaybeRunSummary` / Run programmatically and resolve `IMaybeRunSummary` |

### 常數 (Constants)

| 常數 (Constant) | 值 (Value) | 說明 (Description) |
|----------------|-----------|-------------------|
| `MAYBE_TAG` | `'maybe'` | 機器可讀的標籤 / machine-readable tag |
| `MAYBE_PREFIX` | `'[maybe] '` | 人眼看得到的名稱前綴 / human-visible name prefix |

### `runMaybe` 選項 (Options)

| 選項 (Option) | 類型 (Type) | 預設 (Default) | 說明 (Description) |
|--------------|------------|---------------|-------------------|
| `silent` | `boolean` | `false` | 不印出精簡報表 / suppress the compact summary print |
| `reporterOptions` | `Partial<IReporterOptions>` | env / built-in | reporter 微調（如 `showZero`）/ reporter tuning |
| `cwd` | `string` | `process.cwd()` | 子行程工作目錄 / child working directory |
| `output` | `WritableStream` | `process.stdout` | 報表寫入位置 / where the report is written |
| `runner` | `EnumRunner \| string` | `EnumRunner.Auto` | 強制指定執行器（見下）/ force the runner command |

`runner` 可接受 `EnumRunner` 成員或任意字串（如 `'bun'` 或執行器絕對路徑）：
`runner` accepts an `EnumRunner` member or any string (e.g. `'bun'` or an absolute path to a runner):

- `EnumRunner.Auto`（預設）：可解析到 `tsx` 就用 `tsx`，否則用 `node` / use `tsx` when resolvable, else `node`
- `EnumRunner.Node`：永遠用 `node --test` + 內建 `run-collector.js` / always `node --test` + built `run-collector.js`
- `EnumRunner.Tsx`：永遠用 `tsx`（真的沒有就自然失敗）/ always `tsx` (fails naturally if absent)
- 其他字串：原樣當作指令使用 / used verbatim as the command

### `IMaybeRunSummary` 回傳值 (Return value)

| 欄位 (Field) | 類型 (Type) | 說明 (Description) |
|-------------|------------|-------------------|
| `total` | `number` | 測試總數 / total tests |
| `passed` | `number` | 通過數 / passed |
| `failed` | `number` | 硬失敗數（maybe 失敗不算） / hard failures (maybe failures excluded) |
| `skipped` | `number` | 略過數 / skipped |
| `cancelled` | `number` | 取消數 / cancelled |
| `todo` | `number` | 真實 TODO 數（已扣除 maybe） / real TODO count (maybe deducted) |
| `rawTodo` | `number` | 扣除前的原始 TODO 數 / raw TODO before deduction |
| `maybePassed` | `number` | maybe 通過數 / maybe passed |
| `maybeFailed` | `number` | maybe 失敗數（非阻斷） / maybe failed (non-blocking) |
| `maybeTotal` | `number` | maybe 總數 / maybe total |
| `files` | `string[]` | 參與的檔案 / files involved |
| `ok` | `boolean` | 沒有硬失敗時為 `true` / `true` when no hard failures |

## 設計說明 (Implementation notes)

maybe 測試是建構在 `todo: true` 之上，因此 Node 會把它算進自己的 `todo` 桶子裡。`runMaybe()` 會從 Node 的 `todo` 數量中扣掉 maybe 數量，讓回傳的 `todo` 反映真正的待辦項目。

Because a maybe test is built on `todo: true`, Node counts it inside its own `todo` bucket. `runMaybe()` deducts the maybe count from Node's `todo` so the returned `todo` reflects real pending TODOs.

## 授權 (License)

ISC
