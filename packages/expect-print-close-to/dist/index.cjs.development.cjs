'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');

/**
 * @see https://github.com/facebook/jest/blob/main/packages/expect/src/print.ts#L62
 */
function printCloseTo(receivedDiff, expectedDiff, precision, isNot) {
  const receivedDiffString = jestMatcherUtils.stringify(receivedDiff);
  const expectedDiffString = receivedDiffString.includes('e') ?
  // toExponential arg is number of digits after the decimal point.
  expectedDiff.toExponential(0) : 0 <= precision && precision < 20 ?
  // toFixed arg is number of digits after the decimal point.
  // It may be a value between 0 and 20 inclusive.
  // Implementations may optionally support a larger range of values.
  expectedDiff.toFixed(precision + 1) : jestMatcherUtils.stringify(expectedDiff);
  return `Expected precision:  ${isNot ? '    ' : ''}  ${jestMatcherUtils.stringify(precision)}\n` + `Expected difference: ${isNot ? 'not ' : ''}< ${jestMatcherUtils.EXPECTED_COLOR(expectedDiffString)}\n` + `Received difference: ${isNot ? '    ' : ''}  ${jestMatcherUtils.RECEIVED_COLOR(receivedDiffString)}`;
}

exports.default = printCloseTo;
exports.printCloseTo = printCloseTo;
//# sourceMappingURL=index.cjs.development.cjs.map
