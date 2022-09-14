'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');
var crlfNormalize = require('crlf-normalize');

exports.EnumDiffMessage = void 0;

(function (EnumDiffMessage) {
  EnumDiffMessage["LINE_SEPARATORS"] = "Contents have differences only in line separators";
})(exports.EnumDiffMessage || (exports.EnumDiffMessage = {}));

function _stringDiffCore(received, expected, options) {
  const difference = [''];

  if (crlfNormalize.crlf(expected) === crlfNormalize.crlf(received)) {
    difference.push("Contents have differences only in line separators");
    difference.push(jestMatcherUtils.diff(crlfNormalize.chkcrlf(expected), crlfNormalize.chkcrlf(received)));
  } else {
    difference.push(jestMatcherUtils.diff(expected, received, options));
  }

  return difference;
}
function _stringDiff(received, expected, options) {
  return _stringDiffCore(received, expected, options).join("\n" + "\n");
}

exports._stringDiff = _stringDiff;
exports._stringDiffCore = _stringDiffCore;
//# sourceMappingURL=index.cjs.development.cjs.map
