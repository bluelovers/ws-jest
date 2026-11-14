import type { ISerializeHookFn } from './hook';

/**
 * 將 RegExp 轉為字面表示 (Literal Notation)，例如 `/node:test/gi`
 *
 * @param value - 目標正則表達式 (Regular Expression)
 * @returns 含 source 與 flags 的完整字面字串
 */
export function _regexpStringify(value: RegExp): string
{
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
export function _regexpSerializer(value: unknown)
{
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
export const _regexpSerializeHook: ISerializeHookFn = (value) =>
{
	if (value instanceof RegExp)
	{
		return {
			newValue: _regexpStringify(value),
			stop: true,
		};
	}
};
