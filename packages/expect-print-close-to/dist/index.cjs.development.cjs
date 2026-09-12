'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');

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
function printCloseTo(receivedDiff, expectedDiff, precision, isNot) {
  const receivedDiffString = jestMatcherUtils.stringify(receivedDiff);
  const expectedDiffString = receivedDiffString.includes('e') ? expectedDiff.toExponential(0) : 0 <= precision && precision < 20 ? expectedDiff.toFixed(precision + 1) : jestMatcherUtils.stringify(expectedDiff);
  return `Expected precision:  ${isNot ? '    ' : ''}  ${jestMatcherUtils.stringify(precision)}\n` + `Expected difference: ${isNot ? 'not ' : ''}< ${jestMatcherUtils.EXPECTED_COLOR(expectedDiffString)}\n` + `Received difference: ${isNot ? '    ' : ''}  ${jestMatcherUtils.RECEIVED_COLOR(receivedDiffString)}`;
}

exports.default = printCloseTo;
exports.printCloseTo = printCloseTo;
//# sourceMappingURL=index.cjs.development.cjs.map
