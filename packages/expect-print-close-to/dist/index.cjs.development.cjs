'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');

function printCloseTo(receivedDiff, expectedDiff, precision, isNot) {
  const receivedDiffString = jestMatcherUtils.stringify(receivedDiff);
  const expectedDiffString = receivedDiffString.includes('e') ? expectedDiff.toExponential(0) : 0 <= precision && precision < 20 ? expectedDiff.toFixed(precision + 1) : jestMatcherUtils.stringify(expectedDiff);
  return `Expected precision:  ${isNot ? '    ' : ''}  ${jestMatcherUtils.stringify(precision)}\n` + `Expected difference: ${isNot ? 'not ' : ''}< ${jestMatcherUtils.EXPECTED_COLOR(expectedDiffString)}\n` + `Received difference: ${isNot ? '    ' : ''}  ${jestMatcherUtils.RECEIVED_COLOR(receivedDiffString)}`;
}

exports.default = printCloseTo;
exports.printCloseTo = printCloseTo;
//# sourceMappingURL=index.cjs.development.cjs.map
