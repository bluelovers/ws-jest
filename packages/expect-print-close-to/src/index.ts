import {
	EXPECTED_COLOR,
	RECEIVED_COLOR,
	stringify,
} from 'jest-matcher-utils';

/**
 * @see https://github.com/facebook/jest/blob/main/packages/expect/src/print.ts#L62
 */
export function printCloseTo(
	receivedDiff: number,
	expectedDiff: number,
	precision: number,
	isNot: boolean,
): string
{
	const receivedDiffString = stringify(receivedDiff);
	const expectedDiffString = receivedDiffString.includes('e')
		? // toExponential arg is number of digits after the decimal point.
		expectedDiff.toExponential(0)
		: 0 <= precision && precision < 20
			? // toFixed arg is number of digits after the decimal point.
				// It may be a value between 0 and 20 inclusive.
				// Implementations may optionally support a larger range of values.
			expectedDiff.toFixed(precision + 1)
			: stringify(expectedDiff);

	return (
		`Expected precision:  ${isNot ? '    ' : ''}  ${stringify(precision)}\n` +
		`Expected difference: ${isNot ? 'not ' : ''}< ${EXPECTED_COLOR(
			expectedDiffString,
		)}\n` +
		`Received difference: ${isNot ? '    ' : ''}  ${RECEIVED_COLOR(
			receivedDiffString,
		)}`
	);
}

export default printCloseTo
