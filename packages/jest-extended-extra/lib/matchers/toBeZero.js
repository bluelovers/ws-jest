"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeZero = toBeZero;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeZero';
/** 類型名稱 / Type name */
const type = 'zero';
/**
 * 檢查值是否為零
 * Check if value is zero
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
function toBeZero(received) {
    const pass = (0, check_basic_1.isZero)(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
        actual: received,
        expected: type,
        name: matcherName,
    };
}
exports.default = {
    toBeZero,
};
//# sourceMappingURL=toBeZero.js.map