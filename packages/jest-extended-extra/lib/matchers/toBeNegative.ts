import { autoMessage } from '../util/msg';
import { isNegative } from '@lazy-assert/check-basic';

const matcherName = 'toBeNegative' as const;
const type = 'negative' as const

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

export function toBeNegative(this: jest.MatcherContext, received: number)
{
	const pass = isNegative(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBeNegative,
};
