"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeCloseWith = void 0;
const jest_matcher_utils_1 = require("jest-matcher-utils");
const num_in_delta_1 = __importDefault(require("num-in-delta"));
const print_1 = require("expect/build/print");
const jest_install_matcher_extends_1 = __importDefault(require("jest-install-matcher-extends"));
const util_1 = require("num-in-delta/lib/util");
/**
 * check actual number is expected number ± delta
 */
function toBeCloseWith(received, expected, delta, precision = 4) {
    const matcherName = 'toBeCloseWith';
    const secondArgument = arguments.length === 3 ? 'precision' : undefined;
    const isNot = this.isNot;
    const options = {
        isNot,
        promise: this.promise,
        secondArgument,
        secondArgumentColor: (arg) => arg,
    };
    if (typeof expected !== 'number') {
        throw new Error((0, jest_matcher_utils_1.matcherErrorMessage)((0, jest_matcher_utils_1.matcherHint)(matcherName, undefined, undefined, options), `${(0, jest_matcher_utils_1.EXPECTED_COLOR)('expected')} value must be a number`, (0, jest_matcher_utils_1.printWithType)('Expected', expected, jest_matcher_utils_1.printExpected)));
    }
    if (typeof received !== 'number') {
        throw new Error((0, jest_matcher_utils_1.matcherErrorMessage)((0, jest_matcher_utils_1.matcherHint)(matcherName, undefined, undefined, options), `${(0, jest_matcher_utils_1.RECEIVED_COLOR)('received')} value must be a number`, (0, jest_matcher_utils_1.printWithType)('Received', received, jest_matcher_utils_1.printReceived)));
    }
    let pass = false;
    let expectedDiff = 0;
    let receivedDiff = 0;
    if (received === Infinity && expected === Infinity) {
        pass = true; // Infinity - Infinity is NaN
    }
    else if (received === -Infinity && expected === -Infinity) {
        pass = true; // -Infinity - -Infinity is NaN
    }
    else {
        expectedDiff = Math.pow(10, -precision) / 2;
        receivedDiff = Number((0, util_1.subAbs)(received, expected));
        pass = (0, num_in_delta_1.default)(received, expected, delta);
    }
    const message = pass
        ? () => (0, jest_matcher_utils_1.matcherHint)(matcherName, undefined, undefined, options) +
            '\n\n' +
            `Expected: not ${(0, jest_matcher_utils_1.printExpected)(expected)}\n` +
            (receivedDiff === 0
                ? ''
                : `Received:     ${(0, jest_matcher_utils_1.printReceived)(received)}\n` +
                    '\n' +
                    (0, print_1.printCloseTo)(receivedDiff, expectedDiff, precision, isNot))
        : () => (0, jest_matcher_utils_1.matcherHint)(matcherName, undefined, undefined, options) +
            '\n\n' +
            `Expected: ${(0, jest_matcher_utils_1.printExpected)(expected)}\n` +
            `Received: ${(0, jest_matcher_utils_1.printReceived)(received)}\n` +
            '\n' +
            (0, print_1.printCloseTo)(receivedDiff, expectedDiff, precision, isNot);
    return { message, pass };
}
exports.toBeCloseWith = toBeCloseWith;
exports.default = {
    /**
     * check actual number is expected number ± delta
     */
    toBeCloseWith,
};
(0, jest_install_matcher_extends_1.default)({
    toBeCloseWith,
});
//# sourceMappingURL=index.js.map