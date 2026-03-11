# jest-cache-directory

取得 Jest 快取目錄路徑，支援從環境變數 `JEST_CACHE_DIRECTORY` 或系統暫存目錄取得。

Get Jest cache directory path from environment variable `JEST_CACHE_DIRECTORY` or system temp directory.

## 特色 (Features)

- 支援環境變數設定 / Supports environment variable configuration
- 自動處理多使用者環境 / Auto-handles multi-user environments
- 使用真實路徑解析 / Uses real path resolution

## 安裝 (Installation)

```bash
npm install jest-cache-directory
# or
yarn add jest-cache-directory
```

## 使用方式 (Usage)

```typescript
import { getJestCacheDirectory, getJestCacheDirectoryEnvVar } from 'jest-cache-directory';

// 取得快取目錄 / Get cache directory
const cacheDir = getJestCacheDirectory();
console.log(cacheDir); // /tmp/jest 或 /tmp/jest_abc123（多使用者環境）

// 取得環境變數 / Get environment variable
const envVar = getJestCacheDirectoryEnvVar();
```

## 環境變數 (Environment Variables)

- `JEST_CACHE_DIRECTORY` - 自定義 Jest 快取目錄路徑 / Custom Jest cache directory path

## API 參考 (API Reference)

### `getJestCacheDirectory()`

取得 Jest 快取目錄路徑。優先使用環境變數，否則使用系統暫存目錄下的 `jest` 資料夾。

Get Jest cache directory path. Prioritizes environment variable, falls back to `jest` folder in system temp directory.

### `getJestCacheDirectoryEnvVar()`

取得 `JEST_CACHE_DIRECTORY` 環境變數值。

Get `JEST_CACHE_DIRECTORY` environment variable value.

## 參考連結 (Reference)

- [Jest getCacheDirectory.ts](https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts)

## 授權 (License)

ISC
