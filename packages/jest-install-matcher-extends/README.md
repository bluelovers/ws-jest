# jest-install-matcher-extends

自動安裝 Jest 擴展匹配器的工具函式庫。

Auto-install Jest extended matchers utility library.

## 特色 (Features)

- 自動偵測並安裝匹配器 / Auto-detects and installs matchers
- 支援全域 expect 物件 / Supports global expect object
- 提供回調機制處理安裝結果 / Provides callbacks for installation results

## 安裝 (Installation)

```bash
npm install jest-install-matcher-extends
# or
yarn add jest-install-matcher-extends
```

## 使用方式 (Usage)

### 基本使用 (Basic Usage)

```typescript
import { jestAutoInstallExpectExtend } from 'jest-install-matcher-extends';

const matchers = {
  toBeCustom: (received, expected) => {
    return {
      pass: received === expected,
      message: () => `expected ${received} to be ${expected}`
    };
  }
};

// 自動安裝 / Auto-install
jestAutoInstallExpectExtend(matchers);
```

### 使用選項 (With Options)

```typescript
import { jestAutoInstallExpectExtend, getGlobalExpect } from 'jest-install-matcher-extends';

jestAutoInstallExpectExtend(matchers, {
  expect: getGlobalExpect(),
  cbExists: (matchers) => console.log('Matchers installed'),
  cbNotExists: (matchers) => console.log('Expect not found')
});
```

## API 參考 (API Reference)

### `jestAutoInstallExpectExtend(matchers, options?)`

自動安裝 Jest 擴展匹配器。

| 參數 (Parameter) | 說明 (Description) |
|-----------------|-------------------|
| `matchers` | 匹配器映射表 / Matchers map |
| `options.expect` | 自定義 expect 實例 / Custom expect instance |
| `options.cbExists` | 安裝成功回調 / Success callback |
| `options.cbNotExists` | 安裝失敗回調 / Failure callback |

### `jestInstallExpectExtend(matchers, expect?)`

安裝 Jest 擴展匹配器（直接安裝）。

### `getGlobalExpect()`

取得全域 expect 物件（依序檢查 global、globalThis、window）。

## 授權 (License)

ISC
