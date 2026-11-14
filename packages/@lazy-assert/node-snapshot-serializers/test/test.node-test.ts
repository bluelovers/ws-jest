import { test, type TestContext, before, type AssertSnapshotOptions } from 'node:test';
import { _nodeInspectResultNoOuterRef, _nodeSnapshotInspectFnWrapper, _regexpSerializeHook, _regexpSerializer, createSnapshotStringify } from '../src';
import { inspect } from 'util';
import { maybe } from 'node-test-maybe';

let safeAssertSnapshotOptions: AssertSnapshotOptions;

before(() => {
	safeAssertSnapshotOptions = createSnapshotStringify();
});

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

/**
 * 使用 `createSnapshotStringify()` 回傳的選項序列化循環結構 (Circular Reference)
 *
 * @example
 * // snapshot: "c": "[Circular]"、"d": { "d1": "[Circular]" }
 */
test('circular structure', (t: TestContext) => {
	let obj = _createCircularStructure();

  t.assert.snapshot(obj, safeAssertSnapshotOptions);
});

/**
 * 啟用 `circularReferenceWithIndex`，讓標籤帶編號以區分不同的循環引用
 *
 * @example
 * // snapshot: "c": "[Circular *1]"、"d1": "[Circular *1]"
 */
test('circular structure with circularReferenceWithIndex', (t: TestContext) => {
	let obj = _createCircularStructure();

  t.assert.snapshot(obj, createSnapshotStringify({
    circularReferenceWithIndex: true,
  }));
});

test('inspect', () => {

	/**
	 * 以 `util.inspect` 自製 serializer，輸出不經 `JSON.stringify` 的格式
	 *
	 * @example
	 * // snapshot: `c: [Circular *1]`、開頭保留 `<ref *1>`
	 */
	test('circular structure with inspect', (t: TestContext) => {
		let obj = _createCircularStructure();

		t.assert.snapshot(obj, {
			serializers: [
				(value) => inspect(value),
			],
		});
	});

	/**
	 * 以 `_nodeSnapshotInspectFnWrapper(inspect)` 包裝 inspect，
	 * 取得與上一個測試相同的格式，但移除開頭的 `<ref *n>` 標記
	 *
	 * @example
	 * // snapshot: 無 `<ref *1>`，`c: [Circular *1]`
	 */
	test('circular structure with inspect and _nodeSnapshotInspectFnWrapper', (t: TestContext) => {
		let obj = _createCircularStructure();

		t.assert.snapshot(obj, {
			serializers: [
				_nodeSnapshotInspectFnWrapper(inspect),
			],
		});
	});

});

test('regexp', () => {

	/**
	 * serializers 形式的 RegExp 支援
	 *
	 * `node:test` 以 pipeline 方式依序傳遞值：`_regexpSerializer` 收到 RegExp
	 * 即轉為字面表示後交給後續 serializer 輸出
	 *
	 * 注意：pipeline 只收到最外層的值，巢狀的 RegExp 不會經過此函式，
	 * 需改用 hook 形式（見 `circular structure with hook _regexpSerializeHook`）
	 *
	 * @example
	 * t.assert.snapshot(re, { serializers: [_regexpSerializer] });
	 */
	test('regexp with serializers', (t: TestContext) => {
		let re = /node:test/gi;

		t.assert.snapshot(re, {
			serializers: [
				_regexpSerializer,
			],
		});
	});

	/**
	 * `createSnapshotStringify` 串接 serializers 的 pipeline
	 *
	 * 使用者的 serializer 排在 pipeline 前段：
	 * `_regexpSerializer` 先把 RegExp 轉為字面字串，
	 * 其回傳值再交給內建的 `_stringify` 以 JSON 格式收尾輸出
	 *
	 * @example
	 * t.assert.snapshot(re, createSnapshotStringify({ serializers: [_regexpSerializer] }));
	 */
	test('regexp with pipeline _regexpSerializer', (t: TestContext) => {
		let re = /createSnapshotStringify/i;

		t.assert.snapshot(re, createSnapshotStringify({
			serializers: [
				_regexpSerializer,
			],
		}));
	});

	/**
	 * 循環結構以 pipeline 形式搭配 `_regexpSerializer`
	 *
	 * 根節點是物件而非 RegExp，`_regexpSerializer` 原樣放行、由 `_stringify` 收尾：
	 * 循環引用正常標記為 `[Circular]`，巢狀的 RegExp 則輸出 `{}`
	 * （pipeline 只處理最外層值，需 `hooks` 才能逐節點轉換）
	 *
	 * @example
	 * t.assert.snapshot(obj, createSnapshotStringify({ serializers: [_regexpSerializer] }));
	 * // "pattern": {}、"c": "[Circular]"
	 */
	test('circular structure with pipeline _regexpSerializer', (t: TestContext) => {
		let obj = _createCircularStructure();

		t.assert.snapshot(obj, createSnapshotStringify({
			serializers: [
				_regexpSerializer,
			],
		}));
	});

	/**
	 * hook 形式的 RegExp 支援
	 *
	 * `_regexpSerializeHook` 在 `_stringify` 的 replacer 內逐節點 (Per-node) 攔截，
	 * 巢狀的 RegExp 同樣會以字面字串取代（未加 hook 時 `JSON.stringify` 會輸出 `{}`）
	 *
	 * @example
	 * t.assert.snapshot(obj, createSnapshotStringify({ hooks: _regexpSerializeHook }));
	 */
	test('circular structure with hook _regexpSerializeHook', (t: TestContext) => {
		let obj = _createCircularStructure();

		t.assert.snapshot(obj, createSnapshotStringify({
			hooks: _regexpSerializeHook,
		}));
	});

});

/**
 * 建立含循環引用 (Circular Reference) 與其他類型的測試用物件
 */
function _createCircularStructure() {
	let re = /node:test/gi;
	let obj = {
		a: 1,
		b: 2,
		[Symbol('c')]: 'Symbol(c)',
		pattern: re,
		nested: {
			deep: /\d+/u,
			re,
		},
	};
	// @ts-ignore
	obj.c = obj;
	// @ts-ignore
	obj.d = {
		d1: obj
	};
	return obj;
}
