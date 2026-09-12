"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeFloat = void 0;
const lazy_check_types_1 = require("../util/lazy-check-types");
/** 匹配器名稱 / Matcher name */
const matcherName = 'toBeFloat';
/** 類型名稱 / Type name */
const type = 'float';
/**
 * 檢查值是否為浮點數
 * Check if value is a float
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
exports.toBeFloat = (0, lazy_check_types_1.createNewCheckTypes)(matcherName, type);
exports.default = {
    toBeFloat: exports.toBeFloat,
};
//# sourceMappingURL=toBeFloat.js.map