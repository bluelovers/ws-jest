/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @see TEST_ANALYSIS.md - 測試分析文檔，說明如何自定義 Matcher / Test analysis document
 * @see README.md - Asymmetric Matchers 原始碼分析 / Source code analysis
 */

import type {Tester} from '@jest/expect-utils';
import {getType} from '@jest/get-type';
import {AsymmetricMatcher} from './asymmetricMatchers';
import type {
  Expect,
  MatcherState,
  MatchersObject,
  SyncExpectationResult,
} from './types';

// Global matchers object holds the list of available matchers and
// the state, that can hold matcher specific values that change over time.

/**
 * 用於存取全域匹配器對象的 Symbol
 * Symbol for accessing the global matchers object
 *
 * 此 Symbol 在 globalThis 上建立唯一的匹配器存儲區
 * This Symbol creates a unique matcher storage on globalThis
 *
 * @example
 * // 內部使用：取得匹配器對象
 * const matchers = globalThis[Symbol.for('$$jest-matchers-object')];
 * console.log(matchers.state.assertionCalls);
 */
const JEST_MATCHERS_OBJECT = Symbol.for('$$jest-matchers-object');

/**
 * 標記內部/內建 Jest 匹配器的 Symbol
 * Symbol for marking internal/built-in Jest matchers
 *
 * Jest 可能會覆蓋內部匹配器拋出的錯誤堆疊追蹤
 * Jest may override stack traces of errors thrown by internal matchers
 *
 * @example
 * // 檢查是否為內部匹配器
 * const myMatcher = () => ({ pass: true, message: () => '' });
 * Object.defineProperty(myMatcher, INTERNAL_MATCHER_FLAG, { value: true });
 * console.log(myMatcher[INTERNAL_MATCHER_FLAG]); // true
 */
export const INTERNAL_MATCHER_FLAG = Symbol.for('$$jest-internal-matcher');

/**
 * 初始化全域匹配器對象
 * Initialize global matchers object
 *
 * @internal
 * 這個初始化塊確保 Jest 的匹配器系統在 globalThis 上正確設置
 * This initialization block ensures Jest's matcher system is properly set up on globalThis
 *
 * 初始化內容包括：
 * - customEqualityTesters: 用於自定義相等性比較的測試器陣列
 * - matchers: 儲存所有已註冊的 matchers（使用 Object.create(null) 避免原型鏈問題）
 * - state: 斷言系統的執行時狀態
 *
 * Initialization includes:
 * - customEqualityTesters: array of testers for custom equality comparison
 * - matchers: storage for all registered matchers (using Object.create(null) to avoid prototype chain issues)
 * - state: runtime state of the assertion system
 */
if (!Object.prototype.hasOwnProperty.call(globalThis, JEST_MATCHERS_OBJECT)) {
  // 定義預設狀態
  // Define default state
  const defaultState: MatcherState = {
    assertionCalls: 0,           // 斷言調用次數 / Number of assertion calls
    expectedAssertionsNumber: null,  // 期望的斷言數量 / Expected number of assertions
    isExpectingAssertions: false,    // 是否期望有斷言 / Whether expecting assertions
    numPassingAsserts: 0,           // 通過的斷言數量 / Number of passing assertions
    suppressedErrors: [],          // 不立即拋出的錯誤 / Errors that are not thrown immediately
  };
  
  // 使用 Object.defineProperty 確保屬性不可枚舉且不可變更
  // Use Object.defineProperty to ensure property is non-enumerable and immutable
  Object.defineProperty(globalThis, JEST_MATCHERS_OBJECT, {
    value: {
      customEqualityTesters: [],    // 自定義相等性測試器 / Custom equality testers
      matchers: Object.create(null), // 匹配器對象（無原型）/ Matchers object (no prototype)
      state: defaultState,           // 預設狀態 / Default state
    },
  });
}

/**
 * 取得目前的 Matcher 狀態
 * Get current matcher state
 *
 * @returns Matcher 狀態物件 / Matcher state object
 *
 * @example
 * // 取得當前狀態
 * const state = getState();
 * console.log(state.assertionCalls);    // 斷言調用次數
 * console.log(state.numPassingAsserts); // 通過的斷言數量
 *
 * @example
 * // 在自定義 matcher 中取得狀態
 * function myMatcher(actual) {
 *   const state = getState();
 *   console.log('Current test:', state.currentTestName);
 *   return { pass: true, message: () => 'OK' };
 * }
 */
export const getState = <State extends MatcherState = MatcherState>(): State =>
  (globalThis as any)[JEST_MATCHERS_OBJECT].state;

/**
 * 設定 Matcher 狀態
 * Set matcher state
 *
 * @param state - 要更新的狀態 Partial<MatcherState> / State to update
 *
 * @example
 * // 設定預期的斷言數量
 * setState({ expectedAssertionsNumber: 3 });
 *
 * @example
 * // 標記正在期待斷言
 * setState({ isExpectingAssertions: true });
 *
 * @example
 * // 新增被抑制的錯誤
 * setState({ suppressedErrors: [new Error('test')] });
 */
export const setState = <State extends MatcherState = MatcherState>(
  state: Partial<State>,
): void => {
  Object.assign((globalThis as any)[JEST_MATCHERS_OBJECT].state, state);
};

/**
 * 取得已註冊的 matchers 物件
 * Get registered matchers object
 *
 * @returns 所有已註冊的 matchers / All registered matchers
 *
 * @example
 * // 取得所有 matchers
 * const matchers = getMatchers();
 * console.log(Object.keys(matchers)); // ['toBe', 'toEqual', ...]
 *
 * @example
 * // 檢查特定 matcher 是否存在
 * const matchers = getMatchers();
 * if (matchers.toBe) {
 *   console.log('toBe matcher is registered');
 * }
 */
export const getMatchers = (): MatchersObject =>
  (globalThis as any)[JEST_MATCHERS_OBJECT].matchers;

/**
 * 註冊自定義 matchers
 * Register custom matchers
 *
 * @internal
 * 此函數執行以下操作：
 * 1. 驗證每個 matcher 都是函數
 * 2. 標記 matcher 為內部或外部
 * 3. 為非內部 matcher 創建 AsymmetricMatcher 包裝類
 * 4. 將 matcher 註冊到 expect 和 expect.not
 *
 * This function performs the following operations:
 * 1. Validates each matcher is a function
 * 2. Marks matcher as internal or external
 * 3. Creates AsymmetricMatcher wrapper class for non-internal matchers
 * 4. Registers matcher to expect and expect.not
 *
 * @param matchers - 要註冊的 matchers 物件 / Matchers object to register
 * @param isInternal - 是否為內部 matcher / Whether it's an internal matcher
 * @param expect - expect 函數 / expect function
 */
export const setMatchers = (
  matchers: MatchersObject,
  isInternal: boolean,
  expect: Expect,
): void => {
  // 遍歷所有要註冊的 matchers
  // Iterate through all matchers to register
  for (const key of Object.keys(matchers)) {
    const matcher = matchers[key];

    // 驗證 matcher 是函數
    // Validate matcher is a function
    if (typeof matcher !== 'function') {
      throw new TypeError(
        `expect.extend: \`${key}\` is not a valid matcher. Must be a function, is "${getType(
          matcher,
        )}"`,
      );
    }

    // 標記 matcher 是否為內部匹配器
    // Mark whether matcher is an internal matcher
    Object.defineProperty(matcher, INTERNAL_MATCHER_FLAG, {
      value: isInternal,
    });

    // 如果不是內部 matcher，為其創建 AsymmetricMatcher 包裝類
    // If not internal matcher, create AsymmetricMatcher wrapper class
    if (!isInternal) {
      // expect is defined

      class CustomMatcher extends AsymmetricMatcher<
        [unknown, ...Array<unknown>]
      > {
        constructor(inverse = false, ...sample: [unknown, ...Array<unknown>]) {
          super(sample, inverse);
        }

        asymmetricMatch(other: unknown) {
          const {pass} = matcher.call(
            this.getMatcherContext(),
            other,
            ...this.sample,
          ) as SyncExpectationResult;

          return this.inverse ? !pass : pass;
        }

        toString() {
          return `${this.inverse ? 'not.' : ''}${key}`;
        }

        override getExpectedType() {
          return 'any';
        }

        override toAsymmetricMatcher() {
          return `${this.toString()}<${this.sample.map(String).join(', ')}>`;
        }
      }

      Object.defineProperty(expect, key, {
        configurable: true,
        enumerable: true,
        value: (...sample: [unknown, ...Array<unknown>]) =>
          new CustomMatcher(false, ...sample),
        writable: true,
      });
      Object.defineProperty(expect.not, key, {
        configurable: true,
        enumerable: true,
        value: (...sample: [unknown, ...Array<unknown>]) =>
          new CustomMatcher(true, ...sample),
        writable: true,
      });
    }
  }

  Object.assign((globalThis as any)[JEST_MATCHERS_OBJECT].matchers, matchers);
};

/**
 * 取得自定義相等性測試器陣列
 * Get custom equality testers array
 *
 * @returns 自定義相等性測試器陣列 / Custom equality testers array
 *
 * @example
 * // 取得自定義測試器
 * const testers = getCustomEqualityTesters();
 * console.log('Number of custom testers:', testers.length);
 *
 * @example
 * // 在自定義 matcher 中使用
 * function myMatcher(actual, expected) {
 *   const customTesters = getCustomEqualityTesters();
 *   // 使用自定義測試器進行深度比較
 *   const pass = equals(actual, expected, customTesters);
 *   return { pass, message: () => pass ? 'OK' : 'Fail' };
 * }
 */
export const getCustomEqualityTesters = (): Array<Tester> =>
  (globalThis as any)[JEST_MATCHERS_OBJECT].customEqualityTesters;

/**
 * 新增自定義相等性測試器
 * Add custom equality testers
 *
 * @param newTesters - 要新增的測試器陣列 / Array of testers to add
 * @throws 如果傳入的不是陣列，拋出 TypeError / Throws TypeError if not an array
 *
 * @example
 * // 新增自定義相等性測試器
 * addCustomEqualityTesters([
 *   // 自定義陣列相等性測試
 *   (a, b) => {
 *     if (Array.isArray(a) && Array.isArray(b)) {
 *       return a.length === b.length ? undefined : false;
 *     }
 *     return undefined; // 不處理，回退到預設比較
 *   }
 * ]);
 *
 * @example
 * // 新增物件 ID 比較測試器
 * addCustomEqualityTesters([
 *   (a, b) => {
 *     if (a?.id !== undefined && b?.id !== undefined) {
 *       return a.id === b.id ? true : false;
 *     }
 *     return undefined;
 *   }
 * ]);
 */
export const addCustomEqualityTesters = (newTesters: Array<Tester>): void => {
  if (!Array.isArray(newTesters)) {
    throw new TypeError(
      `expect.customEqualityTesters: Must be set to an array of Testers. Was given "${getType(
        newTesters,
      )}"`,
    );
  }

  (globalThis as any)[JEST_MATCHERS_OBJECT].customEqualityTesters.push(
    ...newTesters,
  );
};
