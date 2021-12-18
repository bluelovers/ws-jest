"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeZero = void 0;
const msg_1 = require("../util/msg");
const check_basic_1 = require("@lazy-assert/check-basic");
const matcherName = 'toBeZero';
const type = 'zero';
function toBeZero(received) {
    const pass = (0, check_basic_1.isZero)(received);
    return {
        pass,
        message: (0, msg_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeZero = toBeZero;
exports.default = {
    toBeZero,
};
//# sourceMappingURL=toBeZero.js.map