import { matcherHint as e, printReceived as s } from "jest-matcher-utils";

function handleJestMatcherHintOptions(e, s) {
  var t, n, o;
  return null !== (t = s) && void 0 !== t || (s = {}), s.isNot = e.isNot, s.promise = e.promise, 
  null !== (o = (n = s).secondArgumentColor) && void 0 !== o || (n.secondArgumentColor = e => e), 
  s;
}

function passMessage(t, n, o) {
  return () => e(`.not.${n}`, "received", "") + "\n\n" + `Expected value to not be a ${o} received:\n` + `  ${s(t)}`;
}

function failMessage(t, n, o) {
  return () => e(`.${n}`, "received", "") + "\n\n" + `Expected value to be a ${o} received:\n` + `  ${s(t)}`;
}

function autoMessage(e, s, t, n) {
  return e ? passMessage(s, t, n) : failMessage(s, t, n);
}

export { autoMessage, failMessage, handleJestMatcherHintOptions, passMessage };
//# sourceMappingURL=index.esm.mjs.map
