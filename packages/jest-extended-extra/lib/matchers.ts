

import toBeFloat from './matchers/toBeFloat'
import toBeInteger from './matchers/toBeInteger'
import toBeZero from './matchers/toBeZero'

export const matchers = Object.assign(toBeFloat, toBeInteger, toBeZero)
export default matchers

