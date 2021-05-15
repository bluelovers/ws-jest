
export function isNum(n: number): n is number
{
	return n === +n
}

export function isInt(n: number): n is number
{
	return (n === Math.floor(n))
}

export function isFloat(n: number): n is number
{
	return isNum(n) && !isInt(n);
}

export function isIntFinite(n: number): n is number
{
	return isInt(n) && isFinite(n)
}
