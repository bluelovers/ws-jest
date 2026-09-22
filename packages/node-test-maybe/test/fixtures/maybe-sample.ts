// 這個 fixture 使用本套件的 `testMaybe` API 來定義測試，與正式用法一致。
// 它會被 `run-maybe.ts` 透過 `runMaybe` 執行並收集結果。

import assert from 'node:assert/strict';

import { test, testMaybe } from '../../index.js';

// 普通測試：正常通過（計入 `passed`）。
test('normal passing', () => {
	assert.ok(true);
});

// maybe 測試：通過（非阻斷，計入 `maybePassed`）。
testMaybe('maybe passing', () => {
	assert.ok(true);
});

// maybe 測試：失敗（非阻斷，計入 `maybeFailed`）。
testMaybe('maybe failing', () => {
	assert.equal(1, 2);
});

// 真正的 todo（不是 maybe）：計入 Node 原始 `todo`，會在 `runMaybe` 扣除 maybe 後留下。
test('real todo', { todo: true }, () => {
	// 預期未完成，且不是 maybe。
});
