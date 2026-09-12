"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBePositive = toBePositive;
const check_basic_1 = require("@lazy-assert/check-basic");
const jest_util_1 = require("@lazy-assert/jest-util");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBePositive';
/** 類型名稱 / Type name */
const type = 'positive';
/**
 * 檢查值是否為正數
 * Check if value is positive
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
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
exports.default = {
    toBePositive,
};
//# sourceMappingURL=toBePositive.js.map