declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /** Jest 快取目錄環境變數 / Jest cache directory environment variable */
            JEST_CACHE_DIRECTORY?: string;
        }
    }
}
/**
 * 取得 Jest 快取目錄環境變數
 * Get Jest cache directory environment variable
 *
 * `process.env['JEST_CACHE_DIRECTORY']`
 *
 * @returns 環境變數值 / Environment variable value
 */
export declare function getJestCacheDirectoryEnvVar(): string;
/**
 * 取得 Jest 快取目錄路徑
 * Get Jest cache directory path
 *
 * 優先使用環境變數 JEST_CACHE_DIRECTORY，否則使用系統暫存目錄下的 jest 資料夾
 * Prioritizes JEST_CACHE_DIRECTORY environment variable, falls back to jest folder in system temp directory
 *
 * 支援多使用者環境，會在路徑後附加使用者 ID 以避免權限衝突
 * Supports multi-user environments by appending UID to path to avoid permission conflicts
 *
 * @see https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts
 *
 * @returns 快取目錄路徑 / Cache directory path
 */
export declare function getJestCacheDirectory(): string;
export default getJestCacheDirectory;
