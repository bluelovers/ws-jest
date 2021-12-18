"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeInfinity = void 0;
const msg_1 = require("../util/msg");
const check_basic_1 = require("@lazy-assert/check-basic");
const matcherName = 'toBeInfinity';
const type = 'infinity';
function toBeInfinity(received) {
    const pass = (0, check_basic_1.isInfinity)(received);
    return {
        pass,
        message: (0, msg_1.autoMessage)(pass, received, matcherName, type),
    };
}
exports.toBeInfinity = toBeInfinity;
exports.default = {
    toBeInfinity,
};
//# sourceMappingURL=toBeInfinity.js.map