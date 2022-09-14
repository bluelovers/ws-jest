import { diff, DiffOptions } from 'jest-matcher-utils';
import { chkcrlf, crlf, EnumLineBreak } from 'crlf-normalize';

export const enum EnumDiffMessage
{
	LINE_SEPARATORS = `Contents have differences only in line separators`,
}

export function _stringDiffCore(received: string, expected: string, options?: DiffOptions)
{
	const difference: string[] = [''];

	if (crlf(expected) === crlf(received))
	{
		difference.push(EnumDiffMessage.LINE_SEPARATORS);
		difference.push(diff(chkcrlf(expected), chkcrlf(received)));
	}
	else
	{
		difference.push(diff(expected, received, options));
	}

	return difference
}

export function _stringDiff(received: string, expected: string, options?: DiffOptions)
{
	return _stringDiffCore(received, expected, options).join(EnumLineBreak.LF + EnumLineBreak.LF)
}
