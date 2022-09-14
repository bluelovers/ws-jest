"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeNegative = void 0;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
const matcherName = 'toBeNegative';
const type = 'negative';
function toBeNegative(received) {
    const pass = (0, check_basic_1.isNegative)(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeNegative = toBeNegative;
exports.default = {
    toBeNegative,
};
//# sourceMappingURL=toBeNegative.js.map