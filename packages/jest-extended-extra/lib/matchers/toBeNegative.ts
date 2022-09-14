import { isNegative } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

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

		interface Expect
		{
			[matcherName](): void;
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
