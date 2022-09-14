'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestMatcherUtils = require('jest-matcher-utils');

function handleJestMatcherHintOptions(context, options) {
  var _options, _options2, _options2$secondArgum;

  (_options = options) !== null && _options !== void 0 ? _options : options = {};
  options.isNot = context.isNot;
  options.promise = context.promise;
  (_options2$secondArgum = (_options2 = options).secondArgumentColor) !== null && _options2$secondArgum !== void 0 ? _options2$secondArgum : _options2.secondArgumentColor = arg => arg;
  return options;
}
function passMessage(received, matcherName, type) {
  return () => jestMatcherUtils.matcherHint(`.not.${matcherName}`, 'received', '') + '\n\n' + `Expected value to not be a ${type} received:\n` + `  ${jestMatcherUtils.printReceived(received)}`;
}
function failMessage(received, matcherName, type) {
  return () => jestMatcherUtils.matcherHint(`.${matcherName}`, 'received', '') + '\n\n' + `Expected value to be a ${type} received:\n` + `  ${jestMatcherUtils.printReceived(received)}`;
}
function autoMessage(pass, received, matcherName, type) {
  return pass ? passMessage(received, matcherName, type) : failMessage(received, matcherName, type);
}

exports.autoMessage = autoMessage;
exports.failMessage = failMessage;
exports.handleJestMatcherHintOptions = handleJestMatcherHintOptions;
exports.passMessage = passMessage;
//# sourceMappingURL=index.cjs.development.cjs.map
