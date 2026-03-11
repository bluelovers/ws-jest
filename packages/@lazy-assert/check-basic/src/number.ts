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
export function isNum(n: unknown): n is number
{
	return typeof n === 'number' && n === +n
}

/**
 * 檢查值是否為 NaN（Not a Number）
 * Check if value is NaN (Not a Number)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為 NaN / Whether it's NaN
 */
export function isNaN(n: unknown): n is typeof NaN
{
	return Number.isNaN(n)
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
export function isInt(n: unknown): n is number
{
	return (n === Math.floor(n as any))
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
export function isFloat(n: unknown): n is number
{
	return isNum(n) && !isInt(n);
}

/**
 * 檢查值是否為有限數字（非 Infinity）
 * Check if value is a finite number (not Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限數字 / Whether it's a finite number
 */
export function isFiniteNum(n: unknown): n is number
{
	return isNum(n) && isFinite(n);
}

/**
 * 檢查值是否為有限整數
 * Check if value is a finite integer
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限整數 / Whether it's a finite integer
 */
export function isFiniteInt(n: unknown): n is number
{
	return isFiniteNum(n) && isInt(n)
}

/**
 * 檢查值是否為有限浮點數
 * Check if value is a finite float
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為有限浮點數 / Whether it's a finite float
 */
export function isFiniteFloat(n: unknown): n is number
{
	return isFiniteNum(n) && isFloat(n)
}

/**
 * 檢查值是否為無限大（Infinity 或 -Infinity）
 * Check if value is infinity (Infinity or -Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為無限大 / Whether it's infinity
 */
export function isInfinity(n: unknown): n is typeof Infinity
{
	return (n === Infinity || n === -Infinity)
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
export function isZero(n: unknown): n is 0
{
	return n === 0 || n === -0
}

/**
 * 檢查值是否為正數（大於 0 或 Infinity）
 * Check if value is positive (greater than 0 or Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為正數 / Whether it's positive
 */
export function isPositive(n: unknown): n is number
{
	return isNum(n) && (n > 0 || n === Infinity)
}

/**
 * 檢查值是否為負數（小於 0 或 -Infinity）
 * Check if value is negative (less than 0 or -Infinity)
 *
 * @param n - 要檢查的值 / Value to check
 * @returns 是否為負數 / Whether it's negative
 */
export function isNegative(n: unknown): n is number
{
	return isNum(n) && (n < 0 || n === -Infinity)
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
export function isUnSafeNumString(n: unknown): n is string
{
	if (typeof n === 'string')
	{
		n = n.trim();
		if (n !== '')
		{
			return isFinite(+n)
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
export function isUnSafeNumLike(n: unknown): n is number | string
{
	return isFiniteNum(n) || isUnSafeNumString(n)
}
