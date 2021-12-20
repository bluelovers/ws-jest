function isNum(n) {
  return n === +n;
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

export { isFiniteFloat, isFiniteInt, isFloat, isInfinity, isInt, isNaN, isNegative, isNum, isPositive, isZero };
//# sourceMappingURL=index.esm.mjs.map
