# @lazy-assert/check-basic

基本的數字檢查工具，提供多種數字類型檢查功能，支援 TypeScript 類型守護（Type Guard）。

Basic number checking utilities providing various number type checking functions with TypeScript type guard support.

## 特色 (Features)

- 提供多種數字類型檢查函式 / Provides various number type checking functions
- 支援 TypeScript 類型守護 / Supports TypeScript type guards
- 包含安全數字檢查 / Includes safe number checking
- 支援數字字串檢查 / Supports numeric string checking
- 零依賴 / Zero dependencies

## 安裝 (Installation)

```bash
npm install @lazy-assert/check-basic
# or
yarn add @lazy-assert/check-basic
```

## 使用方式 (Usage)

### 基本使用 (Basic Usage)

```typescript
import { isNum, isInt, isFloat, isFiniteNum } from '@lazy-assert/check-basic';

console.log(isNum(123));           // true
console.log(isNum(NaN));           // false
console.log(isInt(123.45));        // false
console.log(isFloat(123.45));      // true
console.log(isFiniteNum(Infinity)); // false
```

### 類型守護使用 (Type Guard Usage)

```typescript
function processNumber(n: unknown) {
  if (isInt(n)) {
    // n 在這裡被推斷為 number 類型
    // n is inferred as number type here
    console.log('整數:', n);
  }
}
```

## API 參考 (API Reference)

### 數字檢查 (Number Checking)

| 函式 (Function) | 說明 (Description) |
|----------------|-------------------|
| `isNum(n)` | 檢查是否為有效數字（排除 NaN）/ Check if valid number (excludes NaN) |
| `isNaN(n)` | 檢查是否為 NaN / Check if NaN |
| `isInt(n)` | 檢查是否為整數 / Check if integer |
| `isFloat(n)` | 檢查是否為浮點數 / Check if float |
| `isFiniteNum(n)` | 檢查是否為有限數字 / Check if finite number |
| `isFiniteInt(n)` | 檢查是否為有限整數 / Check if finite integer |
| `isFiniteFloat(n)` | 檢查是否為有限浮點數 / Check if finite float |
| `isInfinity(n)` | 檢查是否為無限大 / Check if infinity |
| `isZero(n)` | 檢查是否為零（0 或 -0）/ Check if zero (0 or -0) |
| `isPositive(n)` | 檢查是否為正數 / Check if positive |
| `isNegative(n)` | 檢查是否為負數 / Check if negative |

### 字串檢查 (String Checking)

| 函式 (Function) | 說明 (Description) |
|----------------|-------------------|
| `isUnSafeNumString(n)` | 檢查字串是否可轉換為有效數字 / Check if string can convert to valid number |
| `isUnSafeNumLike(n)` | 檢查是否為類數字型別（數字或可轉換字串）/ Check if number-like (number or convertible string) |

## 授權 (License)

ISC
