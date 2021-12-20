import { autoMessage } from '../util/msg';
import { isPositive } from '@lazy-assert/check-basic';

const matcherName = 'toBePositive' as const;
const type = 'positive' as const

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

export function toBePositive(this: jest.MatcherContext, received: number)
{
	const pass = isPositive(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBePositive,
};
