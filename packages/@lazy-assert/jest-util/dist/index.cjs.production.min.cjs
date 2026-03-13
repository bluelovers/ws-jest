"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("jest-matcher-utils");

function passMessage(s, t, n) {
  return () => e.matcherHint(`.not.${t}`, "received", "") + "\n\n" + `Expected value to not be a ${n} received:\n` + `  ${e.printReceived(s)}`;
}

function failMessage(s, t, n) {
  return () => e.matcherHint(`.${t}`, "received", "") + "\n\n" + `Expected value to be a ${n} received:\n` + `  ${e.printReceived(s)}`;
}

exports.autoMessage = function autoMessage(e, s, t, n) {
  return e ? passMessage(s, t, n) : failMessage(s, t, n);
}, exports.failMessage = failMessage, exports.handleJestMatcherHintOptions = function handleJestMatcherHintOptions(e, s) {
  var t, n;
  return null != s || (s = {}), s.isNot = e.isNot, s.promise = e.promise, null !== (n = (t = s).secondArgumentColor) && void 0 !== n || (t.secondArgumentColor = e => e), 
  s;
}, exports.passMessage = passMessage;
//# sourceMappingURL=index.cjs.production.min.cjs.map
