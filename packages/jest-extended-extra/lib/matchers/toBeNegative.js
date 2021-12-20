"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeNegative = void 0;
const msg_1 = require("../util/msg");
const check_basic_1 = require("@lazy-assert/check-basic");
const matcherName = 'toBeNegative';
const type = 'negative';
function toBeNegative(received) {
    const pass = (0, check_basic_1.isNegative)(received);
    return {
        pass,
        message: (0, msg_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeNegative = toBeNegative;
exports.default = {
    toBeNegative,
};
//# sourceMappingURL=toBeNegative.js.map