import { isPositive } from '@lazy-assert/check-basic';
import { autoMessage } from '@lazy-assert/jest-util';

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

export function toBePositive(this: jest.MatcherContext, received: number)
{
	const pass = isPositive(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBePositive,
};
