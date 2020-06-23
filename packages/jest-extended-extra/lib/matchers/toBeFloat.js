"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeFloat = void 0;
const lazy_check_types_1 = require("../util/lazy-check-types");
const matcherName = 'toBeFloat';
const type = 'float';
exports.toBeFloat = lazy_check_types_1.createNewCheckTypes(matcherName, type);
exports.default = {
    toBeFloat: exports.toBeFloat,
};
//# sourceMappingURL=toBeFloat.js.map