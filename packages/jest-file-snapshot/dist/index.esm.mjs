import { pathExistsSync as t, readFileSync as e, outputFileSync as a } from "fs-extra";

import { join as n, dirname as s, relative as i, resolve as o, normalize as r } from "upath2";

import l from "filenamify";

import { EXPECTED_COLOR as f, RECEIVED_COLOR as p, matcherHint as u } from "jest-matcher-utils";

import { pathInsideDirectory as h } from "path-in-dir";

import { findRootLazy as c } from "@yarn-tool/find-root";

import { handleJestMatcherHintOptions as d } from "@lazy-assert/jest-util";

import { _stringDiff as m } from "@lazy-assert/jest-diff";

const _ = {
  expand: !1,
  contextLines: 5,
  aAnnotation: "Snapshot"
};

function getBaseSnapshotDirectory(t) {
  return n(s(t.testPath), "__file_snapshots__");
}

function getBaseSnapshotFileName(t) {
  return n(getBaseSnapshotDirectory(t), `${l(t.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${t.assertionCalls}`);
}

function _hintSnapshotFileName(t, e) {
  var a;
  const n = getBaseSnapshotDirectory(t);
  let r, l, f;
  var p, u;
  if (h(e, n) ? (l = i(n, e), f = !0) : (r = c({
    cwd: t.testPath
  }, !1), r && (h(e, r.pkg) ? (l = i(r.pkg, e), f = !0) : h(e, r.root) && (l = i(r.root, e), 
  f = !0)), null !== (p = l) && void 0 !== p && p.length || null === (u = t.snapshotState) || void 0 === u || null === (u = u._rootDir) || void 0 === u || !u.length || !h(e, t.snapshotState._rootDir) || (l = i(t.snapshotState._rootDir, e), 
  f = !0)), null === (a = l) || void 0 === a || !a.length) {
    let t = c({
      cwd: s(e)
    }, !1);
    l = null != t && t.pkg ? i(o(t.pkg, ".."), e) : e;
  }
  return f = f && e.includes("/__file_snapshots__/"), {
    snapshotFileName: e,
    snapshotDisplayName: l,
    rootData: r,
    safeUpdateSnapshot: f
  };
}

function toMatchFile(n, s, i = {}) {
  const {isNot: o, snapshotState: l} = this, h = "toMatchFile", c = r(null != s ? s : getBaseSnapshotFileName(this)), {snapshotDisplayName: m, safeUpdateSnapshot: S} = _hintSnapshotFileName(this, c);
  i = {
    diff: Object.assign({}, _, i.diff)
  };
  const g = d(this);
  if ("none" === l._updateSnapshot && !t(c)) return l.unmatched++, {
    pass: o,
    message: () => `New output file ${f(m)} was ${p("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${f("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`,
    actual: n,
    name: h
  };
  let B, y = o, message = () => u(h, void 0, m, g);
  if (t(c)) if (B = e(c, Buffer.isBuffer(n) ? null : "utf8"), function isEqual(t, e) {
    return Buffer.isBuffer(t) ? t.equals(e) : t === e;
  }(n, B) !== o) y = !o; else if (o) l.unmatched++; else if (S && "all" === l._updateSnapshot) y = !o, 
  a(c, n), l.updated++; else {
    l.unmatched++;
    const t = _diffHint(B, n, i.diff);
    message = () => u(h, void 0, m, g) + t;
  } else !S || o || "new" !== l._updateSnapshot && "all" !== l._updateSnapshot ? (l.unmatched++, 
  message = () => `The output file ${f(m)} ${p("doesn't exist")}.`) : (y = !o, a(c, n), 
  l.added++);
  return {
    pass: y,
    message,
    actual: n,
    expected: B,
    name: h
  };
}

function _diffHint(t, e, a) {
  return Buffer.isBuffer(t) || Buffer.isBuffer(e) ? "" : m(t, e, null != a ? a : _);
}

var S = {
  toMatchFile
};

export { _diffHint, _hintSnapshotFileName, S as default, getBaseSnapshotDirectory, getBaseSnapshotFileName, toMatchFile };
//# sourceMappingURL=index.esm.mjs.map
