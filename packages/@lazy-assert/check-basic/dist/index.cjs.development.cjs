'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 檢查值是否為數字（包含 NaN 檢查）
 * Check if value is a number (includes NaN check)
 *
 * 使用 `+n` 進行嚴格相等比對，可過濾掉 NaN（因為 NaN !== NaN）
 * Uses strict equality with `+n` to filter out NaN (since NaN !== NaN)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有效數字 / Whether it's a valid number
 */
function isNum(n) {
  return typeof n === 'number' && n === +n;
}
/**
 * 檢查值是否為 NaN（Not a Number）
 * Check if value is NaN (Not a Number)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為 NaN / Whether it's NaN
 */
function isNaN(n) {
  return Number.isNaN(n);
}
/**
 * 檢查值是否為整數
 * Check if value is an integer
 *
 * 利用 Math.floor() 向下取整後與原值比較，若相等則為整數
 * Uses Math.floor() to compare with original value, if equal then it's an integer
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為整數 / Whether it's an integer
 */
function isInt(n) {
  return n === Math.floor(n);
}
/**
 * 檢查值是否為浮點數（非整數的數字）
 * Check if value is a float (non-integer number)
 *
 * 先確認是數字，再確認不是整數
 * First confirms it's a number, then confirms it's not an integer
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為浮點數 / Whether it's a float
 */
function isFloat(n) {
  return isNum(n) && !isInt(n);
}
/**
 * 檢查值是否為有限數字（非 Infinity）
 * Check if value is a finite number (not Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限數字 / Whether it's a finite number
 */
function isFiniteNum(n) {
  return isNum(n) && isFinite(n);
}
/**
 * 檢查值是否為有限整數
 * Check if value is a finite integer
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限整數 / Whether it's a finite integer
 */
function isFiniteInt(n) {
  return isFiniteNum(n) && isInt(n);
}
/**
 * 檢查值是否為有限浮點數
 * Check if value is a finite float
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限浮點數 / Whether it's a finite float
 */
function isFiniteFloat(n) {
  return isFiniteNum(n) && isFloat(n);
}
/**
 * 檢查值是否為無限大（Infinity 或 -Infinity）
 * Check if value is infinity (Infinity or -Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為無限大 / Whether it's infinity
 */
function isInfinity(n) {
  return n === Infinity || n === -Infinity;
}
/**
 * 檢查值是否為零（0 或 -0）
 * Check if value is zero (0 or -0)
 *
 * 注意：JavaScript 中有 +0 和 -0 兩種零值
 * Note: JavaScript has both +0 and -0
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為零 / Whether it's zero
 */
function isZero(n) {
  return n === 0 || n === -0;
}
/**
 * 檢查值是否為正數（大於 0 或 Infinity）
 * Check if value is positive (greater than 0 or Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為正數 / Whether it's positive
 */
function isPositive(n) {
  return isNum(n) && (n > 0 || n === Infinity);
}
/**
 * 檢查值是否為負數（小於 0 或 -Infinity）
 * Check if value is negative (less than 0 or -Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為負數 / Whether it's negative
 */
function isNegative(n) {
  return isNum(n) && (n < 0 || n === -Infinity);
}
/**
 * 檢查字串是否可轉換為有效數字
 * Check if string can be converted to a valid number
 *
 * 先修剪空白，再嘗試轉換為數字並檢查是否為有限值
 * Trims whitespace, then attempts conversion to number and checks if finite
 *
 * @see https://github.com/jonschlinkert/is-number/blob/master/index.js
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為可轉換的數字字串 / Whether it's a convertible numeric string
 */
function isUnSafeNumString(n) {
  if (typeof n === 'string') {
    n = n.trim();
    if (n !== '') {
      return isFinite(+n);
    }
  }
  return false;
}
/**
 * 檢查值是否為類數字型別（數字或可轉換為數字的字串）
 * Check if value is number-like (number or string convertible to number)
 *
 * 組合檢查有限數字和可轉換的數字字串
 * Combines checks for finite numbers and convertible numeric strings
 *
 * @see https://github.com/jonschlinkert/is-number/blob/master/index.js
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為類數字型別 / Whether it's number-like
 */
function isUnSafeNumLike(n) {
  return isFiniteNum(n) || isUnSafeNumString(n);
}

exports.isFiniteFloat = isFiniteFloat;
exports.isFiniteInt = isFiniteInt;
exports.isFiniteNum = isFiniteNum;
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
