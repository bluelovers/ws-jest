"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBePositive = void 0;
const msg_1 = require("../util/msg");
const check_basic_1 = require("@lazy-assert/check-basic");
const matcherName = 'toBePositive';
const type = 'positive';
function toBePositive(received) {
    const pass = (0, check_basic_1.isPositive)(received);
    return {
        pass,
        message: (0, msg_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBePositive = toBePositive;
exports.default = {
    toBePositive,
};
//# sourceMappingURL=toBePositive.js.map