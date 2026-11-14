import { test, type TestContext } from 'node:test';
import { _handleHookFn, createSnapshotStringify, type ISerializeHookFn } from '../src';

/** 快照共用選項：以本套件的 JSON 格式輸出，固定 2 空格縮排 */
const safeAssertSnapshotOptions = createSnapshotStringify();

/**
 * hook 機制驗證：`_handleHookFn` 的標準化行為以斷言與快照 (Snapshot) 覆蓋，
 * 逐節點 (Per-node) 介入的改寫效果以快照覆蓋
 */
test('hook', () => {

	/**
	 * 單一 hook 經 `_handleHookFn` 標準化後，
	 * 改寫結果統一放進 `value` 欄位供 serialize 取用
	 *
	 * @example
	 * // snapshot: { "newValue": "x!", "value": "x!" }
	 */
	test('_handleHookFn normalizes single hook result', (t: TestContext) => {
		const fn = _handleHookFn((value) => ({ newValue: `${value}!` }));
		const result = fn('x', '');

		t.assert.partialDeepStrictEqual(result, { value: 'x!' });
		t.assert.snapshot(result, safeAssertSnapshotOptions);
	});

	/**
	 * 自行回傳的 `value` 會被標準化結果覆寫，
	 * 只有 `_handleHookFn` 產出的 `value` 才是合法值
	 *
	 * @example
	 * // snapshot: { "newValue": "normalized", "value": "normalized" }（自訂 value 已被覆寫）
	 */
	test('_handleHookFn ignores custom value field', (t: TestContext) => {
		const fn = _handleHookFn(() => ({ newValue: 'normalized', value: 'custom' }));
		const result = fn('anything', '');

		t.assert.partialDeepStrictEqual(result, { value: 'normalized' });
		t.assert.snapshot(result, safeAssertSnapshotOptions);
	});

	/**
	 * 陣列 hook 依序執行：後一個 hook 收到的是前一個改寫完成的值；
	 * 命中 `stop` 後其餘 hook 不再執行
	 *
	 * @example
	 * // snapshot: { "newValue": "x-a-b", "stop": true, "value": "x-a-b" }
	 */
	test('_handleHookFn chains array hooks until stop', (t: TestContext) => {
		const calls: string[] = [];
		const fn = _handleHookFn([
			(value) =>
			{
				calls.push('a');
				return { newValue: `${value}-a` };
			},
			(value) =>
			{
				calls.push('b');
				return { newValue: `${value}-b`, stop: true };
			},
			(value) =>
			{
				calls.push('c');
				return { newValue: `${value}-c` };
			},
		]);

		const result = fn('x', '');

		t.assert.deepEqual(calls, ['a', 'b']);
		t.assert.partialDeepStrictEqual(result, { value: 'x-a-b' });
		t.assert.snapshot(result, safeAssertSnapshotOptions);
	});

	/**
	 * 設定 `skip` 時不以 `newValue` 取代目前值，原值原樣保留
	 *
	 * @example
	 * // snapshot: { "newValue": "changed", "skip": true, "value": "keep" }
	 */
	test('_handleHookFn skip keeps original value', (t: TestContext) => {
		const fn = _handleHookFn(() => ({ newValue: 'changed', skip: true }));
		const result = fn('keep', '');

		t.assert.partialDeepStrictEqual(result, { value: 'keep' });
		t.assert.snapshot(result, safeAssertSnapshotOptions);
	});

	/**
	 * 快照：單一 hook 攔截 Map 節點，輸出明文物件 (Plain Object) 而非 `{}`
	 *
	 * @example
	 * // snapshot: "numbers": { "a": 1, "b": 2 }、"self": "[Circular]"
	 */
	test('hooks snapshot with single hook', (t: TestContext) => {
		t.assert.snapshot(_createHookFixture(), createSnapshotStringify({
			hooks: _createMapToPlainHook(),
		}));
	});

	/**
	 * 快照：陣列 hook 串接 —— `_createMapToPlainHook()` 先把 Map 轉成明文物件，
	 * `_stampNumbersHook` 才拿得到該物件並附加 `chained` 標記
	 *
	 * @example
	 * // snapshot: "numbers": { "a": 1, "b": 2, "chained": true }
	 */
	test('hooks snapshot with chained array', (t: TestContext) => {
		t.assert.snapshot(_createHookFixture(), createSnapshotStringify({
			hooks: [
				_createMapToPlainHook(),
				_stampNumbersHook,
			],
		}));
	});

	/**
	 * 快照：第一個 hook 命中 `stop` 後，
	 * `_stampNumbersHook` 不會執行，`numbers` 無 `chained` 標記
	 *
	 * @example
	 * // snapshot: "numbers": { "a": 1, "b": 2 }（無 "chained"）
	 */
	test('hooks snapshot with stop', (t: TestContext) => {
		t.assert.snapshot(_createHookFixture(), createSnapshotStringify({
			hooks: [
				_createMapToPlainHook(true),
				_stampNumbersHook,
			],
		}));
	});

	/**
	 * 快照：`skip` 讓 `newValue: 'IGNORED'` 不被套用，
	 * Map 維持 `JSON.stringify` 的預設輸出 `{}`
	 *
	 * @example
	 * // snapshot: "numbers": {}
	 */
	test('hooks snapshot with skip', (t: TestContext) => {
		t.assert.snapshot(_createHookFixture(), createSnapshotStringify({
			hooks: _skipNumbersHook,
		}));
	});

	/**
	 * 快照：hook 恒回傳 `undefined`、全程不介入，
	 * 循環引用標籤與 Map 的預設輸出皆與未注入 hooks 時一致
	 *
	 * @example
	 * // snapshot: "numbers": {}、"self": "[Circular]"
	 */
	test('hooks snapshot without intervention', (t: TestContext) => {
		t.assert.snapshot(_createHookFixture(), createSnapshotStringify({
			hooks: _noopHook,
		}));
	});

});

/**
 * 建立含 Map 葉節點與循環引用 (Circular Reference) 的測試用物件，
 * `self` 指回根物件，供 hooks 快照同時驗證改寫效果與循環標籤
 */
function _createHookFixture() {
	let obj: any = {
		plain: 'text',
		numbers: new Map([['a', 1], ['b', 2]]),
	};
	obj.self = obj;
	return obj;
}

/**
 * 建立 Map → 明文物件 (Plain Object) 的 hook，未命中時不介入
 *
 * @param stop - 為 `true` 時命中後以 `stop` 中斷其餘 hook
 */
function _createMapToPlainHook(stop?: boolean): ISerializeHookFn
{
	return (value) =>
	{
		if (value instanceof Map)
		{
			return { newValue: Object.fromEntries(value), stop };
		}
	};
}

/**
 * 僅在 `numbers` 鍵附加 `chained` 標記：
 * 陣列中排在 Map 轉換之後，才能取得明文物件並展開其內容
 */
const _stampNumbersHook: ISerializeHookFn = (value, key) =>
{
	if (key === 'numbers')
	{
		return { newValue: { ...(value as Record<string, unknown>), chained: true } };
	}
};

/** 命中 `numbers` 鍵時回傳 `skip`，改寫值 `IGNORED` 不會套用 */
const _skipNumbersHook: ISerializeHookFn = (_value, key) =>
{
	if (key === 'numbers')
	{
		return { newValue: 'IGNORED', skip: true };
	}
};

/** 恒回傳 `undefined`，任何節點都不介入 */
const _noopHook: ISerializeHookFn = () => void 0;
