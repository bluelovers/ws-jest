
export function isNum(n: number)
{
	return n === +n
}

export function isInt(n: number)
{
	return n === (n | 0)
}

export function isFloat(n: number)
{
	return n === +n && n !== (n | 0);
}
