/**
 * Jest Preset (ES Module) - Jest 預設配置（ES 模組版本）
 *
 * 此檔案是發布模組時的必要檔案，用於支援 ESM 環境的 Jest 配置載入
 * This file is required for npm publishing, used for Jest configuration loading in ESM environments
 *
 * 發布注意事項 / Publishing Notes:
 * - 此檔案必須包含在 npm 發布中 / This file must be included in npm publish
 * - 對應的 exports 配置: "./jest-preset": { ..., "import": "./jest-preset.mjs" }
 * - 請確保 .npmignore 中有 `!jest-preset.mjs` 以保留此檔案
 * - Please ensure .npmignore has `!jest-preset.mjs` to keep this file
 *
 * 關於 jest-preset.js / About jest-preset.js:
 * - jest-preset.js 不需要實際存在 / jest-preset.js does not need to physically exist
 * - package.json exports 中已定義其映射關係至 .cjs 和 .mjs
 * - The mapping is defined in package.json exports to .cjs and .mjs
 *
 * @see https://jestjs.io/docs/configuration#preset-string
 * @see package.json exports 配置 / package.json exports configuration
 */

import { mixinJestConfig } from './dist/index.esm.mjs';

/**
 * 匯出預設的 Jest 配置物件
 * Export default Jest configuration object
 */
export default mixinJestConfig();
