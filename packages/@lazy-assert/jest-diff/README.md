# @lazy-assert/jest-diff

Jest 差異比較工具，提供增強的字串差異比較功能，特別針對行分隔符號（CRLF/LF）差異進行優化。

Jest difference comparison utility with enhanced string diff functionality, optimized for line separator (CRLF/LF) differences.

## 特色 (Features)

- 支援行分隔符號差異檢測 / Supports line separator difference detection
- 整合 CRLF 正規化 / Integrates CRLF normalization
- 提供增強的差異訊息 / Provides enhanced difference messages
- 支援 Jest 匹配器工具 / Supports Jest matcher utilities

## 安裝 (Installation)

```bash
npm install @lazy-assert/jest-diff
# or
yarn add @lazy-assert/jest-diff
```

## 使用方式 (Usage)

### 基本使用 (Basic Usage)

```typescript
import { _stringDiff, _stringDiffCore } from '@lazy-assert/jest-diff';

const received = 'Hello\r\nWorld';
const expected = 'Hello\nWorld';

// 檢測行分隔符號差異 / Detect line separator differences
console.log(_stringDiffCore(received, expected));

// 取得差異結果 / Get difference result
console.log(_stringDiff(received, expected));
```

### 自定義選項 (Custom Options)

```typescript
import { _stringDiff } from '@lazy-assert/jest-diff';
import { DiffOptions } from 'jest-matcher-utils';

const options: DiffOptions = {
  // 自定義選項 / Custom options
};

const result = _stringDiff(received, expected, options);
```

## API 參考 (API Reference)

### `_stringDiffCore(received, expected, options?)`

核心差異比較函式，回傳差異訊息陣列。

Core difference comparison function, returns array of difference messages.

### `_stringDiff(received, expected, options?)`

取得格式化的差異結果字串。

Get formatted difference result string.

### `EnumDiffMessage`

差異訊息列舉：

- `LINE_SEPARATORS` - 僅行分隔符號不同 / Contents have differences only in line separators

## 授權 (License)

ISC
