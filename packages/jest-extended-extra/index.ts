import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';
import { matchers } from './lib/matchers';

export { matchers }

export default matchers

jestAutoInstallExpectExtend(matchers)
