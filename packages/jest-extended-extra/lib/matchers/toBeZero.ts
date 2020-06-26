import { createNewCheckTypes } from '../util/lazy-check-types';
import check from 'check-types';
import { autoMessage } from '../util/msg';

const matcherName = 'toBeZero' as const;
const type = 'zero' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			[matcherName](): R;
		}

	}

}

export function toBeZero(this: jest.MatcherContext, received: number)
{
	const pass = received === 0 || received === -0;

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBeZero,
};
