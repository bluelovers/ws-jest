'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isNum(n) {
  return typeof n === 'number' && n === +n;
}
function isNaN(n) {
  return Number.isNaN(n);
}
function isInt(n) {
  return n === Math.floor(n);
}
function isFloat(n) {
  return isNum(n) && !isInt(n);
}
function isFiniteInt(n) {
  return isFinite(n) && isInt(n);
}
function isFiniteFloat(n) {
  return isFinite(n) && isFloat(n);
}
function isInfinity(n) {
  return n === Infinity || n === -Infinity;
}
function isZero(n) {
  return n === 0 || n === -0;
}
function isPositive(n) {
  return isNum(n) && (n > 0 || n === Infinity);
}
function isNegative(n) {
  return isNum(n) && (n < 0 || n === -Infinity);
}
function isUnSafeNumString(n) {
  if (typeof n === 'string') {
    n = n.trim();

    if (n !== '') {
      return isFinite(+n);
    }
  }

  return false;
}
function isUnSafeNumLike(n) {
  return isNum(n) || isUnSafeNumString(n);
}

exports.isFiniteFloat = isFiniteFloat;
exports.isFiniteInt = isFiniteInt;
exports.isFloat = isFloat;
exports.isInfinity = isInfinity;
exports.isInt = isInt;
exports.isNaN = isNaN;
exports.isNegative = isNegative;
exports.isNum = isNum;
exports.isPositive = isPositive;
exports.isUnSafeNumLike = isUnSafeNumLike;
exports.isUnSafeNumString = isUnSafeNumString;
exports.isZero = isZero;
//# sourceMappingURL=index.cjs.development.cjs.map
