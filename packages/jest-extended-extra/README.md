# jest-extended-extra

Jest 擴展匹配器集合，提供額外的數字型別斷言匹配器。

Jest extended matchers collection providing additional numeric type assertion matchers.

## 特色 (Features)

- 數字型別檢查 / Number type checking (Integer, Float, Infinity)
- 正負值檢查 / Positive/Negative value checking
- 零值檢查 / Zero value checking
- 有限數檢查 / Finite number checking
- 支援 TypeScript 類型守護 / TypeScript type guard support

## 安裝 (Installation)

```bash
npm install jest-extended-extra
# or
yarn add jest-extended-extra
```

## 使用方式 (Usage)

### 自動安裝 (Auto Install)

```typescript
// 只需引入，匹配器會自動安裝
// Simply import and matchers will be auto-installed
import 'jest-extended-extra';

// 現在可以在測試中使用 / Now you can use in tests
test('should be integer', () => {
  expect(42).toBeInteger();
  expect(3.14).not.toBeInteger();
});
```

### 手動安裝 (Manual Install)

```typescript
import { matchers } from 'jest-extended-extra';

expect.extend(matchers);
```

## 匹配器列表 (Available Matchers)

| 匹配器 (Matcher) | 說明 (Description) |
|-----------------|-------------------|
| `toBeInteger()` | 檢查是否為整數 / Check if value is integer |
| `toBeFloat()` | 檢查是否為浮點數 / Check if value is float |
| `toBeInfinity()` | 檢查是否為無限大 / Check if value is infinity |
| `toBeFinite()` | 檢查是否為有限數 / Check if value is finite |
| `toBePositive()` | 檢查是否為正數 / Check if value is positive |
| `toBeNegative()` | 檢查是否為負數 / Check if value is negative |
| `toBeZero()` | 檢查是否為零 / Check if value is zero |

## 使用範例 (Examples)

```typescript
describe('Number matchers', () => {
  test('toBeInteger', () => {
    expect(10).toBeInteger();
    expect(10.5).not.toBeInteger();
  });

  test('toBeFloat', () => {
    expect(10.5).toBeFloat();
    expect(10).not.toBeFloat();
  });

  test('toBePositive', () => {
    expect(10).toBePositive();
    expect(-10).not.toBePositive();
  });

  test('toBeNegative', () => {
    expect(-10).toBeNegative();
    expect(10).not.toBeNegative();
  });

  test('toBeZero', () => {
    expect(0).toBeZero();
    expect(10).not.toBeZero();
  });

  test('toBeFinite', () => {
    expect(10).toBeFinite();
    expect(Infinity).not.toBeFinite();
  });

  test('toBeInfinity', () => {
    expect(Infinity).toBeInfinity();
    expect(-Infinity).toBeInfinity();
    expect(10).not.toBeInfinity();
  });
});
```

## 授權 (License)

ISC
