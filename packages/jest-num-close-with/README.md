# jest-num-close-with

檢查實際數值是否在預期數值的 ± delta 範圍內。

Check if actual number is within expected number ± delta.

## 特色 (Features)

- 使用絕對誤差檢查數值 / Check numbers using absolute delta
- 結合 `num-in-delta` 提供精確的數值比較 / Combines `num-in-delta` for precise number comparison
- 整合 `expect-print-close-to` 提供詳細的錯誤訊息 / Integrates `expect-print-close-to` for detailed error messages
- 自動安裝為 Jest 匹配器 / Auto-installs as Jest matcher

## 安裝 (Installation)

```bash
npm install jest-num-close-with
# or
yarn add jest-num-close-with
```

## 使用方式 (Usage)

### 自動安裝 (Auto Install)

```typescript
// 在 Jest 配置中加入 / Add to Jest config
{
  "jest": {
    "setupFilesAfterEnv": ["jest-num-close-with"]
  }
}
```

### 使用匹配器 (Using the Matcher)

```typescript
test('toBeCloseWith', () => {
  // 基本使用 / Basic usage
  expect(100.5).toBeCloseWith(100, 1); // pass

  // 使用自定義精度 / With custom precision
  expect(3.14159).toBeCloseWith(3.14, 0.01, 5);

  // 檢查無限大 / Check infinity
  expect(Infinity).toBeCloseWith(Infinity); // pass

  // 非運算 / Negation
  expect(100.5).not.toBeCloseWith(100, 0.1); // fail
});
```

## API 參考 (API Reference)

### `toBeCloseWith(expected, delta?, precision?)`

| 參數 (Parameter) | 類型 (Type) | 預設 (Default) | 說明 (Description) |
|-----------------|------------|---------------|-------------------|
| `expected` | `number` | - | 預期數值 / Expected number |
| `delta` | `number` | `undefined` | 允許的絕對誤差 / Allowed absolute delta |
| `precision` | `number` | `4` | 精度位數 / Precision digits |

## 範例 (Examples)

```typescript
describe('toBeCloseWith matcher', () => {
  test('basic comparison', () => {
    expect(10.005).toBeCloseWith(10, 0.01); // pass
    expect(10.1).toBeCloseWith(10, 0.05);   // fail, 差異為 0.1 > 0.05
  });

  test('with precision', () => {
    // 預設精度為 4 位 / Default precision is 4 digits
    expect(3.1415926).toBeCloseWith(3.14159, 0.00001, 5);
  });

  test('infinity handling', () => {
    expect(Infinity).toBeCloseWith(Infinity);      // pass
    expect(-Infinity).toBeCloseWith(-Infinity);    // pass
    expect(Infinity).not.toBeCloseWith(-Infinity); // pass
  });
});
```

## 授權 (License)

ISC
