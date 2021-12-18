import { autoMessage } from '../util/msg';

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

	}

}

export function toBeFinite(this: jest.MatcherContext, received: number)
{
	const pass = isFinite(received);

	return {
		pass,
		message: autoMessage(pass, received, matcherName, type),
	};
}

export default {
	toBeFinite,
};
