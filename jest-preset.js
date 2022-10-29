const { mixinJestConfig } = require('@bluelovers/jest-config');
const { defaults } = require('jest-config');

/**
 * // @type { import('@jest/types').Config.InitialOptions }
 * // @type { import('ts-jest').InitialOptionsTsJest }
 * @type { import('ts-jest').JestConfigWithTsJest }
 */
const jestConfig = mixinJestConfig({}, true, {
	file: __filename,
});

module.exports = jestConfig;
