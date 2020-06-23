import { matcherHint, printReceived } from 'jest-matcher-utils';
import check from 'check-types';

const passMessage = (received, matcherName: string, type: string) => () =>
	matcherHint(`.not.${matcherName}`, 'received', '') +
	'\n\n' +
	`Expected value to not be a ${type} received:\n` +
	`  ${printReceived(received)}`;

const failMessage = (received, matcherName: string, type: string) => () =>
	matcherHint(`.${matcherName}`, 'received', '') +
	'\n\n' +
	`Expected value to be a ${type} received:\n` +
	`  ${printReceived(received)}`;

export function createNewCheckTypes(matcherName: string, type: string)
{
	return function toBeFloat(this: jest.MatcherContext, received: number)
	{
		const pass = check[type](received);

		if (pass)
		{
			return {
				pass: true,
				message: passMessage(received, matcherName, type),
			};
		}

		return {
			pass: false,
			message: failMessage(received, matcherName, type),
		};
	}
}
