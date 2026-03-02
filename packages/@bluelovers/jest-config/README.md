# @bluelovers/jest-config

Jest configuration preset with TypeScript support, providing automatic ts-jest transform chain integration, cache management, and coverage settings.

具備 TypeScript 支援的 Jest 配置預設套件，提供自動 ts-jest 轉換鏈整合、快取管理和覆蓋率設定。

## 特色 / Features

- **預設 Jest 配置 / Default Jest Configuration**: 包含完整的 TypeScript 測試環境設定
- **ts-jest 轉換鏈 / ts-jest Transform Chain**: 自動整合 `jest-tsd-transform` 和 `jest-chain-transform`
- **配置混合功能 / Configuration Mixing**: 透過 `mixinJestConfig` 函數輕鬆合併自定義配置
- **快取目錄管理 / Cache Directory Management**: 自動管理 Jest 快取位置
- **覆蓋率收集 / Coverage Collection**: 內建 v8 覆蓋率提供者設定

## 安裝 / Installation

```bash
# Using npm
npm install @bluelovers/jest-config

# Using yarn
yarn add @bluelovers/jest-config

# Using yarn-tool
yarn-tool add @bluelovers/jest-config

# Using yt (short for yarn-tool)
yt add @bluelovers/jest-config

# Using pnpm
pnpm add @bluelovers/jest-config
```

## 使用方式 / Usage

### 基本使用 / Basic Usage

```javascript
// jest.config.js
const { mixinJestConfig } = require('@bluelovers/jest-config');

module.exports = mixinJestConfig({
  // 你的自定義配置 / Your custom configuration
});
```

### TypeScript 使用 / TypeScript Usage

```typescript
// jest.config.ts
import { mixinJestConfig } from '@bluelovers/jest-config';

export default mixinJestConfig({
  // 你的自定義配置 / Your custom configuration
});
```

### 顯示配置資訊 / Display Configuration Info

```typescript
import { mixinJestConfig } from '@bluelovers/jest-config';

// 第二個參數設為 true 會自動印出配置資訊
// Set second parameter to true to auto print config info
export default mixinJestConfig({}, true);
```

### 支援的擴充套件 / Supported Extensions

- [`jest-tsd-transform`](https://www.npmjs.com/package/jest-tsd-transform): TypeScript 宣告檔轉換 / TypeScript declaration file transformation
- [`jest-chain-transform`](https://www.npmjs.com/package/jest-chain-transform): Jest 轉換鏈協調 / Jest transform chain coordination

```bash
yarn add jest-tsd-transform jest-chain-transform
```

## 配置選項 / Configuration Options

| 選項 / Option | 說明 / Description | 預設值 / Default |
|--------------|-------------------|-----------------|
| `cacheDirectory` | Jest 快取目錄 / Jest cache directory | 自動偵測 / Auto-detected |
| `maxWorkers` | 最大工作執行緒數量 / Maximum worker threads | `1` |
| `clearMocks` | 是否清除模擬物件 / Clear mocks between tests | `true` |
| `passWithNoTests` | 沒有測試時是否通過 / Pass when no tests found | `true` |
| `moduleFileExtensions` | 模組檔案副檔名 / Module file extensions | `['js','mjs','cjs','jsx','ts','mts','cts','tsx','json','node']` |
| `testPathIgnorePatterns` | 測試路徑忽略模式 / Test path ignore patterns | `['/node_modules/','/__fixtures__/','/dist/']` |
| `setupFilesAfterEnv` | 環境設置後載入的檔案 / Files to load after environment setup | `[]` |
| `coverageProvider` | 覆蓋率提供者 / Coverage provider | `'v8'` |
| `collectCoverage` | 是否收集覆蓋率 / Collect coverage | `false` |
| `coveragePathIgnorePatterns` | 覆蓋率路徑忽略模式 / Coverage path ignore patterns | `['/node_modules/','/__snapshots__/','/dist/']` |

## API 參考 / API Reference

### `mixinJestConfig(jestConfig?, autoPrint?, options?)`

混合 Jest 配置的函數。
Function for mixing Jest configurations.

**參數 / Parameters:**

- `jestConfig` (可選/optional): 使用者自定義的 Jest 配置 / User custom Jest configuration
- `autoPrint` (可選/optional): 是否自動印出配置資訊 / Whether to auto print configuration info
- `options` (可選/optional): 印出配置的選項 / Options for printing configuration

**回傳值 / Returns:**

- 合併後的完整 Jest 配置 / Merged complete Jest configuration

**範例 / Example:**

```typescript
import { mixinJestConfig } from '@bluelovers/jest-config';

const config = mixinJestConfig(
  {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  },
  true, // 自動印出配置 / Auto print config
  { cwd: __dirname } // 選項 / Options
);
```

## 核心功能 / Core Features

### 自動轉換鏈整合 / Automatic Transform Chain Integration

此套件會自動偵測並整合以下轉換器：
This package automatically detects and integrates the following transformers:

1. **ts-jest**: 主要的 TypeScript 轉換器 / Primary TypeScript transformer
2. **jest-tsd-transform**: TypeScript 宣告檔測試支援 / TypeScript declaration file testing support
3. **jest-chain-transform**: 多層轉換協調 / Multi-layer transform coordination

### 快取目錄管理 / Cache Directory Management

使用 `jest-cache-directory` 自動選擇最佳的快取位置：
Uses `jest-cache-directory` to automatically select the optimal cache location:

- 優先使用本地 `node_modules/.cache/jest` / Prefer local `node_modules/.cache/jest`
- 若不可寫入則使用系統暫存目錄 / Falls back to system temp directory if not writable

### 測試檔案副檔名 / Test File Extensions

預設支援的測試檔案副檔名：
Default supported test file extensions:

- `.ts` - TypeScript
- `.tsx` - TypeScript with JSX
- `.mts` - TypeScript ES Module
- `.cts` - TypeScript CommonJS Module

## 發布檔案結構 / Published File Structure

### Jest Preset 檔案 / Jest Preset Files

此套件發布時包含以下 Jest preset 檔案：
The following Jest preset files are included when publishing this package:

| 檔案 / File | 說明 / Description | 必要性 / Required |
|------------|-------------------|------------------|
| `jest-preset.cjs` | CommonJS 版本的 Jest preset | ✅ 必須 / Required |
| `jest-preset.mjs` | ES Module 版本的 Jest preset | ✅ 必須 / Required |
| `jest-preset.js` | 不需要實體檔案 / No physical file needed | ❌ 省略 / Omitted |

### 為什麼 jest-preset.js 不需要？

`package.json` 中的 `exports` 欄位已定義了虛擬路徑映射：
The `exports` field in `package.json` defines virtual path mappings:

```json
{
  "exports": {
    "./jest-preset": {
      "require": "./jest-preset.cjs",
      "import": "./jest-preset.mjs"
    },
    "./jest-preset.js": {
      "require": "./jest-preset.cjs",
      "import": "./jest-preset.mjs"
    }
  }
}
```

這表示無論使用者使用 `preset: '@bluelovers/jest-config'` 或 `preset: '@bluelovers/jest-config/jest-preset.js'`，
Node.js 都會根據環境自動導向至正確的 `.cjs` 或 `.mjs` 檔案。

This means whether users use `preset: '@bluelovers/jest-config'` or `preset: '@bluelovers/jest-config/jest-preset.js'`,
Node.js will automatically resolve to the correct `.cjs` or `.mjs` file based on the environment.

### .npmignore 配置

確保以下檔案不被忽略：
Ensure these files are not ignored:

```gitignore
# 保留 Jest preset 檔案 / Keep Jest preset files
!jest-preset.*
!jest-preset.cjs
!jest-preset.mjs
!jest.config.*
jest.config.js
```

## 授權 / License

ISC

---

## 相關連結 / Related Links

- [GitHub 儲存庫 / Repository](https://github.com/bluelovers/ws-jest)
- [問題回報 / Issue Tracker](https://github.com/bluelovers/ws-jest/issues)
- [npm 套件頁面 / npm Package](https://www.npmjs.com/package/@bluelovers/jest-config)
