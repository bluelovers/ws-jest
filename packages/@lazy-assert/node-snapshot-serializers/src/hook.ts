import type { ITSValueOrArrayMaybeReadonly, ITSPickExtra } from 'ts-type';

/**
 * serialize hook 的回傳結果
 *
 * 以 `newValue` 描述節點如何被改寫，
 * `stop` / `skip` 決定其餘 hook 與改寫值的處理方式
 */
export interface ISerializeHookResult
{
	/** 該節點改寫後的值；未設定 `skip` 時取代目前值 */
	newValue: unknown;
	/** 為 `true` 時停止執行其餘 hook；`hooks` 為單一函式時不生效 */
	stop?: boolean;
	/** 為 `true` 時不以 `newValue` 取代目前值，保留原值繼續流程 */
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

/**
 * 將 hook 回傳的 `newValue` 套用到目前值
 *
 * @param value - 目前節點的值
 * @param hooked - hook 回傳的結果
 * @returns 套用 `newValue` 後的值；未回傳結果或設定 `skip` 時維持原值
 */
export function _handleHookNewValue(value: unknown, hooked: ISerializeHookResult)
{
	if (hooked)
	{
		const newValue = hooked.newValue;

		if (!hooked.skip)
		{
			/** 未設定 `skip`：以 `newValue` 取代目前值，作為後續處理的輸入 */
			value = newValue;
		}
	}

	return value;
}

/**
 * 將 `hooks` 選項標準化 (Normalize) 為單一 hook 函式
 *
 * 單一函式直接執行；陣列則依序執行，各 hook 的 `newValue` 依序疊加為目前值，
 * 命中 `stop` 即停止其餘 hook
 *
 * @param hooks - 單一 hook、陣列或 readonly 陣列
 * @returns 回傳統一形狀的 hook，`value` 必為整條鏈處理完成的節點值，
 * 供 `_createSerializer.serialize` 直接取用
 */
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
					 * 命中 `stop`：停止執行其餘 hook，目前值即為整條 hook 鏈的最終結果；
					 * 若 `newValue` 為原始型別 (Primitive)，`JSON.stringify` 也不會再往下走訪
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
