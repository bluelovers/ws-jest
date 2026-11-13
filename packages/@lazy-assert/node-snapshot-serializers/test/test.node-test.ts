import { test, type TestContext, before, type AssertSnapshotOptions } from 'node:test';
import { _nodeInspectResultNoOuterRef, _nodeSnapshotInspectFnWrapper, createSnapshotStringify } from '../src';
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
test('circular structure with _nodeSnapshotInspectFnWrapper', (t: TestContext) => {
	let obj = _createCircularStructure();

  t.assert.snapshot(obj, {
    serializers: [
      _nodeSnapshotInspectFnWrapper(inspect),
    ],
  });
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

/**
 * 建立含循環引用 (Circular Reference) 與 Symbol 鍵的測試用物件
 *
 * `c` 直接指回根物件、`d.d1` 再經一層指回根物件，
 * 用來驗證各 serializer 對直接與間接循環的標籤輸出
 */
function _createCircularStructure() {
	let obj = {
		a: 1,
		b: 2,
		[Symbol('c')]: 'Symbol(c)',
	};
	// @ts-ignore
	obj.c = obj;
	// @ts-ignore
	obj.d = {
		d1: obj
	};
	return obj;
}
