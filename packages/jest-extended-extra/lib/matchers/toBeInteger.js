"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeInteger = void 0;
const lazy_check_types_1 = require("../util/lazy-check-types");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeInteger';
/** 類型名稱 / Type name */
const type = 'integer';
/**
 * 檢查值是否為整數
 * Check if value is an integer
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
exports.toBeInteger = (0, lazy_check_types_1.createNewCheckTypes)(matcherName, type);
exports.default = {
    toBeInteger: exports.toBeInteger,
};
//# sourceMappingURL=toBeInteger.js.map