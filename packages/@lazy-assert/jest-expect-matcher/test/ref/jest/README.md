# Jest Asymmetric Matchers 原始碼分析 / Source Code Analysis

> Source: [jest/packages/expect/src/asymmetricMatchers.ts](https://github.com/jestjs/jest/blob/main/packages/expect/src/asymmetricMatchers.ts)

---

## 1. 架構概述 / Architecture Overview

### 1.1 基底類別 / Base Class - AsymmetricMatcher

所有非對稱匹配器都繼承自 `AsymmetricMatcher` 抽象類別 (lines 59-85)。

```typescript
export abstract class AsymmetricMatcher<T> implements AsymmetricMatcherInterface {
  $$typeof = Symbol.for('jest.asymmetricMatcher');
  
  constructor(
    protected sample: T,           // 期望值 / Expected value
    protected inverse = false,     // 是否反向匹配 / Whether to invert matching
  ) {}
  
  abstract asymmetricMatch(other: unknown): boolean;
  abstract toString(): string;
}
```

**核心功能 / Core Features:**
- `$$typeof`: 用於識別 Jest 非對稱匹配器的 Symbol / Symbol for identifying Jest asymmetric matchers
- `sample`: 儲存期望值 / Stores the expected value
- `inverse`: 支援否定匹配 (如 `not.arrayContaining`) / Supports negation (e.g., `not.arrayContaining`)
- `getMatcherContext()`: 獲取匹配上下文，包含自定義相等性測試器 / Gets matcher context with custom equality testers

### 1.2 核心工具函數 / Core Utility Functions

| 函數 / Function | 來源 / Source | 用途 / Purpose |
|---------------|---------------|----------------|
| `equals` | @jest/expect-utils | 深度相等性比較，支援自定義測試器 / Deep equality with custom testers |
| `getObjectKeys` | @jest/expect-utils | 獲取物件鍵名 / Get object keys |
| `isA` | @jest/expect-utils | 類型檢查 / Type checking |
| `iterableEquality` | @jest/expect-utils | 可迭代對象相等性 / Iterable equality |
| `subsetEquality` | @jest/expect-utils | 子集相等性 / Subset equality |
| `hasProperty` | 自定義 / Custom | 遞迴屬性存在性檢查 / Recursive property existence check |

---

## 2. 各 Matcher 深度分析 / Deep Analysis of Each Matcher

### 2.1 Any

**位置 / Location:** Lines 87-175

**用途 / Purpose:**
匹配特定類型的任何值 / Matches any value of a specific type

**實作概念 / Implementation Concept:**

```typescript
class Any extends AsymmetricMatcher<any> {
  constructor(sample: unknown) {
    if (sample === undefined) {
      throw new TypeError('any() expects to be passed a constructor function...');
    }
    super(sample);
  }

  asymmetricMatch(other: unknown) {
    // 特殊處理內建類型 / Special handling for built-in types
    if (this.sample === String) {
      return typeof other === 'string' || other instanceof String;
    }
    if (this.sample === Number) {
      return typeof other === 'number' || other instanceof Number;
    }
    // ... 其他內建類型 / other built-in types
    
    // 一般類型使用 instanceof / Use instanceof for regular types
    return other instanceof this.sample;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 內建類型特殊處理 / Built-in type special handling | 對 String, Number, Boolean, Function, Symbol, BigInt 使用 `typeof` 檢查 / Uses `typeof` for primitive types |
| 類型安全 / Type safety | 構造函數不接受 `undefined` / Constructor rejects `undefined` |
| instanceof  fallback | 對於自定義類使用 `instanceof` / Uses `instanceof` for custom classes |
| 類型回報 / Type reporting | `getExpectedType()` 返回對應的類型名稱 / Returns corresponding type name |

**使用範例 / Usage Example:**
```javascript
expect('hello').toEqual(expect.any(String));
expect(123).toEqual(expect.any(Number));
expect([]).toEqual(expect.any(Array));
```

---

### 2.2 Anything

**位置 / Location:** Lines 177-191

**用途 / Purpose:**
匹配任何值，除了 `null` 和 `undefined` / Matches anything except `null` and `undefined`

**實作概念 / Implementation Concept:**

```typescript
class Anything extends AsymmetricMatcher<void> {
  asymmetricMatch(other: unknown) {
    return other != null;  // != null 匹配非 null 和非 undefined
  }
  
  toString() {
    return 'Anything';
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 空值排除 / Null exclusion | 使用 `!= null` 排除 `null` 和 `undefined` / Uses `!= null` to exclude both `null` and `undefined` |
| 簡單實現 / Simple implementation | 僅一行匹配邏輯 / Single line matching logic |
| 無類型回報 / No type reporting | 因為匹配類型不確定 / Because matching type is uncertain |

**使用範例 / Usage Example:**
```javascript
expect(null).not.toEqual(expect.anything());
expect(undefined).not.toEqual(expect.anything());
expect(0).toEqual(expect.anything());
expect('').toEqual(expect.anything());
expect({}).toEqual(expect.anything());
```

---

### 2.3 ArrayContaining

**位置 / Location:** Lines 193-226

**用途 / Purpose:**
匹配包含指定元素的陣列 (子集匹配) / Matches arrays containing specified elements (subset matching)

**實作概念 / Implementation Concept:**

```typescript
class ArrayContaining extends AsymmetricMatcher<Array<unknown>> {
  asymmetricMatch(other: unknown) {
    if (!Array.isArray(this.sample)) {
      throw new TypeError('You must provide an array...');
    }

    const matcherContext = this.getMatcherContext();
    const result =
      this.sample.length === 0 ||  // 空陣列匹配所有陣列 / Empty array matches all arrays
      (Array.isArray(other) &&
        this.sample.every(item =>
          other.some(another =>
            equals(item, another, matcherContext.customTesters),
          ),
        ));

    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 子集匹配 / Subset matching | 只檢查 sample 中的每個元素是否出現在 other 中 / Checks if each element in sample appears in other |
| 空陣列特殊處理 / Empty array special handling | 空陣列匹配任何陣列 / Empty array matches any array |
| 雙向相等性 / Bidirectional equality | 使用 `equals()` 支援自定義相等性測試器 / Uses `equals()` to support custom equality testers |
| 支援反向 / Inverse support | 透過 `inverse` 參數支援 `arrayNotContaining` / Supports `arrayNotContaining` via `inverse` parameter |

**使用範例 / Usage Example:**
```javascript
expect([1, 2, 3, 4]).toEqual(expect.arrayContaining([1, 2]));
expect([1, 2, 3, 4]).not.toEqual(expect.arrayContaining([5, 6]));
expect([]).toEqual(expect.arrayContaining([])); // 總是匹配 / always matches
```

---

### 2.4 ArrayOf

**位置 / Location:** Lines 228-247

**用途 / Purpose:**
匹配所有元素都符合指定條件的陣列 (完全匹配) / Matches arrays where all elements match a specified condition (full match)

**實作概念 / Implementation Concept:**

```typescript
class ArrayOf extends AsymmetricMatcher<unknown> {
  asymmetricMatch(other: unknown) {
    const matcherContext = this.getMatcherContext();
    const result =
      Array.isArray(other) &&
      other.every(item =>
        equals(this.sample, item, matcherContext.customTesters),  // 每個元素都必須匹配 sample
      );

    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 完全匹配 / Full matching | 陣列的每個元素都必須匹配 sample / Every element in array must match sample |
| 單一樣本匹配多元素 / Single sample matching multiple elements | 與 ArrayContaining 不同，這裡 sample 是單一值 / Unlike ArrayContaining, sample is a single value |
| 必須是陣列 / Must be array | 先檢查 other 是否為陣列 / First checks if other is an array |

**使用範例 / Usage Example:**
```javascript
expect([1, 1, 1]).toEqual(expect.arrayOf(1));
expect(['a', 'a', 'a']).toEqual(expect.arrayOf('a'));
expect([{id: 1}, {id: 1}]).toEqual(expect.arrayOf({id: 1}));
```

**ArrayContaining vs ArrayOf 差異 / Difference:**

| 方面 / Aspect | ArrayContaining | ArrayOf |
|--------------|-----------------|---------|
| 匹配類型 / Matching type | 子集 (部分元素) / Subset | 完全匹配 (所有元素) / Full match |
| sample 類型 / sample type | 陣列 / Array | 單一值 / Single value |
| 元素數量 / Element count | 不需要相等 / Need not be equal | 不需要相等 / Need not be equal |
| 範例 / Example | `[1,2,3,4]` 匹配 `[1,2]` | `[1,1,1]` 匹配 `1` |

---

### 2.5 ObjectContaining

**位置 / Location:** Lines 249-298

**用途 / Purpose:**
匹配包含指定鍵值對的物件 (部分物件匹配) / Matches objects containing specified key-value pairs (partial object matching)

**實作概念 / Implementation Concept:**

```typescript
class ObjectContaining extends AsymmetricMatcher<Record<string | symbol, unknown>> {
  asymmetricMatch(other: any) {
    // 驗證 sample 是物件 / Validate sample is an object
    if (typeof this.sample !== 'object') {
      throw new TypeError('You must provide an object...');
    }

    // 驗證 other 是物件且非陣列 / Validate other is an object and not an array
    if (typeof other !== 'object' || Array.isArray(other)) {
      return false;
    }

    let result = true;
    const matcherContext = this.getMatcherContext();
    const objectKeys = getObjectKeys(this.sample);

    // 檢查每個鍵是否存在且值相等 / Check each key exists and values are equal
    for (const key of objectKeys) {
      if (
        !hasProperty(other, key) ||
        !equals(this.sample[key], other[key], matcherContext.customTesters)
      ) {
        result = false;
        break;
      }
    }

    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 部分匹配 / Partial matching | 只需要包含 sample 中的鍵值對 / Only needs to contain key-value pairs from sample |
| 遞迴屬性檢查 / Recursive property check | 使用 `hasProperty()` 檢查原型鏈上的屬性 / Uses `hasProperty()` to check properties on prototype chain |
| 深度相等性 / Deep equality | 使用 `equals()` 進行深度值比較 / Uses `equals()` for deep value comparison |
| 陣列排除 / Array exclusion | 不匹配陣列 / Does not match arrays |
| Symbol 鍵支援 / Symbol key support | 支援 Symbol 作為鍵名 / Supports Symbol as keys |

**使用範例 / Usage Example:**
```javascript
expect({name: 'John', age: 30}).toEqual(expect.objectContaining({name: 'John'}));
expect({a: 1, b: 2}).not.toEqual(expect.objectContaining({c: 3}));
expect({nested: {value: 42}}).toEqual(expect.objectContaining({nested: {value: 42}}));
```

---

### 2.6 StringContaining

**位置 / Location:** Lines 300-321

**用途 / Purpose:**
匹配包含指定子串的字串 / Matches strings containing a specified substring

**實作概念 / Implementation Concept:**

```typescript
class StringContaining extends AsymmetricMatcher<string> {
  constructor(sample: string, inverse = false) {
    if (!isA('String', sample)) {
      throw new Error('Expected is not a string');
    }
    super(sample, inverse);
  }

  asymmetricMatch(other: unknown) {
    const result = isA<string>('String', other) && other.includes(this.sample);
    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 嚴格類型檢查 / Strict type check | 構造函數驗證 sample 必須是字串 / Constructor validates sample must be a string |
| 使用 String.includes | 使用 JavaScript 原生的 `includes()` 方法 / Uses JavaScript's native `includes()` method |
| 支援 String 對象 | 支援 `new String()` 創建的包裝對象 / Supports wrapper objects created by `new String()` |
| 類型回報 / Type reporting | 返回 'string' 作為預期類型 / Returns 'string' as expected type |

**使用範例 / Usage Example:**
```javascript
expect('Hello World').toEqual(expect.stringContaining('Hello'));
expect('Hello World').not.toEqual(expect.stringContaining(' goodbye'));
```

---

### 2.7 StringMatching

**位置 / Location:** Lines 323-344

**用途 / Purpose:**
匹配符合正則表達式的字串 / Matches strings matching a regular expression

**實作概念 / Implementation Concept:**

```typescript
class StringMatching extends AsymmetricMatcher<RegExp> {
  constructor(sample: string | RegExp, inverse = false) {
    if (!isA('String', sample) && !isA('RegExp', sample)) {
      throw new Error('Expected is not a String or a RegExp');
    }
    super(new RegExp(sample), inverse);  // 統一轉換為 RegExp
  }

  asymmetricMatch(other: unknown) {
    const result = isA<string>('String', other) && this.sample.test(other);
    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 靈活輸入 / Flexible input | 接受 string 或 RegExp / Accepts both string and RegExp |
| 內部 RegExp 化 / Internal RegExp conversion | 將 string 轉換為 RegExp 對象 / Converts string to RegExp object |
| 使用 RegExp.test | 使用正則表達式的 `test()` 方法進行匹配 / Uses RegExp's `test()` method for matching |
| 支援否定 / Inverse support | 透過 `stringNotMatching` 支援否定匹配 / Supports negation via `stringNotMatching` |

**使用範例 / Usage Example:**
```javascript
expect('hello123').toEqual(expect.stringMatching(/\d+/));
expect('hello').not.toEqual(expect.stringMatching(/\d+/));
expect('user@example.com').toEqual(expect.stringMatching(/@\w+\.\w+/));
expect('hello').toEqual(expect.stringMatching('hell')); // string 作為 pattern
```

---

### 2.8 CloseTo

**位置 / Location:** Lines 346-400

**用途 / Purpose:**
匹配在指定精度範圍內的數字 (浮點數比較) / Matches numbers within a specified precision range (floating-point comparison)

**實作概念 / Implementation Concept:**

```typescript
class CloseTo extends AsymmetricMatcher<number> {
  private readonly precision: number;

  constructor(sample: number, precision = 2, inverse = false) {
    if (!isA('Number', sample)) {
      throw new Error('Expected is not a Number');
    }
    if (!isA('Number', precision)) {
      throw new Error('Precision is not a Number');
    }
    super(sample);
    this.inverse = inverse;
    this.precision = precision;
  }

  asymmetricMatch(other: unknown) {
    if (!isA<number>('Number', other)) {
      return false;
    }
    
    let result = false;
    if (
      other === Number.POSITIVE_INFINITY &&
      this.sample === Number.POSITIVE_INFINITY
    ) {
      result = true; // Infinity - Infinity is NaN
    } else if (
      other === Number.NEGATIVE_INFINITY &&
      this.sample === Number.NEGATIVE_INFINITY
    ) {
      result = true; // -Infinity - -Infinity is NaN
    } else {
      // 核心公式: |a - b| < 10^(-precision) / 2
      result = Math.abs(this.sample - other) < Math.pow(10, -this.precision) / 2;
    }
    return this.inverse ? !result : result;
  }
}
```

**關鍵特點 / Key Features:**

| 特性 / Feature | 說明 / Description |
|--------------|-------------------|
| 浮點數精度控制 / Floating-point precision control | 預設精度為 2 位小數 / Default precision is 2 decimal places |
| 特殊邊界處理 / Special boundary handling | 正確處理 Infinity 值 / Properly handles Infinity values |
| 精確公式 / Precise formula | 使用 `|a - b| < 10^(-precision) / 2` 進行比較 / Uses `|a - b| < 10^(-precision) / 2` for comparison |
| 雙重類型驗證 / Dual type validation | 驗證 sample 和 precision 都是數字 / Validates both sample and precision are numbers |
| 豐富的 toAsymmetricMatcher | 返回格式化的字符串表示 / Returns formatted string representation |

**精度示例 / Precision Examples:**

| Precision | 有效範圍 / Valid Range | 示例 / Example |
|-----------|----------------------|----------------|
| 0 | ±0.5 | `closeTo(1, 0)` 匹配 0.5-1.5 |
| 1 | ±0.05 | `closeTo(1, 1)` 匹配 0.95-1.05 |
| 2 | ±0.005 | `closeTo(1, 2)` 匹配 0.995-1.005 (預設/default) |
| 3 | ±0.0005 | `closeTo(1, 3)` 匹配 0.9995-1.0005 |

**使用範例 / Usage Example:**
```javascript
expect(0.1 + 0.2).toEqual(expect.closeTo(0.3, 3));
expect(1.001).toEqual(expect.closeTo(1, 2));
expect(Infinity).toEqual(expect.closeTo(Infinity));
expect(-Infinity).toEqual(expect.closeTo(-Infinity));
```

---

## 3. 實作差異對比表 / Implementation Difference Comparison

### 3.1 匹配策略 / Matching Strategy

| Matcher | 策略 / Strategy | 類型檢查 / Type Check | 自定義相等性 / Custom Equality |
|---------|----------------|---------------------|------------------------------|
| Any | 類型匹配 / Type matching | 內建類型特殊處理 / Built-in type special handling | 不支援 / Not supported |
| Anything | 空值排除 / Null exclusion | `!= null` 檢查 / `!= null` check | 不支援 / Not supported |
| ArrayContaining | 子集匹配 / Subset matching | `Array.isArray()` | ✅ 使用 `equals()` |
| ArrayOf | 完全匹配 / Full matching | `Array.isArray()` | ✅ 使用 `equals()` |
| ObjectContaining | 部分鍵值匹配 / Partial key-value | `typeof` + `Array.isArray()` | ✅ 使用 `equals()` |
| StringContaining | 子串匹配 / Substring | `isA('String')` | 不支援 / Not supported |
| StringMatching | 正則匹配 / Regex | `isA('String')` | 不支援 / Not supported |
| CloseTo | 數值範圍 / Numeric range | `isA('Number')` + Infinity 處理 | 不支援 / Not supported |

### 3.2 否定支持 / Inverse Support

| Matcher | 支援否定 / Inverse Support | 導出函數 / Exported Function |
|---------|---------------------------|----------------------------|
| Any | ❌ 不支持 / Not supported | `any()` |
| Anything | ❌ 不支持 / Not supported | `anything()` |
| ArrayContaining | ✅ 支持 / Supported | `arrayContaining()`, `arrayNotContaining()` |
| ArrayOf | ✅ 支持 / Supported | `arrayOf()`, `notArrayOf()` |
| ObjectContaining | ✅ 支持 / Supported | `objectContaining()`, `objectNotContaining()` |
| StringContaining | ✅ 支持 / Supported | `stringContaining()`, `stringNotContaining()` |
| StringMatching | ✅ 支持 / Supported | `stringMatching()`, `stringNotMatching()` |
| CloseTo | ✅ 支持 / Supported | `closeTo()`, `notCloseTo()` |

### 3.3 構造函數驗證 / Constructor Validation

| Matcher | sample 驗證 / sample Validation | 特殊參數 / Special Parameters |
|---------|--------------------------------|------------------------------|
| Any | 禁止 undefined | - |
| Anything | 無驗證 | - |
| ArrayContaining | 必須是陣列 / Must be array | inverse |
| ArrayOf | 無驗證 | inverse |
| ObjectContaining | 必須是物件 / Must be object | inverse |
| StringContaining | 必須是字串 / Must be string | inverse |
| StringMatching | 必須是字串或正則 / Must be string or RegExp | inverse (自動轉 RegExp) |
| CloseTo | 必須是數字 / Must be number | precision (預設 2), inverse |

### 3.4 邊界情況處理 / Edge Case Handling

| Matcher | 邊界情況 / Edge Cases |
|---------|---------------------|
| Any | 內建類型 (String, Number, Boolean, Function, Symbol, BigInt, Object, Array) 使用 typeof 特殊處理 |
| Anything | `null` 和 `undefined` 不匹配 |
| ArrayContaining | 空陣列匹配所有陣列 |
| ArrayOf | 空陣列需要 other 也是空陣列 |
| ObjectContaining | 排除陣列，支援 Symbol 鍵 |
| StringContaining | String 對象 (new String()) 也被視為字串 |
| StringMatching | string 參數會被轉換為 RegExp |
| CloseTo | 正確處理 Infinity 和 NaN |

---

## 4. 設計模式總結 / Design Patterns Summary

### 4.1 模板方法模式 / Template Method Pattern
所有 matcher 繼承 `AsymmetricMatcher`，實現 `asymmetricMatch()` 和 `toString()` 抽象方法。

### 4.2 策略模式 / Strategy Pattern
通過 `getMatcherContext()` 注入自定義相等性測試器，實現可插拔的相等性邏輯。

### 4.3 裝飾器模式 / Decorator Pattern
`inverse` 參數作為裝飾器，動態改變匹配行為而無需創建新類。

### 4.4 工廠模式 / Factory Pattern
導出的工廠函數 (`any()`, `anything()` 等) 封裝了對象創建細節。

---

## 5. 原始碼檔案 / Source Files

- **asymmetricMatchers.ts**: 主要實作 / Main implementation
- **jestMatchersObject.ts**: Jest matchers 上下文 / Jest matchers context
- **types.ts**: 類型定義 / Type definitions

---

## 6. 外部依賴 / External Dependencies

| 模組 / Module | 來源 / Source | 用途 / Purpose |
|-------------|---------------|----------------|
| "@jest/expect-utils" | jest 內部 | 深度相等性、類型檢查 / Deep equality, type checking |
| "jest-matcher-utils" | jest 內部 | 匹配器工具函數 / Matcher utility functions |
| "jest-util" | jest 內部 | 通用工具 (如 pluralize) / Common utilities |

---

## 7. 相關測試分析 / Related Test Analysis

詳細的測試分析與源代碼對應關係，請參閱 [TEST_ANALYSIS.md](./TEST_ANALYSIS.md)

### 7.1 測試檔案對應 / Test Files Correspondence

| 測試檔案 | 描述 | 對應測試分析章節 |
|---------|------|-----------------|
| `throw-msg.spec.ts` | 測試斷言失敗訊息顯示 | 第四章 / Chapter 4 |
| `throw-msg-class.spec.ts` | 測試 Class 版本 anyOf/allOf | 第三章 / Chapter 3 |
| `throw-msg-jest.spec.ts` | 測試 Jest AsymmetricMatcher 版本 | 第三章 / Chapter 3 |
| `demo.spec.ts` | 示範自定義 Matcher | - |

### 7.2 throw-msg.ts 版本分析 / throw-msg.ts Version Analysis

| 版本 | 特性組合 | 測試章節 |
|------|---------|---------|
| 001 | asymmetricMatch + toString | 2.2.1 |
| 002 | + jasmineToString | 2.2.1 |
| 003 | + $$typeof | 2.2.1 |
| 004 | Class 版本 | 2.2.2 |
| 009 | toString + toAsymmetricMatcher + $$typeof | 2.2.3 |
| Simplifed | 最簡版本 | 2.2.3 |

---

## 8. toString 與 toAsymmetricMatcher 的設計邏輯 / toString vs toAsymmetricMatcher Design

### 8.1 設計原則 / Design Principle

在 AsymmetricMatcher 的設計中，`toString` 和 `toAsymmetricMatcher` 扮演不同的角色：

| 方法 | 用途 | 範例輸出 |
|------|------|---------|
| `toString()` | 返回 Matcher 的名稱（類似 name） | `AllOf` |
| `toAsymmetricMatcher()` | 返回完整的表示（名稱 + 參數） | `AllOf(1, 2, 3)` |

### 8.2 實作範例 / Implementation Example

```typescript
class AllOf extends AsymmetricMatcher<(unknown | AsymmetricMatcher<any>)[]> {
  // toString: 只返回名稱
  override toString(): string {
    return `AllOf`;
  }

  // toAsymmetricMatcher: 返回完整表示 (名稱 + sample)
  override toAsymmetricMatcher(): string {
    return `${this.toString()}(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
  }
}
```

### 8.3 設計理由 / Design Rationale

- **`toString` 作為 name**：提供一個簡潔的身份標識，用於類型識別或日誌記錄
- **`toAsymmetricMatcher` 作為完整表示**：在斷言失敗時，顯示完整的匹配器資訊，包含其預期的 sample 值

### 8.4 各 Matcher 的輸出示例 / Output Examples by Matcher

| Matcher | toString() | toAsymmetricMatcher() |
|---------|------------|----------------------|
| AnyOf([1, 2]) | `AnyOf` | `AnyOf(1, 2)` |
| AllOf([1, 2]) | `AllOf` | `AllOf(1, 2)` |
| NotAnyOf([1, 2]) | `NotAnyOf` | `NotAnyOf(1, 2)` |
| NotAllOf([1, 2]) | `NotAllOf` | `NotAllOf(1, 2)` |

---

*Generated from Jest v29+ source code analysis*
