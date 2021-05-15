"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFloat = exports.isInt = exports.isNum = void 0;
function isNum(n) {
    return n === +n;
}
exports.isNum = isNum;
function isInt(n) {
    return n === Math.floor(n);
}
exports.isInt = isInt;
function isFloat(n) {
    return n === +n && !isInt(n);
}
exports.isFloat = isFloat;
//# sourceMappingURL=check.js.map