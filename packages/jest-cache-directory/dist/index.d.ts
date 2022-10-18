declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JEST_CACHE_DIRECTORY?: string;
		}
	}
}
/**
 * process.env['JEST_CACHE_DIRECTORY']
 */
export declare function getJestCacheDirectoryEnvVar(): string;
/**
 * @see https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts
 */
export declare function getJestCacheDirectory(): string;

export {
	getJestCacheDirectory as default,
};

export {};
