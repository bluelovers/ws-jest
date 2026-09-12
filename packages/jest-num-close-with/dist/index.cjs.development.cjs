'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');
var numInDelta = require('num-in-delta');
var expectPrintCloseTo = require('expect-print-close-to');
var jestInstallMatcherExtends = require('jest-install-matcher-extends');
var util = require('num-in-delta/lib/util');
var jestUtil = require('@lazy-assert/jest-util');

/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
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
function toBeCloseWith(received, expected, delta, precision = 4) {
  const matcherName = 'toBeCloseWith';
  // @ts-ignore
  const isNot = this.isNot;
  // @ts-ignore
  const options = jestUtil.handleJestMatcherHintOptions(this, {
    secondArgument: arguments.length === 3 ? 'precision' : undefined
  });
  if (typeof expected !== 'number') {
    throw new Error(jestMatcherUtils.matcherErrorMessage(jestMatcherUtils.matcherHint(matcherName, undefined, undefined, options), `${jestMatcherUtils.EXPECTED_COLOR('expected')} value must be a number`, jestMatcherUtils.printWithType('Expected', expected, jestMatcherUtils.printExpected)));
  }
  if (typeof received !== 'number') {
    throw new Error(jestMatcherUtils.matcherErrorMessage(jestMatcherUtils.matcherHint(matcherName, undefined, undefined, options), `${jestMatcherUtils.RECEIVED_COLOR('received')} value must be a number`, jestMatcherUtils.printWithType('Received', received, jestMatcherUtils.printReceived)));
  }
  let pass = false;
  let expectedDiff = 0;
  let receivedDiff = 0;
  if (received === Infinity && expected === Infinity) {
    pass = true;
  } else if (received === -Infinity && expected === -Infinity) {
    pass = true;
  } else {
    expectedDiff = Math.pow(10, -precision) / 2;
    receivedDiff = Number(util.subAbs(received, expected));
    pass = numInDelta.numberInDelta(received, expected, delta);
  }
  const message = pass ? () => jestMatcherUtils.matcherHint(matcherName, undefined, undefined, options) + '\n\n' + `Expected: not ${jestMatcherUtils.printExpected(expected)}\n` + (receivedDiff === 0 ? '' : `Received:     ${jestMatcherUtils.printReceived(received)}\n` + '\n' + expectPrintCloseTo.printCloseTo(receivedDiff, expectedDiff, precision, isNot)) : () => jestMatcherUtils.matcherHint(matcherName, undefined, undefined, options) + '\n\n' + `Expected: ${jestMatcherUtils.printExpected(expected)}\n` + `Received: ${jestMatcherUtils.printReceived(received)}\n` + '\n' + expectPrintCloseTo.printCloseTo(receivedDiff, expectedDiff, precision, isNot);
  return {
    message,
    pass,
    actual: received,
    expected,
    name: matcherName
  };
}
var index = {
  toBeCloseWith
};
jestInstallMatcherExtends.jestAutoInstallExpectExtend({
  toBeCloseWith
});

exports.default = index;
exports.toBeCloseWith = toBeCloseWith;
//# sourceMappingURL=index.cjs.development.cjs.map
