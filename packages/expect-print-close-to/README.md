# expect-print-close-to

匯出 Jest `expect` 模組中的 `printCloseTo` 函式，用於格式化顯示 `toBeCloseTo` 斷言的差異資訊。

Exports `printCloseTo` function from Jest's `expect` module for formatting `toBeCloseTo` assertion difference information.

## 特色 (Features)

- 匯出 Jest 內部的 printCloseTo 函式 / Exports Jest's internal printCloseTo function
- 支援科學記號和固定小數位格式化 / Supports scientific notation and fixed decimal formatting
- 與 Jest 的 toBeCloseTo 行為一致 / Consistent with Jest's toBeCloseTo behavior

## 安裝 (Installation)

```bash
npm install expect-print-close-to
# or
yarn add expect-print-close-to
```

## 使用方式 (Usage)

```typescript
import { printCloseTo } from 'expect-print-close-to';

const message = printCloseTo(
  0.001,     // receivedDiff
  0.0005,    // expectedDiff
  3,         // precision
  false      // isNot
);

console.log(message);
```

## API 參考 (API Reference)

### `printCloseTo(receivedDiff, expectedDiff, precision, isNot)`

格式化輸出 toBeCloseTo 的比較結果。

| 參數 (Parameter) | 說明 (Description) |
|-----------------|-------------------|
| `receivedDiff` | 實際差異值 / Actual difference value |
| `expectedDiff` | 預期差異值 / Expected difference value |
| `precision` | 精度位數 / Precision digits |
| `isNot` | 是否為 .not 斷言 / Whether it's a .not assertion |

## 參考連結 (Reference)

- [Jest print.ts Source](https://github.com/facebook/jest/blob/main/packages/expect/src/print.ts#L62)

## 授權 (License)

ISC
