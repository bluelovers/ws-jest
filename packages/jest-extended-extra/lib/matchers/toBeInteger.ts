import { createNewCheckTypes } from '../util/lazy-check-types';

const matcherName = 'toBeInteger' as const;
const type = 'integer' as const;

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

export const toBeInteger = createNewCheckTypes(matcherName, type)

export default {
	toBeInteger,
};
