import { matcherHint as e, printReceived as s } from "jest-matcher-utils";

function handleJestMatcherHintOptions(e, s) {
  var t, n;
  return null != s || (s = {}), s.isNot = e.isNot, s.promise = e.promise, null !== (n = (t = s).secondArgumentColor) && void 0 !== n || (t.secondArgumentColor = e => e), 
  s;
}

function passMessage(t, n, a) {
  return () => e(`.not.${n}`, "received", "") + "\n\n" + `Expected value to not be a ${a} received:\n` + `  ${s(t)}`;
}

function failMessage(t, n, a) {
  return () => e(`.${n}`, "received", "") + "\n\n" + `Expected value to be a ${a} received:\n` + `  ${s(t)}`;
}

function autoMessage(e, s, t, n) {
  return e ? passMessage(s, t, n) : failMessage(s, t, n);
}

export { autoMessage, failMessage, handleJestMatcherHintOptions, passMessage };
//# sourceMappingURL=index.esm.mjs.map
