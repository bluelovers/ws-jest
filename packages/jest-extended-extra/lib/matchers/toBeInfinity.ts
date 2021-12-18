import { autoMessage } from '../util/msg';
import { isInfinity } from '@lazy-assert/check-basic';

const matcherName = 'toBeInfinity' as const;
const type = 'infinity' as const

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

export function toBeInfinity(this: jest.MatcherContext, received: number)
{
	const pass = isInfinity(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBeInfinity,
};
