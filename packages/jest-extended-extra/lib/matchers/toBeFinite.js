"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeFinite = toBeFinite;
const jest_util_1 = require("@lazy-assert/jest-util");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeFinite';
/** 類型名稱 / Type name */
const type = 'finite';
/**
 * 檢查值是否為有限數字
 * Check if value is finite
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
function toBeFinite(received) {
    const pass = isFinite(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
        actual: received,
        expected: type,
        name: matcherName,
    };
}
exports.default = {
    toBeFinite,
};
//# sourceMappingURL=toBeFinite.js.map