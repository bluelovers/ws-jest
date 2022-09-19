function isNum(i) {
  return "number" == typeof i && i === +i;
}

function isNaN(i) {
  return Number.isNaN(i);
}

function isInt(i) {
  return i === Math.floor(i);
}

function isFloat(i) {
  return isNum(i) && !isInt(i);
}

function isFiniteInt(i) {
  return isFinite(i) && isInt(i);
}

function isFiniteFloat(i) {
  return isFinite(i) && isFloat(i);
}

function isInfinity(i) {
  return Infinity === i || -Infinity === i;
}

function isZero(i) {
  return 0 === i || -0 === i;
}

function isPositive(i) {
  return isNum(i) && (i > 0 || Infinity === i);
}

function isNegative(i) {
  return isNum(i) && (i < 0 || -Infinity === i);
}

function isUnSafeNumString(i) {
  return "string" == typeof i && "" !== (i = i.trim()) && isFinite(+i);
}

function isUnSafeNumLike(i) {
  return isNum(i) || isUnSafeNumString(i);
}

export { isFiniteFloat, isFiniteInt, isFloat, isInfinity, isInt, isNaN, isNegative, isNum, isPositive, isUnSafeNumLike, isUnSafeNumString, isZero };
//# sourceMappingURL=index.esm.mjs.map
