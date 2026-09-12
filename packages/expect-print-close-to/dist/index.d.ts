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
export declare function printCloseTo(receivedDiff: number, expectedDiff: number, precision: number, isNot: boolean): string;

export {
	printCloseTo as default,
};

export {};
