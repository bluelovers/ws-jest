import { createNewCheckTypes } from '../util/lazy-check-types';

const matcherName = 'toBeZero' as const;
const type = 'zero' as const

declare global
{

	namespace jest
	{

		interface Matchers<R>
		{
			[matcherName](expected: number): R;
		}

	}

}

export const toBeZero = createNewCheckTypes(matcherName, type)

export default {
	toBeZero,
};
