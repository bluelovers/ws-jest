"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoMessage = exports.failMessage = exports.passMessage = void 0;
const jest_matcher_utils_1 = require("jest-matcher-utils");
function passMessage(received, matcherName, type) {
    return () => jest_matcher_utils_1.matcherHint(`.not.${matcherName}`, 'received', '') +
        '\n\n' +
        `Expected value to not be a ${type} received:\n` +
        `  ${jest_matcher_utils_1.printReceived(received)}`;
}
exports.passMessage = passMessage;
function failMessage(received, matcherName, type) {
    return () => jest_matcher_utils_1.matcherHint(`.${matcherName}`, 'received', '') +
        '\n\n' +
        `Expected value to be a ${type} received:\n` +
        `  ${jest_matcher_utils_1.printReceived(received)}`;
}
exports.failMessage = failMessage;
function autoMessage(pass, received, matcherName, type) {
    return pass ? passMessage(received, matcherName, type) : failMessage(received, matcherName, type);
}
exports.autoMessage = autoMessage;
//# sourceMappingURL=msg.js.map