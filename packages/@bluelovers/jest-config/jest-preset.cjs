/**
 * Jest Preset (CommonJS) - Jest 預設配置（CommonJS 版本）
 *
 * 此檔案是發布模組時的必要檔案，用於支援 CommonJS 環境的 Jest 配置載入
 * This file is required for npm publishing, used for Jest configuration loading in CommonJS environments
 *
 * 發布注意事項 / Publishing Notes:
 * - 此檔案必須包含在 npm 發布中 / This file must be included in npm publish
 * - 對應的 exports 配置: "./jest-preset": { "require": "./jest-preset.cjs", ... }
 * - 請確保 .npmignore 中有 `!jest-preset.cjs` 以保留此檔案
 * - Please ensure .npmignore has `!jest-preset.cjs` to keep this file
 *
 * @see https://jestjs.io/docs/configuration#preset-string
 * @see package.json exports 配置 / package.json exports configuration
 */

const { mixinJestConfig } = require('./dist/index.cjs.development.cjs');

/**
 * 匯出預設的 Jest 配置物件
 * Export default Jest configuration object
 */
module.exports = mixinJestConfig();
