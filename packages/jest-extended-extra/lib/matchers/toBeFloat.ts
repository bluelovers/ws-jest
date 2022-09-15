import { createNewCheckTypes } from '../util/lazy-check-types';

const matcherName = 'toBeFloat' as const;
const type = 'float' as const

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

export const toBeFloat = createNewCheckTypes(matcherName, type)

export default {
	toBeFloat,
};
