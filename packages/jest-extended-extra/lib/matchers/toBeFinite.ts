import { autoMessage } from '@lazy-assert/jest-util';

const matcherName = 'toBeFinite' as const;
const type = 'finite' as const

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

export function toBeFinite(this: jest.MatcherContext, received: number)
{
	const pass = isFinite(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
		actual: received,
		expected: type,
		name: matcherName,
	};
}

export default {
	toBeFinite,
};
