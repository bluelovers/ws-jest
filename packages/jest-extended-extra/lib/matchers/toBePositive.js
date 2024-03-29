"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBePositive = void 0;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
const matcherName = 'toBePositive';
const type = 'positive';
function toBePositive(received) {
    const pass = (0, check_basic_1.isPositive)(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
        actual: received,
        expected: type,
        name: matcherName,
    };
}
exports.toBePositive = toBePositive;
exports.default = {
    toBePositive,
};
//# sourceMappingURL=toBePositive.js.map