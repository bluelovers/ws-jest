"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeZero = void 0;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
const matcherName = 'toBeZero';
const type = 'zero';
function toBeZero(received) {
    const pass = (0, check_basic_1.isZero)(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeZero = toBeZero;
exports.default = {
    toBeZero,
};
//# sourceMappingURL=toBeZero.js.map