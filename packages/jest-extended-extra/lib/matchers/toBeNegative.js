"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeNegative = toBeNegative;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeNegative';
/** 類型名稱 / Type name */
const type = 'negative';
/**
 * 檢查值是否為負數
 * Check if value is negative
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
function toBeNegative(received) {
    const pass = (0, check_basic_1.isNegative)(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
        actual: received,
        expected: type,
        name: matcherName,
    };
}
exports.default = {
    toBeNegative,
};
//# sourceMappingURL=toBeNegative.js.map