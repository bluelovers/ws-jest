"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeZero = void 0;
const lazy_check_types_1 = require("../util/lazy-check-types");
const matcherName = 'toBeZero';
const type = 'zero';
exports.toBeZero = lazy_check_types_1.createNewCheckTypes(matcherName, type);
exports.default = {
    toBeZero: exports.toBeZero,
};
//# sourceMappingURL=toBeZero.js.map