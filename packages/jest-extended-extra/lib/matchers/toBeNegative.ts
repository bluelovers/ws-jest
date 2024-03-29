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

declare module 'expect'
{
	interface Matchers<R extends void | Promise<void>>
	{
		[matcherName](): R;
	}
}

export function toBeNegative(this: jest.MatcherContext, received: number)
{
	const pass = isNegative(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeNegative,
};
