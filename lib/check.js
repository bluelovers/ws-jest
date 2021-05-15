"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFloat = exports.isInt = exports.isNum = void 0;
function isNum(n) {
    return n === +n;
}
exports.isNum = isNum;
function isInt(n) {
    return n === (n | 0);
}
exports.isInt = isInt;
function isFloat(n) {
    return n === +n && n !== (n | 0);
}
exports.isFloat = isFloat;
//# sourceMappingURL=check.js.map