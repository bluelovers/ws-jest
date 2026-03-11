/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import {
	matcherHint,
	printExpected,
	printReceived,
	matcherErrorMessage,
	EXPECTED_COLOR, printWithType, RECEIVED_COLOR,
} from 'jest-matcher-utils';
import { numberInDelta } from 'num-in-delta';
import { printCloseTo } from 'expect-print-close-to';
import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';
import { subAbs } from 'num-in-delta/lib/util';
import { handleJestMatcherHintOptions } from '@lazy-assert/jest-util';
import { IMatcherContext, ICustomMatcherResult } from '@lazy-assert/jest-global-types-extra';

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			/**
			 * 檢查實際數值是否在預期數值的 ± delta 範圍內
			 * Check if actual number is within expected number ± delta
			 */
			toBeCloseWith(expected: number, delta?: number, numDigits?: number): R;
		}

		interface Expect
		{
			toBeCloseWith(expected: number, delta?: number, numDigits?: number): void;
		}

	}

}

declare module 'expect'
{
	interface Matchers<R extends void | Promise<void>>
	{
		toBeCloseWith(expected: number, delta?: number, numDigits?: number): R;
	}
}

/**
 * 檢查實際數值是否在預期數值的 ± delta 範圍內
 * Check if actual number is within expected number ± delta
 *
 * 結合 num-in-delta 和 Jest 的 toBeCloseTo 功能，提供更靈活的數值比較
 * Combines num-in-delta with Jest's toBeCloseTo for more flexible number comparison
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 實際數值 / Actual number
 * @param expected - 預期數值 / Expected number
 * @param delta - 允許的誤差範圍 / Allowed delta
 * @param precision - 精度位數（預設 4）/ Precision digits (default 4)
 * @returns 匹配結果 / Match result
 */
export function toBeCloseWith(
	this: IMatcherContext,
	received: number,
	expected: number,
	delta?: number,
	precision: number = 4
): ICustomMatcherResult
{
	const matcherName = 'toBeCloseWith' as const;
	// @ts-ignore
	const isNot = this.isNot;

	// @ts-ignore
	const options = handleJestMatcherHintOptions(this, {
		secondArgument: arguments.length === 3 ? 'precision' : undefined,
	});

	// 驗證預期值是否為數字 / Validate expected is a number
	if (typeof expected !== 'number')
	{
		throw new Error(
			matcherErrorMessage(
				matcherHint(matcherName, undefined, undefined, options),
				`${EXPECTED_COLOR('expected')} value must be a number`,
				printWithType('Expected', expected, printExpected),
			),
		);
	}

	// 驗證接收值是否為數字 / Validate received is a number
	if (typeof received !== 'number')
	{
		throw new Error(
			matcherErrorMessage(
				matcherHint(matcherName, undefined, undefined, options),
				`${RECEIVED_COLOR('received')} value must be a number`,
				printWithType('Received', received, printReceived),
			),
		);
	}

	let pass = false;
	let expectedDiff = 0;
	let receivedDiff = 0;

	// 處理無限大的特殊情況 / Handle infinity edge cases
	if (received === Infinity && expected === Infinity)
	{
		pass = true; // Infinity - Infinity is NaN
	}
	else if (received === -Infinity && expected === -Infinity)
	{
		pass = true; // -Infinity - -Infinity is NaN
	}
	else
	{
		// 計算預期差異值 / Calculate expected difference
		expectedDiff = Math.pow(10, -precision) / 2;
		// 計算實際差異值 / Calculate actual difference
		receivedDiff = Number(subAbs(received, expected));

		// 使用 num-in-delta 檢查是否在範圍內 / Use num-in-delta to check if in range
		pass = numberInDelta(received, expected, delta)
	}

	// 產生訊息函數 / Generate message function
	const message = pass
		? () =>
			matcherHint(matcherName, undefined, undefined, options) +
			'\n\n' +
			`Expected: not ${printExpected(expected)}\n` +
			(receivedDiff === 0
				? ''
				: `Received:     ${printReceived(received)}\n` +
				'\n' +
				printCloseTo(receivedDiff, expectedDiff, precision, isNot))
		: () =>
			matcherHint(matcherName, undefined, undefined, options) +
			'\n\n' +
			`Expected: ${printExpected(expected)}\n` +
			`Received: ${printReceived(received)}\n` +
			'\n' +
			printCloseTo(receivedDiff, expectedDiff, precision, isNot);

	return {
		message,
		pass,
		actual: received,
		expected,
		name: matcherName,
	};
}

export default {
	/**
	 * 檢查實際數值是否在預期數值的 ± delta 範圍內
	 * Check if actual number is within expected number ± delta
	 */
	toBeCloseWith,
}

// 自動安裝匹配器 / Auto-install matchers
jestAutoInstallExpectExtend({
	toBeCloseWith,
})
