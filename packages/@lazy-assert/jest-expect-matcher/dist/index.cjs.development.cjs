'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/// <reference types="jest" />
/// <reference types="expect" />

const SymbolTypeofAsymmetricMatcher = /*#__PURE__*/Symbol.for('jest.asymmetricMatcher');
/**
 * 要製作一個能像 expect.any() 或 expect.stringMatching() 這樣放在物件屬性中的匹配器，
 * 你不需要使用 expect.extend（那是用來做斷言的），
 * 而是要定義一個 符合 Jest 內部協議的類別或物件。
 *
 * 核心原理：asymmetricMatch 協議
 * Jest 在比對物件時，會檢查屬性值是否包含一個名為 asymmetricMatch 的方法。
 * 如果有，它就會呼叫該方法並傳入 actual 值。
 *
 * @see '@types/jest'
 */

function _isAsymmetricMatcher(matcher) {
  return typeof (matcher === null || matcher === void 0 ? void 0 : matcher.asymmetricMatch) === 'function';
}
/**
 * 概念：建立一個「容器」Matcher
 *
 * 我們可以製作一個 `expect.all()` 或 `expect.anyOf()`，
 * 讓它內部去呼叫其他 Matcher 的 `asymmetricMatch` 方法。
 *
 * 實作「聯集 (OR)」：expect.anyOf
 * 這能解決：「可以是字串 OR 也可以是 null」 的問題。
 *
 * 這種做法的好處是完全解耦。
 * 你不需要為每一種組合（如 NullableString、NullableNumber）都寫一個新的 Matcher，而是像樂高一樣組裝
 * 可串接原生 Matcher 與常數
 *
 * @example
 * // Nullable String:
 * anyOf([expect.any(String), null])
 * // Optional Number:
 * anyOf([expect.any(Number), undefined])
 * // 特定範圍或 Null:
 * anyOf([expect.stringMatching(/v1/), null])
 */
const anyOf = matchers => ({
  asymmetricMatch: actual => matchers.some(matcher => {
    if (_isAsymmetricMatcher(matcher)) {
      return matcher.asymmetricMatch(actual);
    }
    return actual === matcher;
  }),
  toString: () => `AnyOf(${matchers.map(m => {
    var _m$toString;
    return ((_m$toString = m.toString) === null || _m$toString === void 0 ? void 0 : _m$toString.call(m)) || m;
  }).join(', ')})`
});
const allOf = matchers => ({
  asymmetricMatch: actual => matchers.every(matcher => {
    if (_isAsymmetricMatcher(matcher)) {
      return matcher.asymmetricMatch(actual);
    }
    return actual === matcher;
  }),
  toString: () => `AllOf(${matchers.map(m => {
    var _m$toString2;
    return ((_m$toString2 = m.toString) === null || _m$toString2 === void 0 ? void 0 : _m$toString2.call(m)) || m;
  }).join(', ')})`
});

exports.SymbolTypeofAsymmetricMatcher = SymbolTypeofAsymmetricMatcher;
exports._isAsymmetricMatcher = _isAsymmetricMatcher;
exports.allOf = allOf;
exports.anyOf = anyOf;
//# sourceMappingURL=index.cjs.development.cjs.map
