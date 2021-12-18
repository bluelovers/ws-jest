import { autoMessage } from '../util/msg';
import { isZero } from '@lazy-assert/check-basic';

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
	const pass = isZero(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBeZero,
};
