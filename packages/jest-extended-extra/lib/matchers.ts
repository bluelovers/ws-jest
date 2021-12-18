

import toBeFinite from './matchers/toBeFinite'
import toBeFloat from './matchers/toBeFloat'
import toBeInfinity from './matchers/toBeInfinity'
import toBeInteger from './matchers/toBeInteger'
import toBeZero from './matchers/toBeZero'

export const matchers = {
	...toBeFinite,
	...toBeFloat,
	...toBeInfinity,
	...toBeInteger,
	...toBeZero
} as const
export default matchers

