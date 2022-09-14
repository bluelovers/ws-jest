import { pathExistsSync as t, readFileSync as e, outputFileSync as n } from "fs-extra";

import { join as a, dirname as s, relative as i, resolve as o, basename as r } from "upath2";

import l from "filenamify";

import { EXPECTED_COLOR as f, RECEIVED_COLOR as u, diff as p, matcherHint as h } from "jest-matcher-utils";

import { crlf as c, chkcrlf as m } from "crlf-normalize";

import { pathInsideDirectory as d } from "path-in-dir";

import { findRootLazy as g } from "@yarn-tool/find-root";

var S;

!function(t) {
  t.none = "none", t.new = "new", t.all = "all";
}(S || (S = {}));

const B = {
  expand: !1,
  contextLines: 5,
  aAnnotation: "Snapshot"
};

function isEqual(t, e) {
  return Buffer.isBuffer(t) ? t.equals(e) : t === e;
}

function getBaseSnapshotDirectory(t) {
  return a(s(t.testPath), "__file_snapshots__");
}

function getBaseSnapshotFileName(t) {
  return a(getBaseSnapshotDirectory(t), `${l(t.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${t.assertionCalls}`);
}

function _hintSnapshotFileName(t, e) {
  var n;
  const a = getBaseSnapshotDirectory(t);
  let r, l;
  if (d(e, a) ? l = i(a, e) : (r = g({
    cwd: t.testPath
  }, !1), r && (d(e, r.pkg) ? l = i(r.pkg, e) : d(e, r.root) && (l = i(r.root, e)))), 
  null === (n = l) || void 0 === n || !n.length) {
    let t = g({
      cwd: s(e)
    }, !1);
    l = null != t && t.pkg ? i(o(t.pkg, ".."), e) : e;
  }
  return {
    snapshotFileName: e,
    snapshotDisplayName: l,
    rootData: r
  };
}

function toMatchFile(a, s, i = {}) {
  const {isNot: o, snapshotState: l} = this, p = "toMatchFile", c = null != s ? s : getBaseSnapshotFileName(this), m = _hintSnapshotFileName(this, c).snapshotDisplayName;
  i = {
    diff: Object.assign({}, B, i.diff)
  };
  const d = {
    isNot: o,
    promise: this.promise
  };
  if ("none" === l._updateSnapshot && !t(c)) return l.unmatched++, {
    pass: o,
    message: () => `New output file ${f(m)} was ${u("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${f("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`,
    actual: a,
    name: p
  };
  let g, S = !1, message = () => h(p, void 0, m, d);
  if (t(c)) if (g = e(c, Buffer.isBuffer(a) ? null : "utf8"), o) isEqual(a, g) ? (l.unmatched++, 
  S = !0) : S = !1; else if (isEqual(a, g)) S = !0; else if ("all" === l._updateSnapshot) S = !0, 
  n(c, a), l.updated++; else {
    l.unmatched++;
    const t = _diffHint(g, a, i.diff);
    message = () => h(p, void 0, m, d) + t;
  } else S = !0, o || "new" !== l._updateSnapshot && "all" !== l._updateSnapshot ? (l.unmatched++, 
  message = () => `The output file ${f(r(c))} ${u("doesn't exist")}.`) : (n(c, a), 
  l.added++);
  return {
    pass: S,
    message,
    actual: a,
    expected: g,
    name: p
  };
}

function _diffHint(t, e, n) {
  var a;
  if (Buffer.isBuffer(t) || Buffer.isBuffer(e)) return "";
  null !== (a = n) && void 0 !== a || (n = B);
  let s = [ "" ];
  return c(e) === c(t) ? (s.push("Contents have differences only in line separators"), 
  s.push(p(m(e), m(t)))) : s.push(p(e, t, n)), s.join("\n\n");
}

var _ = {
  toMatchFile
};

export { S as EnumUpdateSnapshot, _diffHint, _hintSnapshotFileName, _ as default, getBaseSnapshotDirectory, getBaseSnapshotFileName, toMatchFile };
//# sourceMappingURL=index.esm.mjs.map
