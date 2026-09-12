"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCheckTypes = createNewCheckTypes;
const check_types_1 = __importDefault(require("check-types"));
const jest_util_1 = require("@lazy-assert/jest-util");
/**
 * 建立新的類型檢查匹配器
 * Create new type check matcher
 *
 * 使用 check-types 函式庫來驗證數值類型
 * Uses check-types library to validate number type
 *
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱（來自 check-types）/ Type name (from check-types)
 * @returns 匹配器函數 / Matcher function
 */
function createNewCheckTypes(matcherName, type) {
    return function toBeCheckTypes(received) {
        // @ts-ignore
        const pass = check_types_1.default[type](received);
        return {
            pass,
            message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
            actual: received,
            expected: type,
            name: matcherName,
        };
    };
}
//# sourceMappingURL=lazy-check-types.js.map