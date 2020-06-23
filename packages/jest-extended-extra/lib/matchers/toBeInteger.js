"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeInteger = void 0;
const lazy_check_types_1 = require("../util/lazy-check-types");
const matcherName = 'toBeInteger';
const type = 'integer';
exports.toBeInteger = lazy_check_types_1.createNewCheckTypes(matcherName, type);
exports.default = {
    toBeInteger: exports.toBeInteger,
};
//# sourceMappingURL=toBeInteger.js.map