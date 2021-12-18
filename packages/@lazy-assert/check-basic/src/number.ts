
export function isNum(n: unknown): n is number
{
	return n === +n
}

export function isNaN(n: unknown): n is typeof NaN
{
	return Number.isNaN(n)
}

export function isInt(n: unknown): n is number
{
	return (n === Math.floor(n as any))
}

export function isFloat(n: unknown): n is number
{
	return isNum(n) && !isInt(n);
}

export function isFiniteInt(n: unknown): n is number
{
	return isFinite(n as any) && isInt(n)
}

export function isFiniteFloat(n: unknown): n is number
{
	return isFinite(n as any) && isFloat(n)
}

export function isInfinity(n: unknown): n is typeof Infinity
{
	return (n === Infinity || n === -Infinity)
}
