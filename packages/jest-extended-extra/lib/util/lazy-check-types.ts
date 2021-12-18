import check from 'check-types';
import { failMessage, passMessage, autoMessage } from './msg';
import { ITSKeyofByExtractType } from 'ts-type/lib/helper/record/pick-type';

export function createNewCheckTypes(matcherName: string, type: ITSKeyofByExtractType<typeof check, ((...argv: any[]) => any)> | string)
{
	return function toBeCheckTypes(this: jest.MatcherContext, received: number)
	{
		// @ts-ignore
		const pass: boolean = check[type](received);

		return {
			pass,
			message: autoMessage(pass, received, matcherName, type),
		};
	}
}
