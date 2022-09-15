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
			 * check actual number is expected number ± delta
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
 * check actual number is expected number ± delta
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
	const isNot = this.isNot;

	const options = handleJestMatcherHintOptions(this, {
		secondArgument: arguments.length === 3 ? 'precision' : undefined,
	});

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
		expectedDiff = Math.pow(10, -precision) / 2;
		receivedDiff = Number(subAbs(received, expected));

		pass = numberInDelta(received, expected, delta)
	}

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
	 * check actual number is expected number ± delta
	 */
	toBeCloseWith,
}

jestAutoInstallExpectExtend({
	toBeCloseWith,
})
