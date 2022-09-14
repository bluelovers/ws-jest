/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';
import { matchers } from './lib/matchers';

export { matchers }

export default matchers

jestAutoInstallExpectExtend(matchers)
