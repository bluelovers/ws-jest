import {
	EXPECTED_COLOR,
	RECEIVED_COLOR,
	stringify,
} from 'jest-matcher-utils';

/**
 * 格式化輸出 toBeCloseTo 的比較結果
 * Format output for toBeCloseTo comparison result
 *
 * 參考 Jest 官方實現，用於顯示預期差異和實際差異
 * References Jest official implementation for displaying expected and actual differences
 *
 * @see https://github.com/facebook/jest/blob/main/packages/expect/src/print.ts#L62
 *
 * @param receivedDiff - 實際差異值 / Actual difference value
 * @param expectedDiff - 預期差異值 / Expected difference value
 * @param precision - 精度位數 / Precision digits
 * @param isNot - 是否為 .not 斷言 / Whether it's a .not assertion
 * @returns 格式化的訊息字串 / Formatted message string
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
		? // 科學記號格式：使用 toExponential，參數為小數點後位數
		// Scientific notation: use toExponential, arg is digits after decimal
		expectedDiff.toExponential(0)
		: 0 <= precision && precision < 20
			? // toFixed 參數為小數點後位數，範圍為 0-20
			// toFixed arg is digits after decimal, range 0-20
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
