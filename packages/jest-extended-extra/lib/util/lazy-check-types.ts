import check from 'check-types';
import { failMessage, passMessage, autoMessage } from './msg';

export function createNewCheckTypes(matcherName: string, type: string)
{
	return function toBeCheckTypes(this: jest.MatcherContext, received: number)
	{
		const pass: boolean = check[type](received);

		return {
			pass,
			message: autoMessage(pass, received, matcherName, type),
		};
	}
}
