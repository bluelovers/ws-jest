/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';
import { matchers } from './lib/matchers';

/**
 * 匯出所有擴展匹配器
 * Export all extended matchers
 */
export { matchers }

/**
 * 預設匯出所有匹配器
 * Default export of all matchers
 */
export default matchers

// 自動安裝匹配器到 Jest
// Auto-install matchers to Jest
jestAutoInstallExpectExtend(matchers)
