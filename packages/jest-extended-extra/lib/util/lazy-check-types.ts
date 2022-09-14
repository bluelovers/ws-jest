import check from 'check-types';
import { ITSKeyofByExtractType } from 'ts-type/lib/helper/record/pick-type';
import { autoMessage } from '@lazy-assert/jest-util';
import { IMatcherContext, ICustomMatcherResult } from '@lazy-assert/jest-global-types-extra';

export function createNewCheckTypes(matcherName: string, type: ITSKeyofByExtractType<typeof check, ((...argv: any[]) => any)> | string)
{
	return function toBeCheckTypes(this: IMatcherContext, received: number): ICustomMatcherResult
	{
		// @ts-ignore
		const pass: boolean = check[type](received);

		return {
			pass,
			message: autoMessage(pass, received, matcherName, type),
			actual: received,
			expected: type,
			name: matcherName,
		};
	}
}
