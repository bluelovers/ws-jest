import { isZero } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

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

		interface Expect
		{
			[matcherName](): void;
		}

	}

}

export function toBeZero(this: jest.MatcherContext, received: number)
{
	const pass = isZero(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeZero,
};
