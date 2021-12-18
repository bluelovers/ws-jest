import { matcherErrorMessage, matcherHint, EXPECTED_COLOR, printWithType, printExpected, RECEIVED_COLOR, printReceived } from 'jest-matcher-utils';
import { numberInDelta } from 'num-in-delta';
import { printCloseTo } from 'expect/build/print';
import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';
import { subAbs } from 'num-in-delta/lib/util';

function toBeCloseWith(received, expected, delta, precision = 4) {
  const matcherName = 'toBeCloseWith';
  const secondArgument = arguments.length === 3 ? 'precision' : undefined;
  const isNot = this.isNot;
  const options = {
    isNot,
    promise: this.promise,
    secondArgument,
    secondArgumentColor: arg => arg
  };

  if (typeof expected !== 'number') {
    throw new Error(matcherErrorMessage(matcherHint(matcherName, undefined, undefined, options), `${EXPECTED_COLOR('expected')} value must be a number`, printWithType('Expected', expected, printExpected)));
  }

  if (typeof received !== 'number') {
    throw new Error(matcherErrorMessage(matcherHint(matcherName, undefined, undefined, options), `${RECEIVED_COLOR('received')} value must be a number`, printWithType('Received', received, printReceived)));
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
    receivedDiff = Number(subAbs(received, expected));
    pass = numberInDelta(received, expected, delta);
  }

  const message = pass ? () => matcherHint(matcherName, undefined, undefined, options) + '\n\n' + `Expected: not ${printExpected(expected)}\n` + (receivedDiff === 0 ? '' : `Received:     ${printReceived(received)}\n` + '\n' + printCloseTo(receivedDiff, expectedDiff, precision, isNot)) : () => matcherHint(matcherName, undefined, undefined, options) + '\n\n' + `Expected: ${printExpected(expected)}\n` + `Received: ${printReceived(received)}\n` + '\n' + printCloseTo(receivedDiff, expectedDiff, precision, isNot);
  return {
    message,
    pass
  };
}
var index = {
  toBeCloseWith
};
jestAutoInstallExpectExtend({
  toBeCloseWith
});

export { index as default, toBeCloseWith };
//# sourceMappingURL=index.esm.mjs.map
