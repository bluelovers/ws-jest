# @lazy-assert/jest-util

Jest 匹配器工具函式庫，提供訊息產生和選項處理的輔助功能。

Jest matcher utility library providing helper functions for message generation and option handling.

## 特色 (Features)

- 自動處理匹配器提示選項 / Auto-handles matcher hint options
- 提供標準化的通過/失敗訊息 / Provides standardized pass/fail messages
- 支援 Jest 匹配器工具 / Supports Jest matcher utilities
- 簡化自定義匹配器開發 / Simplifies custom matcher development

## 安裝 (Installation)

```bash
npm install @lazy-assert/jest-util
# or
yarn add @lazy-assert/jest-util
```

## 使用方式 (Usage)

```typescript
import { 
  handleJestMatcherHintOptions, 
  passMessage, 
  failMessage, 
  autoMessage 
} from '@lazy-assert/jest-util';

// 處理匹配器選項 / Handle matcher options
const options = handleJestMatcherHintOptions(context, {
  secondArgument: 'expected'
});

// 產生訊息 / Generate messages
const message = autoMessage(pass, received, 'toBeCustom', 'custom');
```

## API 參考 (API Reference)

### `handleJestMatcherHintOptions(context, options?)`

處理 Jest 匹配器提示選項，自動設定 isNot、promise 等上下文相關選項。

### `passMessage(received, matcherName, type)`

產生通過訊息（用於 .not 斷言）。

### `failMessage(received, matcherName, type)`

產生失敗訊息。

### `autoMessage(pass, received, matcherName, type)`

自動選擇並產生對應的訊息。

## 授權 (License)

ISC
