'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getGlobalExpect() {
  if (typeof global !== 'undefined' && global.expect) {
    return global.expect;
  } else if (typeof globalThis !== 'undefined' && globalThis.expect) {
    return globalThis.expect;
  } else if (typeof window !== 'undefined' && window.expect) {
    return window.expect;
  }
}
function jestInstallExpectExtend(matchers, expect) {
  return (expect !== null && expect !== void 0 ? expect : getGlobalExpect()).extend(matchers);
}
function jestAutoInstallExpectExtend(matchers, options) {
  var _options$expect;
  const expect = (_options$expect = options === null || options === void 0 ? void 0 : options.expect) !== null && _options$expect !== void 0 ? _options$expect : getGlobalExpect();
  if (typeof expect !== 'undefined') {
    var _options$cbExists;
    expect.extend(matchers);
    options === null || options === void 0 ? void 0 : (_options$cbExists = options.cbExists) === null || _options$cbExists === void 0 ? void 0 : _options$cbExists.call(options, matchers, options);
  } else {
    var _options$cbNotExists;
    options === null || options === void 0 ? void 0 : (_options$cbNotExists = options.cbNotExists) === null || _options$cbNotExists === void 0 ? void 0 : _options$cbNotExists.call(options, matchers, options);
  }
}

exports["default"] = jestAutoInstallExpectExtend;
exports.getGlobalExpect = getGlobalExpect;
exports.jestAutoInstallExpectExtend = jestAutoInstallExpectExtend;
exports.jestInstallExpectExtend = jestInstallExpectExtend;
//# sourceMappingURL=index.cjs.development.cjs.map
