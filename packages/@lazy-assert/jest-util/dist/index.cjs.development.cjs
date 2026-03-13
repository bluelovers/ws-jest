'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');

/**
 * 處理 Jest 匹配器提示選項
 * Handle Jest matcher hint options
 *
 * 自動設定 isNot、promise 等上下文相關選項
 * Automatically sets context-related options like isNot, promise
 *
 * @param context - 匹配器上下文 / Matcher context
 * @param options - 選項物件 / Options object
 * @returns 處理後的選項 / Processed options
 */
function handleJestMatcherHintOptions(context, options) {
  var _options, _options$secondArgume;
  options !== null && options !== void 0 ? options : options = {};
  options.isNot = context.isNot;
  options.promise = context.promise;
  (_options$secondArgume = (_options = options).secondArgumentColor) !== null && _options$secondArgume !== void 0 ? _options$secondArgume : _options.secondArgumentColor = arg => arg;
  return options;
}
/**
 * 產生通過訊息（用於 .not 斷言）
 * Generate pass message (for .not assertions)
 *
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
function passMessage(received, matcherName, type) {
  return () => jestMatcherUtils.matcherHint(`.not.${matcherName}`, 'received', '') + '\n\n' + `Expected value to not be a ${type} received:\n` + `  ${jestMatcherUtils.printReceived(received)}`;
}
/**
 * 產生失敗訊息
 * Generate fail message
 *
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
function failMessage(received, matcherName, type) {
  return () => jestMatcherUtils.matcherHint(`.${matcherName}`, 'received', '') + '\n\n' + `Expected value to be a ${type} received:\n` + `  ${jestMatcherUtils.printReceived(received)}`;
}
/**
 * 自動選擇並產生對應的訊息
 * Automatically select and generate appropriate message
 *
 * 根據通過與否自動選擇使用通過或失敗訊息
 * Automatically chooses pass or fail message based on result
 *
 * @param pass - 是否通過 / Whether passed
 * @param received - 實際接收值 / Received value
 * @param matcherName - 匹配器名稱 / Matcher name
 * @param type - 類型名稱 / Type name
 * @returns 訊息產生函數 / Message generator function
 */
function autoMessage(pass, received, matcherName, type) {
  return pass ? passMessage(received, matcherName, type) : failMessage(received, matcherName, type);
}

exports.autoMessage = autoMessage;
exports.failMessage = failMessage;
exports.handleJestMatcherHintOptions = handleJestMatcherHintOptions;
exports.passMessage = passMessage;
//# sourceMappingURL=index.cjs.development.cjs.map
