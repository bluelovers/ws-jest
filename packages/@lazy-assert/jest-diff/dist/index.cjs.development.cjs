'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');
var crlfNormalize = require('crlf-normalize');

let EnumDiffMessage = /*#__PURE__*/function (EnumDiffMessage) {
  EnumDiffMessage["LINE_SEPARATORS"] = "Contents have differences only in line separators";
  return EnumDiffMessage;
}({});
/**
 * 核心字串差異比較函式
 * Core string difference comparison function
 *
 * 檢測行分隔符號（CRLF/LF）差異，若僅有行分隔符號不同則顯示特殊訊息
 * Detects line separator (CRLF/LF) differences, shows special message if only line separators differ
 *
 * @param received - 實際接收到的字串 / Received string
 * @param expected - 預期的字串 / Expected string
 * @param options - Jest 差異比較選項 / Jest diff options
 * @returns 差異訊息陣列 / Array of difference messages
 */
function _stringDiffCore(received, expected, options) {
  const difference = [''];
  if (crlfNormalize.crlf(expected) === crlfNormalize.crlf(received)) {
    difference.push(EnumDiffMessage.LINE_SEPARATORS);
    difference.push(jestMatcherUtils.diff(crlfNormalize.chkcrlf(expected), crlfNormalize.chkcrlf(received)));
  } else {
    difference.push(jestMatcherUtils.diff(expected, received, options));
  }
  return difference;
}
/**
 * 取得格式化的字串差異結果
 * Get formatted string difference result
 *
 * 將差異陣列以雙換行符號連接成單一字串
 * Joins difference array into single string with double line breaks
 *
 * @param received - 實際接收到的字串 / Received string
 * @param expected - 預期的字串 / Expected string
 * @param options - Jest 差異比較選項 / Jest diff options
 * @returns 格式化的差異字串 / Formatted difference string
 */
function _stringDiff(received, expected, options) {
  return _stringDiffCore(received, expected, options).join(crlfNormalize.EnumLineBreak.LF + crlfNormalize.EnumLineBreak.LF);
}

exports.EnumDiffMessage = EnumDiffMessage;
exports._stringDiff = _stringDiff;
exports._stringDiffCore = _stringDiffCore;
//# sourceMappingURL=index.cjs.development.cjs.map
