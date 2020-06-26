"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeZero = void 0;
const msg_1 = require("../util/msg");
const matcherName = 'toBeZero';
const type = 'zero';
function toBeZero(received) {
    const pass = received === 0 || received === -0;
    return {
        pass,
        message: msg_1.autoMessage(pass, received, matcherName, type),
    };
}
exports.toBeZero = toBeZero;
exports.default = {
    toBeZero,
};
//# sourceMappingURL=toBeZero.js.map