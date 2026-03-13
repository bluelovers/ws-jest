'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 取得全域 expect 物件
 * Get global expect object
 *
 * 依序檢查 global、globalThis、window 物件
 * Checks global, globalThis, window objects in order
 *
 * @returns Jest expect 物件 / Jest expect object
 */
function getGlobalExpect() {
  // @ts-ignore
  if (typeof global !== 'undefined' && global.expect) {
    // @ts-ignore
    return global.expect;
  }
  // @ts-ignore
  else if (typeof globalThis !== 'undefined' && globalThis.expect) {
    // @ts-ignore
    return globalThis.expect;
  }
  // @ts-ignore
  else if (typeof window !== 'undefined' && window.expect) {
    // @ts-ignore
    return window.expect;
  }
}
/**
 * 安裝 Jest 擴展匹配器
 * Install Jest extend matchers
 *
 * @param matchers - 匹配器映射表 / Matchers map
 * @param expect - 可選的 expect 實例 / Optional expect instance
 * @returns 擴展後的 expect / Extended expect
 */
function jestInstallExpectExtend(matchers, expect) {
  return (expect !== null && expect !== void 0 ? expect : getGlobalExpect()).extend(matchers);
}
/**
 * 自動安裝 Jest 擴展匹配器
 * Auto-install Jest extend matchers
 *
 * 若 expect 存在則自動安裝，否則呼叫回調函數
 * Automatically installs if expect exists, otherwise calls callback
 *
 * @param matchers - 匹配器映射表 / Matchers map
 * @param options - 安裝選項 / Installation options
 */
function jestAutoInstallExpectExtend(matchers, options) {
  var _options$expect;
  const expect = (_options$expect = options === null || options === void 0 ? void 0 : options.expect) !== null && _options$expect !== void 0 ? _options$expect : getGlobalExpect();
  if (typeof expect !== 'undefined') {
    var _options$cbExists;
    expect.extend(matchers);
    options === null || options === void 0 || (_options$cbExists = options.cbExists) === null || _options$cbExists === void 0 || _options$cbExists.call(options, matchers, options);
  } else {
    var _options$cbNotExists;
    options === null || options === void 0 || (_options$cbNotExists = options.cbNotExists) === null || _options$cbNotExists === void 0 || _options$cbNotExists.call(options, matchers, options);
  }
}

exports.default = jestAutoInstallExpectExtend;
exports.getGlobalExpect = getGlobalExpect;
exports.jestAutoInstallExpectExtend = jestAutoInstallExpectExtend;
exports.jestInstallExpectExtend = jestInstallExpectExtend;
//# sourceMappingURL=index.cjs.development.cjs.map
