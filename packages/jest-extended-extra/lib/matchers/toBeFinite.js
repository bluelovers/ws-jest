"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeFinite = void 0;
const jest_util_1 = require("@lazy-assert/jest-util");
const matcherName = 'toBeFinite';
const type = 'finite';
function toBeFinite(received) {
    const pass = isFinite(received);
    return {
        pass,
        message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeFinite = toBeFinite;
exports.default = {
    toBeFinite,
};
//# sourceMappingURL=toBeFinite.js.map