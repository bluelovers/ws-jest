"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntFinite = exports.isFloat = exports.isInt = exports.isNum = void 0;
function isNum(n) {
    return n === +n;
}
exports.isNum = isNum;
function isInt(n) {
    return (n === Math.floor(n));
}
exports.isInt = isInt;
function isFloat(n) {
    return isNum(n) && !isInt(n);
}
exports.isFloat = isFloat;
function isIntFinite(n) {
    return isInt(n) && isFinite(n);
}
exports.isIntFinite = isIntFinite;
//# sourceMappingURL=check.js.map