import type { ITSValueOrArrayMaybeReadonly, ITSPickExtra } from 'ts-type';

/**
 * serialize hook 的回傳值：`[newValue, stop]`
 *
 * - `newValue` - 該節點改用此值輸出，或以此值繼續後續處理
 * - `stop` - 為 `true` 時跳過循環引用追蹤
 */
export interface ISerializeHookResult
{
	newValue: unknown;
	stop?: boolean;
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

export function _handleHookNewValue(value: unknown, hooked: ISerializeHookResult)
{
	if (hooked)
	{
		const newValue = hooked.newValue;

		if (!hooked.skip)
		{
			/** 未跳過或未停止：以改寫後的值繼續一般的循環引用流程 */
			value = newValue;
		}
	}

	return value;
}

export function _handleHookFn(hooks: ITSValueOrArrayMaybeReadonly<ISerializeHookFn>): ISerializeHookFn<ITSPickExtra<ISerializeHookResult, 'value'>>
{
	if (!Array.isArray(hooks))
	{
		return (value: unknown, key: any) =>
		{
			const hooked = (hooks as ISerializeHookFn)(value, key);
			return {
				...hooked,
				value: _handleHookNewValue(value, hooked),
			};
		};
	}

	return (value: unknown, key: any) =>
	{
		let hooked: ISerializeHookResult;

		for (const hook of hooks)
		{
			const curHooked = hook(value, key);

			if (curHooked)
			{
				hooked = curHooked;
				value = _handleHookNewValue(value, curHooked);

				if (curHooked.stop)
				{
					/**
					 * 停止後續處理：值直接交給 `JSON.stringify` 輸出，
					 * 略過循環引用追蹤；回傳原始型別時也不會被往下走訪
					 */
					break;
				}
			}
		}

		return {
			...hooked,
			value,
		};
	};
}
