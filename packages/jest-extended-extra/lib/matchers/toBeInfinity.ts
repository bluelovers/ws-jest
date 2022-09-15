import { isInfinity } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

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

export function toBeInfinity(this: jest.MatcherContext, received: number)
{
	const pass = isInfinity(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeInfinity,
};
