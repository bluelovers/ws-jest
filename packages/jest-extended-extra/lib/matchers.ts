/**
 * Jest 擴展匹配器集中匯出
 * Jest extended matchers central export
 */

import toBeFinite from './matchers/toBeFinite'
import toBeFloat from './matchers/toBeFloat'
import toBeInfinity from './matchers/toBeInfinity'
import toBeInteger from './matchers/toBeInteger'
import toBeNegative from './matchers/toBeNegative'
import toBePositive from './matchers/toBePositive'
import toBeZero from './matchers/toBeZero'

/**
 * 所有擴展匹配器的集合
 * Collection of all extended matchers
 */
export const matchers = {
	...toBeFinite,
	...toBeFloat,
	...toBeInfinity,
	...toBeInteger,
	...toBeNegative,
	...toBePositive,
	...toBeZero,
} as const

export default matchers
