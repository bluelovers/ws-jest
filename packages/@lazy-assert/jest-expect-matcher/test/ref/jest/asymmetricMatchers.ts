/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @see README.md - 8 種 Asymmetric Matcher 詳細分析 / Detailed analysis of 8 AsymmetricMatchers
 * @see TEST_ANALYSIS.md - 測試與源代碼對應關係 / Test and source code correspondence
 */

import {
  equals,
  getObjectKeys,
  isA,
  iterableEquality,
  subsetEquality,
} from '@jest/expect-utils';
import * as matcherUtils from 'jest-matcher-utils';
import {pluralize} from 'jest-util';
import {getCustomEqualityTesters, getState} from './jestMatchersObject';
import type {
  AsymmetricMatcher as AsymmetricMatcherInterface,
  MatcherContext,
  MatcherState,
} from './types';

const functionToString = Function.prototype.toString;

/**
 * 取得函數的名稱，即使該函數沒有 name 屬性也能取得
 * Get function name even if the function has no name property
 *
 * 當函數沒有 name 時，嘗試透過 Function.prototype.toString() 解析函數原始碼來取得名稱
 * When function has no name, try to parse function source code via toString()
 *
 * @param func - 要取得名稱的函數 / Function to get name from
 * @returns 函數名稱或 '<anonymous>' / Function name or '<anonymous>'
 *
 * @internal
 * 此函數用於處理匿名函數的情況，因為某些情況下函數可能沒有 name 屬性
 * This function handles anonymous functions that may not have a name property
 */
function fnNameFor(func: () => unknown) {
  // 優先使用函數的 name 屬性（這是最簡單的情況）
  // Prefer using function's name property (simplest case)
  if (func.name) {
    return func.name;
  }

  // 如果沒有 name，解析函數的 toString() 結果
  // If no name, parse the function's toString() result
  // 正則表達式解析：
  // - ^(?:async)?\s*function\s*\*?\s* - 匹配 "async function*" 或 "function"
  // - ([\w$]+) - 捕獲函數名稱（字母、數字、底線、$）
  // - \s*\( - 匹配左括號
  const matches = functionToString
    .call(func)
    .match(/^(?:async)?\s*function\s*\*?\s*([\w$]+)\s*\(/);
  
  // 如果正則匹配成功，返回捕獲的名稱；否則返回 '<anonymous>'
  // If regex matches, return captured name; otherwise return '<anonymous>'
  return matches ? matches[1] : '<anonymous>';
}

/**
 * 凍結的工具物件集合，包含 matcher 相關工具函數
 * Frozen utility object collection containing matcher-related utility functions
 *
 * 合併了 jest-matcher-utils 的所有功能，並額外加入 iterableEquality 和 subsetEquality
 * Combines all functions from jest-matcher-utils plus extra equality helpers
 */
const utils = Object.freeze({
  ...matcherUtils,
  iterableEquality,
  subsetEquality,
});

/**
 * 遞迴檢查物件是否具有指定屬性（包括原型鏈）
 * Recursively check if object has specified property (including prototype chain)
 *
 * 使用遞迴沿著原型鏈向上搜尋屬性，確保能找到繼承來的屬性
 * Uses recursion to traverse prototype chain to find inherited properties
 *
 * @param obj - 要檢查的物件 / Object to check
 * @param property - 屬性鍵（字串或 Symbol）/ Property key (string or Symbol)
 * @returns 是否存在該屬性 / Whether the property exists
 *
 * @example
 * // 檢查自有屬性
 * hasProperty({ a: 1 }, 'a'); // true
 *
 * @example
 * // 檢查原型鏈上的屬性
 * const proto = { inherited: 'value' };
 * const obj = Object.create(proto);
 * hasProperty(obj, 'inherited'); // true
 *
 * @example
 * // 檢查 Symbol 屬性
 * const sym = Symbol('test');
 * const obj = { [sym]: 'value' };
 * hasProperty(obj, sym); // true
 *
 * @internal
 * 這個函數用於實現 ObjectContaining，確保能夠檢查到物件原型鏈上的屬性
 * This function is used by ObjectContaining to check properties in the prototype chain
 */
export function hasProperty(
  obj: object | null,
  property: string | symbol,
): boolean {
  // 空物件直接返回 false
  // Return false for null/undefined
  if (!obj) {
    return false;
  }

  // 先檢查物件自身的屬性（不包括原型鏈）
  // Check object's own properties first (not including prototype chain)
  if (Object.prototype.hasOwnProperty.call(obj, property)) {
    return true;
  }

  // 遞迴檢查原型鏈：取得原型物件，然後繼續檢查
  // Recursively check prototype chain: get prototype object, then continue checking
  // 如果原型是 null，表示已經到達原型鏈的頂端
  // If prototype is null, we've reached the top of the prototype chain
  return hasProperty(Object.getPrototypeOf(obj), property);
}

/**
 * 非對稱匹配器的抽象基類
 * Abstract base class for Asymmetric Matchers
 *
 * 所有非對稱匹配器（如 any, anything, objectContaining 等）都繼承此類
 * All asymmetric matchers (any, anything, objectContaining, etc.) inherit from this class
 *
 * 此類定義了 Jest 識別自定義匹配器所需的核心協議
 * This class defines the core protocol that Jest uses to identify custom matchers
 *
 * @example
 * // 繼承創建自定義 Matcher
 * class MyMatcher extends AsymmetricMatcher<string> {
 *   constructor(sample: string) {
 *     super(sample);
 *   }
 *
 *   asymmetricMatch(other: unknown): boolean {
 *     return typeof other === 'string' && other.includes(this.sample);
 *   }
 *
 *   toString() {
 *     return `MyMatcher(${this.sample})`;
 *   }
 * }
 *
 * @example
 * // 在測試中使用
 * expect('hello world').toMatchObject({
 *   text: new MyMatcher('hello')
 * });
 */
export abstract class AsymmetricMatcher<
  T,
> implements AsymmetricMatcherInterface {
  /** 用於識別為 Jest 非對稱匹配器的 Symbol / Symbol for identifying Jest asymmetric matchers */
  $$typeof = Symbol.for('jest.asymmetricMatcher');

  constructor(
    /** 期望值，用於比對 / Expected value used for matching */
    protected sample: T,
    /** 是否反向匹配（否定）/ Whether to invert matching (negation) */
    protected inverse = false,
  ) {}

  /**
   * 取得 Matcher 上下文，包含自定義相等性測試器等資訊
   * Get Matcher context with custom equality testers and other information
   *
   * 此上下文用於提供 equals 函數和自定義測試器，使自定義 Matcher 能支援深度比較
   * This context provides equals function and custom testers enabling deep comparison in custom matchers
   *
   * @internal
   * 這個方法創建了一個包含多種工具的上下文物件
   * - customTesters: 用於自定義相等性比較
   * - dontThrow: 允許 matcher 不拋出錯誤
   * - equals: 深度相等性比較函數
   * - isNot: 指示是否使用 .not 修飾符
   * - utils: 格式化和其他工具函數
   *
   * This method creates a context object with various utilities:
   * - customTesters: for custom equality comparison
   * - dontThrow: allows matchers to not throw errors
   * - equals: deep equality comparison function
   * - isNot: indicates if .not modifier is used
   * - utils: formatting and other utility functions
   *
   * @returns Matcher 上下文物件 / Matcher context object
   */
  protected getMatcherContext(): MatcherContext {
    return {
      customTesters: getCustomEqualityTesters(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dontThrow: () => {},
      ...getState<MatcherState>(),
      equals,
      isNot: this.inverse,
      utils,
    };
  }

  abstract asymmetricMatch(other: unknown): boolean;
  abstract toString(): string;
  getExpectedType?(): string;
  toAsymmetricMatcher?(): string;
}

/**
 * 匹配特定類型的任何值
 * Matches any value of a specific type
 *
 * 例如 expect.any(String) 可以匹配任何字串值
 * For example, expect.any(String) can match any string value
 *
 * @example
 * // 匹配基本類型
 * expect('hello').toEqual(expect.any(String));
 * expect(123).toEqual(expect.any(Number));
 * expect(true).toEqual(expect.any(Boolean));
 * expect(() => {}).toEqual(expect.any(Function));
 * expect(Symbol('id')).toEqual(expect.any(Symbol));
 * expect(123n).toEqual(expect.any(BigInt));
 *
 * @example
 * // 匹配類別實例
 * expect(new Date()).toEqual(expect.any(Date));
 * expect([]).toEqual(expect.any(Array));
 * expect({}).toEqual(expect.any(Object));
 *
 * @example
 * // 在 toMatchObject 中使用
 * expect({ createdAt: new Date(), count: 42 }).toMatchObject({
 *   createdAt: expect.any(Date),
 *   count: expect.any(Number)
 * });
 */
class Any extends AsymmetricMatcher<any> {
  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 建構函數（如 String, Number, Array）/ Constructor function (e.g., String, Number, Array)
   * @throws 如果傳入 undefined，拋出 TypeError / Throws TypeError if undefined is passed
   */
  constructor(sample: unknown) {
    if (sample === undefined) {
      throw new TypeError(
        'any() expects to be passed a constructor function. ' +
          'Please pass one or use anything() to match any object.',
      );
    }
    super(sample);
  }

  /**
   * 執行匹配邏輯
   * Execute matching logic
   *
   * 對內建類型（String, Number 等）使用 typeof 檢查
   * 對自定義類別使用 instanceof 檢查
   * Uses typeof for built-in types, instanceof for custom classes
   *
   * @internal
   * 匹配邏輯說明：
   * 1. 內建原始類型（String, Number, Boolean, Function, Symbol, BigInt）使用 typeof
   *    這樣可以同時匹配原始值和對應的包裝物件（如 new String()）
   * 2. Object 和 Array 使用 typeof/Array.isArray 特殊處理
   * 3. 其他類別使用 instanceof
   *
   * Matching logic explanation:
   * 1. Built-in primitive types (String, Number, etc.) use typeof
   *    This allows matching both primitives and wrapper objects (e.g., new String())
   * 2. Object and Array use special handling with typeof/Array.isArray
   * 3. Other classes use instanceof
   *
   * @param other - 要進行比對的值 / Value to match against
   * @returns 是否匹配 / Whether it matches
   */
  asymmetricMatch(other: unknown) {
    // String: 檢查原始字串或 String 包裝物件
    // Check primitive string or String wrapper object
    if (this.sample === String) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'string' || other instanceof String;
    }

    // Number: 檢查原始數字或 Number 包裝物件
    // Check primitive number or Number wrapper object
    if (this.sample === Number) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'number' || other instanceof Number;
    }

    // Function: 檢查是否為函數
    // Check if it's a function
    if (this.sample === Function) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'function' || other instanceof Function;
    }

    // Boolean: 檢查原始布林值或 Boolean 包裝物件
    // Check primitive boolean or Boolean wrapper object
    if (this.sample === Boolean) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'boolean' || other instanceof Boolean;
    }

    // BigInt: 檢查 BigInt 原始類型
    // Check BigInt primitive type
    if (this.sample === BigInt) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'bigint' || other instanceof BigInt;
    }

    // Symbol: 檢查 Symbol 原始類型
    // Check Symbol primitive type
    if (this.sample === Symbol) {
      // eslint-disable-next-line unicorn/no-instanceof-builtins
      return typeof other === 'symbol' || other instanceof Symbol;
    }

    // Object: 檢查是否為物件類型（不包括 null 和陣列）
    // Check if it's an object type (excluding null and arrays)
    if (this.sample === Object) {
      return typeof other === 'object';
    }

    // Array: 檢查是否為陣列
    // Check if it's an array
    if (this.sample === Array) {
      return Array.isArray(other);
    }

    // 自定義類別：使用 instanceof 檢查
    // Custom classes: use instanceof check
    return other instanceof this.sample;
  }

  toString() {
    return 'Any';
  }

  override getExpectedType() {
    if (this.sample === String) {
      return 'string';
    }

    if (this.sample === Number) {
      return 'number';
    }

    if (this.sample === Function) {
      return 'function';
    }

    if (this.sample === Object) {
      return 'object';
    }

    if (this.sample === Boolean) {
      return 'boolean';
    }

    if (this.sample === Array) {
      return 'array';
    }

    return fnNameFor(this.sample);
  }

  override toAsymmetricMatcher() {
    return `Any<${fnNameFor(this.sample)}>`;
  }
}

/**
 * 匹配任何值，除了 null 和 undefined
 * Matches any value except null and undefined
 *
 * 與 any() 不同，anything() 不需要傳入建構函數，可以匹配任何非空值
 * Unlike any(), anything() doesn't require a constructor function and matches any non-null value
 *
 * @example
 * // 基本使用 - 排除 null 和 undefined
 * expect(null).not.toEqual(expect.anything());
 * expect(undefined).not.toEqual(expect.anything());
 * expect(0).toEqual(expect.anything());
 * expect('').toEqual(expect.anything());
 * expect(false).toEqual(expect.anything());
 * expect({}).toEqual(expect.anything());
 *
 * @example
 * // 在 toMatchObject 中使用 - 忽略特定欄位的值
 * expect({
 *   id: 123,
 *   data: { complex: 'object' },
 *   optional: null
 * }).toMatchObject({
 *   id: expect.any(Number),
 *   data: expect.anything(),
 *   optional: expect.anything()  // 可以是任何值包括 null
 * });
 *
 * @example
 * // 與其他 Matcher 組合
 * expect({ name: 'John', age: null }).toMatchObject({
 *   name: expect.anything(),  // 必須存在
 *   age: expect.anything()      // 可以是任何值
 * });
 */
class Anything extends AsymmetricMatcher<void> {
  /**
   * 執行匹配邏輯
   * Execute matching logic
   *
   * 使用 != null 來同時排除 null 和 undefined
   * Uses != null to exclude both null and undefined
   *
   * @param other - 要進行比對的值 / Value to match against
   * @returns 除了 null 和 undefined 外都返回 true / Returns true except for null and undefined
   */
  asymmetricMatch(other: unknown) {
    return other != null;
  }

  toString() {
    return 'Anything';
  }

  // No getExpectedType method, because it matches either null or undefined.

  override toAsymmetricMatcher() {
    return 'Anything';
  }
}

/**
 * 匹配包含指定元素的陣列（子集匹配）
 * Matches arrays containing specified elements (subset matching)
 *
 * 只檢查 sample 中的每個元素是否出現在 other 陣列中
 * Only checks if each element in sample appears in the other array
 *
 * 例如 [1,2,3,4] 會匹配 arrayContaining([1,2])
 * For example, [1,2,3,4] matches arrayContaining([1,2])
 *
 * @example
 * // 基本使用 - 子集匹配
 * expect([1, 2, 3, 4, 5]).toEqual(expect.arrayContaining([1, 2, 3]));
 * expect(['a', 'b', 'c']).toEqual(expect.arrayContaining(['a', 'b']));
 *
 * @example
 * // 順序不重要
 * expect([3, 1, 2]).toEqual(expect.arrayContaining([1, 2, 3]));
 *
 * @example
 * // 巢狀物件匹配
 * expect([{ a: 1 }, { b: 2 }]).toEqual(expect.arrayContaining([{ a: 1 }]));
 *
 * @example
 * // 空陣列匹配任何陣列
 * expect([1, 2, 3]).toEqual(expect.arrayContaining([]));
 *
 * @example
 * // 使用 not 否定
 * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([4, 5]));
 *
 * @example
 * // 與其他 Matcher 組合
 * expect([{ name: 'John', age: 30 }]).toMatchObject([{
 *   name: expect.any(String),
 *   age: expect.arrayContaining([30])
 * }]);
 */
class ArrayContaining extends AsymmetricMatcher<Array<unknown>> {
  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 要匹配的陣列 / Array to match against
   * @param inverse - 是否反向匹配（預設 false）/ Whether to invert matching (default false)
   */
  constructor(sample: Array<unknown>, inverse = false) {
    super(sample, inverse);
  }

  /**
   * 執行匹配邏輯
   * Execute matching logic
   *
   * @internal
   * 匹配演算法：
   * 1. 首先驗證 sample 是陣列
   * 2. 如果 sample 是空陣列，則匹配任何陣列（因為空陣列是所有陣列的子集）
   * 3. 否則，檢查 sample 中的每個元素是否出現在 other 中
   *    - 使用 some() 檢查：sample 的每個元素，都能在 other 中找到至少一個匹配
   *    - 使用 equals() 進行深度比較，支援自定義測試器
   *
   * Matching algorithm:
   * 1. First validate that sample is an array
   * 2. If sample is empty, match any array (empty array is subset of all arrays)
   * 3. Otherwise, check if each element in sample appears in other
   *    - Use some(): for each element in sample, find at least one match in other
   *    - Use equals() for deep comparison, supports custom testers
   *
   * @param other - 要進行比對的值 / Value to match against
   * @returns 是否匹配 / Whether it matches
   */
  asymmetricMatch(other: unknown) {
    // 驗證傳入的 sample 是陣列
    // Validate that sample is an array
    if (!Array.isArray(this.sample)) {
      throw new TypeError(
        `You must provide an array to ${this.toString()}, not '${typeof this
          .sample}'.`,
      );
    }

    // 取得 Matcher 上下文，獲取自定義相等性測試器
    // Get Matcher context to obtain custom equality testers
    const matcherContext = this.getMatcherContext();

    // 匹配邏輯：
    // 1. sample.length === 0: 空陣列匹配任何陣列
    // 2. other 必須是陣列，且 sample 每個元素都能在 other 中找到匹配的
    // Matching logic:
    // 1. sample.length === 0: empty array matches any array
    // 2. other must be an array, and every element in sample must have a match in other
    const result =
      this.sample.length === 0 ||
      (Array.isArray(other) &&
        // 對 sample 中的每個元素，檢查是否能在 other 中找到匹配
        // For each element in sample, check if it can find a match in other
        this.sample.every(item =>
          other.some(another =>
            equals(item, another, matcherContext.customTesters),
          ),
        ));

    // 根據 inverse 參數決定返回值
    // Return value based on inverse parameter
    return this.inverse ? !result : result;
  }

  toString() {
    return `Array${this.inverse ? 'Not' : ''}Containing`;
  }

  override getExpectedType() {
    return 'array';
  }
}

/**
 * 匹配所有元素都符合指定條件的陣列（完全匹配）
 * Matches arrays where all elements match a specified condition (full match)
 *
 * 與 ArrayContaining 不同，這裡 sample 是單一值，用於匹配陣列中的每個元素
 * Unlike ArrayContaining, sample here is a single value used to match every element in the array
 *
 * 例如 [1,1,1] 會匹配 arrayOf(1)
 * For example, [1,1,1] matches arrayOf(1)
 *
 * @example
 * // 基本使用 - 所有元素必須相同
 * expect([1, 1, 1]).toEqual(expect.arrayOf(1));
 * expect(['a', 'a', 'a']).toEqual(expect.arrayOf('a'));
 *
 * @example
 * // 使用 Matcher
 * expect([1, 2, 3]).toEqual(expect.arrayOf(expect.any(Number)));
 * expect([true, true, true]).toEqual(expect.arrayOf(true));
 *
 * @example
 * // 巢狀物件
 * expect([{ id: 1 }, { id: 1 }]).toEqual(expect.arrayOf({ id: 1 }));
 *
 * @example
 * // 空陣列
 * expect([]).toEqual(expect.arrayOf(expect.any(String)));
 *
 * @example
 * // 失敗情況 - 元素不一致
 * expect([1, 2, 1]).toEqual(expect.arrayOf(1)); // 失敗！
 *
 * @example
 * // 使用 not 否定
 * expect([1, 2, 3]).not.toEqual(expect.arrayOf(1));
 */
class ArrayOf extends AsymmetricMatcher<unknown> {
  /**
   * 執行匹配邏輯
   * Execute matching logic
   *
   * 使用 every() 確保陣列中每個元素都匹配 sample
   * Uses every() to ensure every element in the array matches sample
   *
   * @param other - 要進行比對的值 / Value to match against
   * @returns 是否所有元素都匹配 / Whether all elements match
   */
  asymmetricMatch(other: unknown) {
    const matcherContext = this.getMatcherContext();
    const result =
      Array.isArray(other) &&
      other.every(item =>
        equals(this.sample, item, matcherContext.customTesters),
      );

    return this.inverse ? !result : result;
  }

  toString() {
    return `${this.inverse ? 'Not' : ''}ArrayOf`;
  }

  override getExpectedType() {
    return 'array';
  }
}

/**
 * 匹配包含指定鍵值對的物件（部分物件匹配）
 * Matches objects containing specified key-value pairs (partial object matching)
 *
 * 只需要物件包含 sample 中指定的鍵值對即可，不需要完全相等
 * Only needs to contain the key-value pairs specified in sample, not exact equality
 *
 * 例如 {name:'John', age:30} 會匹配 objectContaining({name:'John'})
 * For example, {name:'John', age:30} matches objectContaining({name:'John'})
 *
 * @example
 * // 基本使用 - 部分鍵值匹配
 * expect({ name: 'John', age: 30 }).toEqual(expect.objectContaining({ name: 'John' }));
 * expect({ a: 1, b: 2, c: 3 }).toEqual(expect.objectContaining({ a: 1 }));
 *
 * @example
 * // 巢狀物件
 * expect({ user: { name: 'John', age: 30 } }).toEqual(
 *   expect.objectContaining({ user: { name: 'John' } })
 * );
 *
 * @example
 * // 與其他 Matcher 組合
 * expect({ name: 'John', age: 30 }).toEqual(
 *   expect.objectContaining({
 *     name: expect.any(String),
 *     age: expect.any(Number)
 *   })
 * );
 *
 * @example
 * // 使用 not 否定
 * expect({ a: 1 }).not.toEqual(expect.objectContaining({ b: 2 }));
 *
 * @example
 * // Symbol 鍵支援
 * const sym = Symbol('id');
 * expect({ [sym]: 123 }).toEqual(expect.objectContaining({ [sym]: 123 }));
 */
class ObjectContaining extends AsymmetricMatcher<
  Record<string | symbol, unknown>
> {
  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 要匹配的物件 / Object to match against
   * @param inverse - 是否反向匹配（預設 false）/ Whether to invert matching (default false)
   */
  constructor(sample: Record<string | symbol, unknown>, inverse = false) {
    super(sample, inverse);
  }

  asymmetricMatch(other: any) {
    // Ensures that the argument passed to the objectContaining method is an object
    if (typeof this.sample !== 'object') {
      throw new TypeError(
        `You must provide an object to ${this.toString()}, not '${typeof this
          .sample}'.`,
      );
    }

    // Ensures that the argument passed to the expect function is an object
    // This is necessary to avoid matching of non-object values
    // Arrays are a special type of object, but having a valid match with a standard object
    // does not make sense, hence we do a simple array check
    if (typeof other !== 'object' || Array.isArray(other)) {
      return false;
    }

    let result = true;

    const matcherContext = this.getMatcherContext();
    const objectKeys = getObjectKeys(this.sample);

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

  toString() {
    return `Object${this.inverse ? 'Not' : ''}Containing`;
  }

  override getExpectedType() {
    return 'object';
  }
}

/**
 * 匹配包含指定子串的字串
 * Matches strings containing a specified substring
 *
 * 使用 String.includes() 進行子串匹配
 * Uses String.includes() for substring matching
 *
 * 例如 'Hello World' 會匹配 stringContaining('Hello')
 * For example, 'Hello World' matches stringContaining('Hello')
 *
 * @example
 * // 基本使用
 * expect('Hello World').toEqual(expect.stringContaining('Hello'));
 * expect('Hello World').toEqual(expect.stringContaining('World'));
 *
 * @example
 * // 大小寫敏感
 * expect('Hello').not.toEqual(expect.stringContaining('hello'));
 *
 * @example
 * // 空字串匹配任何字串
 * expect('anything').toEqual(expect.stringContaining(''));
 *
 * @example
 * // 使用 not 否定
 * expect('Hello').not.toEqual(expect.stringContaining('World'));
 *
 * @example
 * // 在 toMatchObject 中使用
 * expect({ greeting: 'Hello World' }).toMatchObject({
 *   greeting: expect.stringContaining('Hello')
 * });
 */
class StringContaining extends AsymmetricMatcher<string> {
  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 要匹配的子串 / Substring to match against
   * @param inverse - 是否反向匹配（預設 false）/ Whether to invert matching (default false)
   * @throws 如果 sample 不是字串，拋出 Error / Throws Error if sample is not a string
   */
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

  toString() {
    return `String${this.inverse ? 'Not' : ''}Containing`;
  }

  override getExpectedType() {
    return 'string';
  }
}

/**
 * 匹配符合正則表達式的字串
 * Matches strings matching a regular expression
 *
 * 接受字串或 RegExp 作為 pattern
 * Accepts string or RegExp as pattern
 *
 * 例如 'hello123' 會匹配 stringMatching(/\d+/)
 * For example, 'hello123' matches stringMatching(/\d+/)
 *
 * @example
 * // 基本使用 - RegExp
 * expect('hello123').toEqual(expect.stringMatching(/\d+/));
 * expect('abc').not.toEqual(expect.stringMatching(/\d+/));
 *
 * @example
 * // 使用字串作為 pattern
 * expect('hello').toEqual(expect.stringMatching('hell'));
 * expect('hello').toEqual(expect.stringMatching('^hel'));
 *
 * @example
 * // 複雜的正則表達式
 * expect('user@example.com').toEqual(expect.stringMatching(/@\w+\.\w+/));
 * expect('2024-01-15').toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
 *
 * @example
 * // 使用 not 否定
 * expect('hello').not.toEqual(expect.stringMatching(/\d+/));
 *
 * @example
 * // 在 toMatchObject 中使用
 * expect({ email: 'test@example.com' }).toMatchObject({
 *   email: expect.stringMatching(/@/)
 * });
 */
class StringMatching extends AsymmetricMatcher<RegExp> {
  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 正則表達式或字串（會轉換為 RegExp）/ Regular expression or string (will be converted to RegExp)
   * @param inverse - 是否反向匹配（預設 false）/ Whether to invert matching (default false)
   * @throws 如果 sample 不是字串或 RegExp，拋出 Error / Throws Error if sample is not string or RegExp
   */
  constructor(sample: string | RegExp, inverse = false) {
    if (!isA('String', sample) && !isA('RegExp', sample)) {
      throw new Error('Expected is not a String or a RegExp');
    }
    super(new RegExp(sample), inverse);
  }

  asymmetricMatch(other: unknown) {
    const result = isA<string>('String', other) && this.sample.test(other);

    return this.inverse ? !result : result;
  }

  toString() {
    return `String${this.inverse ? 'Not' : ''}Matching`;
  }

  override getExpectedType() {
    return 'string';
  }
}

/**
 * 匹配在指定精度範圍內的數字（浮點數比較）
 * Matches numbers within a specified precision range (floating-point comparison)
 *
 * 用於解決浮點數精度問題，例如 0.1 + 0.2 !== 0.3
 * Used to solve floating-point precision issues, e.g., 0.1 + 0.2 !== 0.3
 *
 * 預設精度為 2 位小數，可透過第二個參數調整
 * Default precision is 2 decimal places, can be adjusted via second parameter
 *
 * @example
 * // 基本使用 - 預設精度 2
 * expect(0.1 + 0.2).toEqual(expect.closeTo(0.3));        // 0.3 允許範圍: 0.295 ~ 0.305
 * expect(1.001).toEqual(expect.closeTo(1));               // 1 允許範圍: 0.995 ~ 1.005
 *
 * @example
 * // 自訂精度
 * expect(1.001).toEqual(expect.closeTo(1, 3));           // 精度 3: 0.9995 ~ 1.0005
 * expect(1.5).toEqual(expect.closeTo(1.5, 0));           // 精度 0: 1.0 ~ 2.0
 *
 * @example
 * // Infinity 處理
 * expect(Infinity).toEqual(expect.closeTo(Infinity));
 * expect(-Infinity).toEqual(expect.closeTo(-Infinity));
 *
 * @example
 * // 負數
 * expect(-0.1 - 0.2).toEqual(expect.closeTo(-0.3));
 *
 * @example
 * // 使用 not 否定
 * expect(2.0).not.toEqual(expect.closeTo(1.5));
 *
 * @example
 * // 精度範圍示例
 * // precision = 0: ±0.5  (範圍: 0.5 ~ 1.5)
 * // precision = 1: ±0.05 (範圍: 0.95 ~ 1.05)
 * // precision = 2: ±0.005 (範圍: 0.995 ~ 1.005) [預設]
 * // precision = 3: ±0.0005 (範圍: 0.9995 ~ 1.0005)
 */
class CloseTo extends AsymmetricMatcher<number> {
  /** 精度（小數位數）/ Precision (number of decimal places) */
  private readonly precision: number;

  /**
   * 建構函數
   * Constructor
   *
   * @param sample - 期望的數字 / Expected number
   * @param precision - 精度（預設 2）/ Precision (default 2)
   * @param inverse - 是否反向匹配（預設 false）/ Whether to invert matching (default false)
   * @throws 如果 sample 或 precision 不是數字，拋出 Error / Throws Error if sample or precision is not a number
   */
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

  /**
   * 執行匹配邏輯
   * Execute matching logic
   *
   * 使用公式 |a - b| < 10^(-precision) / 2 進行浮點數比較
   * Uses formula |a - b| < 10^(-precision) / 2 for floating-point comparison
   *
   * 特殊處理 Infinity：因為 Infinity - Infinity = NaN，無法直接比較
   * Special handling for Infinity: because Infinity - Infinity = NaN, cannot compare directly
   *
   * @param other - 要進行比對的值 / Value to match against
   * @returns 是否在指定精度範圍內 / Whether within specified precision range
   */
  asymmetricMatch(other: unknown) {
    // 首先檢查 other 是否為數字
    // First check if other is a number
    if (!isA<number>('Number', other)) {
      return false;
    }
    let result = false;
    // 處理正 Infinity 的特殊情況
    // Handle positive Infinity special case
    if (
      other === Number.POSITIVE_INFINITY &&
      this.sample === Number.POSITIVE_INFINITY
    ) {
      // 因為 Infinity - Infinity = NaN，無法用一般方式比較
      // Because Infinity - Infinity = NaN, cannot compare with normal method
      result = true;
    } else if (
      // 處理負 Infinity 的特殊情況
      // Handle negative Infinity special case
      other === Number.NEGATIVE_INFINITY &&
      this.sample === Number.NEGATIVE_INFINITY
    ) {
      result = true;
    } else {
      // 一般數字：使用公式 |a - b| < 10^(-precision) / 2
      // General number: use formula |a - b| < 10^(-precision) / 2
      result =
        Math.abs(this.sample - other) < Math.pow(10, -this.precision) / 2;
    }
    return this.inverse ? !result : result;
  }

  toString() {
    return `Number${this.inverse ? 'Not' : ''}CloseTo`;
  }

  override getExpectedType() {
    return 'number';
  }

  override toAsymmetricMatcher(): string {
    return [
      this.toString(),
      this.sample,
      `(${pluralize('digit', this.precision)})`,
    ].join(' ');
  }
}

/**
 * 工廠函數：建立 Any Matcher
 * Factory function: Create Any Matcher
 *
 * @param expectedObject - 建構函數（如 String, Number）/ Constructor function (e.g., String, Number)
 * @returns Any 實例 / Any instance
 *
 * @example
 * // 匹配任何字串
 * expect('hello').toEqual(any(String));
 *
 * @example
 * // 匹配任何數字
 * expect(123).toEqual(any(Number));
 *
 * @example
 * // 在 toMatchObject 中使用
 * expect({ timestamp: new Date() }).toMatchObject({
 *   timestamp: any(Date)
 * });
 */
export const any = (expectedObject: unknown): Any => new Any(expectedObject);

/**
 * 工廠函數：建立 Anything Matcher
 * Factory function: Create Anything Matcher
 *
 * @returns Anything 實例 / Anything instance
 *
 * @example
 * // 匹配任何非 null/undefined 的值
 * expect(0).toEqual(anything());
 * expect('').toEqual(anything());
 *
 * @example
 * // 忽略特定欄位
 * expect({ id: 1, data: {} }).toMatchObject({
 *   id: anything()
 * });
 */
export const anything = (): Anything => new Anything();

/**
 * 工廠函數：建立 ArrayContaining Matcher
 * Factory function: Create ArrayContaining Matcher
 *
 * @param sample - 要匹配的陣列 / Array to match against
 * @returns ArrayContaining 實例 / ArrayContaining instance
 *
 * @example
 * expect([1, 2, 3]).toEqual(arrayContaining([1, 2]));
 */
export const arrayContaining = (sample: Array<unknown>): ArrayContaining =>
  new ArrayContaining(sample);

/**
 * 工廠函數：建立 ArrayNotContaining Matcher
 * Factory function: Create ArrayNotContaining Matcher
 *
 * @param sample - 要確保不包含的陣列 / Array that should not be contained
 * @returns ArrayContaining 實例（inverse=true）/ ArrayContaining instance (inverse=true)
 *
 * @example
 * expect([1, 2, 3]).not.toEqual(arrayNotContaining([1, 2, 3, 4]));
 */
export const arrayNotContaining = (sample: Array<unknown>): ArrayContaining =>
  new ArrayContaining(sample, true);

/**
 * 工廠函數：建立 ArrayOf Matcher
 * Factory function: Create ArrayOf Matcher
 *
 * @param sample - 要匹配每個元素的單一值 / Single value to match each element against
 * @returns ArrayOf 實例 / ArrayOf instance
 *
 * @example
 * expect([1, 1, 1]).toEqual(arrayOf(1));
 */
export const arrayOf = (sample: unknown): ArrayOf => new ArrayOf(sample);

/**
 * 工廠函數：建立 NotArrayOf Matcher
 * Factory function: Create NotArrayOf Matcher
 *
 * @param sample - 要確保每個元素都不匹配的單一值 / Single value that no element should match
 * @returns ArrayOf 實例（inverse=true）/ ArrayOf instance (inverse=true)
 *
 * @example
 * expect([1, 2, 3]).not.toEqual(notArrayOf(1));
 */
export const notArrayOf = (sample: unknown): ArrayOf =>
  new ArrayOf(sample, true);

/**
 * 工廠函數：建立 ObjectContaining Matcher
 * Factory function: Create ObjectContaining Matcher
 *
 * @param sample - 要匹配的物件 / Object to match against
 * @returns ObjectContaining 實例 / ObjectContaining instance
 *
 * @example
 * expect({ a: 1, b: 2 }).toEqual(objectContaining({ a: 1 }));
 */
export const objectContaining = (
  sample: Record<string, unknown>,
): ObjectContaining => new ObjectContaining(sample);

/**
 * 工廠函數：建立 ObjectNotContaining Matcher
 * Factory function: Create ObjectNotContaining Matcher
 *
 * @param sample - 要確保不包含的鍵值對 / Key-value pairs that should not be contained
 * @returns ObjectContaining 實例（inverse=true）/ ObjectContaining instance (inverse=true)
 *
 * @example
 * expect({ a: 1 }).not.toEqual(objectNotContaining({ a: 1, b: 2 }));
 */
export const objectNotContaining = (
  sample: Record<string, unknown>,
): ObjectContaining => new ObjectContaining(sample, true);

/**
 * 工廠函數：建立 StringContaining Matcher
 * Factory function: Create StringContaining Matcher
 *
 * @param expected - 要匹配的子串 / Substring to match against
 * @returns StringContaining 實例 / StringContaining instance
 *
 * @example
 * expect('Hello World').toEqual(stringContaining('Hello'));
 */
export const stringContaining = (expected: string): StringContaining =>
  new StringContaining(expected);

/**
 * 工廠函數：建立 StringNotContaining Matcher
 * Factory function: Create StringNotContaining Matcher
 *
 * @param expected - 要確保不包含的子串 / Substring that should not be contained
 * @returns StringContaining 實例（inverse=true）/ StringContaining instance (inverse=true)
 *
 * @example
 * expect('Hello').not.toEqual(stringNotContaining('World'));
 */
export const stringNotContaining = (expected: string): StringContaining =>
  new StringContaining(expected, true);

/**
 * 工廠函數：建立 StringMatching Matcher
 * Factory function: Create StringMatching Matcher
 *
 * @param expected - 正則表達式或字串 / Regular expression or string
 * @returns StringMatching 實例 / StringMatching instance
 *
 * @example
 * expect('user@example.com').toEqual(stringMatching(/@\w+\.\w+/));
 */
export const stringMatching = (expected: string | RegExp): StringMatching =>
  new StringMatching(expected);

/**
 * 工廠函數：建立 StringNotMatching Matcher
 * Factory function: Create StringNotMatching Matcher
 *
 * @param expected - 要確保不匹配的正則表達式或字串 / Regular expression or string that should not match
 * @returns StringMatching 實例（inverse=true）/ StringMatching instance (inverse=true)
 *
 * @example
 * expect('hello').not.toEqual(stringNotMatching(/\d+/));
 */
export const stringNotMatching = (expected: string | RegExp): StringMatching =>
  new StringMatching(expected, true);

/**
 * 工廠函數：建立 CloseTo Matcher
 * Factory function: Create CloseTo Matcher
 *
 * @param expected - 期望的數字 / Expected number
 * @param precision - 精度（小數位數，預設 2）/ Precision (decimal places, default 2)
 * @returns CloseTo 實例 / CloseTo instance
 *
 * @example
 * expect(0.1 + 0.2).toEqual(closeTo(0.3));
 */
export const closeTo = (expected: number, precision?: number): CloseTo =>
  new CloseTo(expected, precision);

/**
 * 工廠函數：建立 NotCloseTo Matcher
 * Factory function: Create NotCloseTo Matcher
 *
 * @param expected - 要確保不在範圍內的數字 / Number that should not be within range
 * @param precision - 精度（小數位數，預設 2）/ Precision (decimal places, default 2)
 * @returns CloseTo 實例（inverse=true）/ CloseTo instance (inverse=true)
 *
 * @example
 * expect(2.0).not.toEqual(notCloseTo(1.5));
 */
export const notCloseTo = (expected: number, precision?: number): CloseTo =>
  new CloseTo(expected, precision, true);
