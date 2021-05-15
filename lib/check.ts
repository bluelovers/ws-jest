
export function isNum(n: number)
{
	return n === +n
}

export function isInt(n: number)
{
	return n === Math.floor(n)
}

export function isFloat(n: number)
{
	return n === +n && !isInt(n);
}
