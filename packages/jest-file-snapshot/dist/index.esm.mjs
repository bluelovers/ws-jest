import { pathExistsSync as t, readFileSync as e, outputFileSync as a } from "fs-extra";

import { join as s, dirname as n, relative as o, resolve as i, normalize as r } from "upath2";

import l from "filenamify";

import { EXPECTED_COLOR as f, RECEIVED_COLOR as p, matcherHint as u } from "jest-matcher-utils";

import { pathInsideDirectory as h } from "path-in-dir";

import { findRootLazy as m } from "@yarn-tool/find-root";

import { EnumUpdateSnapshot as c } from "@lazy-assert/jest-global-types-extra";

import { handleJestMatcherHintOptions as d } from "@lazy-assert/jest-util";

import { _stringDiff as _ } from "@lazy-assert/jest-diff";

const g = {
  expand: !1,
  contextLines: 5,
  aAnnotation: "Snapshot"
};

function getBaseSnapshotDirectory(t) {
  return s(n(t.testPath), "__file_snapshots__");
}

function getBaseSnapshotFileName(t) {
  return s(getBaseSnapshotDirectory(t), `${l(t.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${t.assertionCalls}`);
}

function _hintSnapshotFileName(t, e) {
  var a;
  const s = getBaseSnapshotDirectory(t);
  let r, l, f;
  var p, u;
  if (h(e, s) ? (l = o(s, e), f = !0) : (r = m({
    cwd: t.testPath
  }, !1), r && (h(e, r.pkg) ? (l = o(r.pkg, e), f = !0) : h(e, r.root) && (l = o(r.root, e), 
  f = !0)), null !== (p = l) && void 0 !== p && p.length || null === (u = t.snapshotState) || void 0 === u || null === (u = u._rootDir) || void 0 === u || !u.length || !h(e, t.snapshotState._rootDir) || (l = o(t.snapshotState._rootDir, e), 
  f = !0)), null === (a = l) || void 0 === a || !a.length) {
    let t = m({
      cwd: n(e)
    }, !1);
    l = null != t && t.pkg ? o(i(t.pkg, ".."), e) : e;
  }
  return f = f && e.includes("/__file_snapshots__/"), {
    snapshotFileName: e,
    snapshotDisplayName: l,
    rootData: r,
    safeUpdateSnapshot: f
  };
}

function toMatchFile(s, n, o = {}) {
  const {isNot: i, snapshotState: l} = this, h = "toMatchFile", m = r(null != n ? n : getBaseSnapshotFileName(this)), {snapshotDisplayName: _, safeUpdateSnapshot: S} = _hintSnapshotFileName(this, m);
  o = {
    diff: Object.assign({}, g, o.diff)
  };
  const y = d(this);
  if (l._updateSnapshot === c.none && !t(m)) return l.unmatched++, {
    pass: i,
    message: () => `New output file ${f(_)} was ${p("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${f("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`,
    actual: s,
    name: h
  };
  let B, F = i, message = () => u(h, void 0, _, y);
  if (t(m)) if (B = e(m, Buffer.isBuffer(s) ? null : "utf8"), function isEqual(t, e) {
    return Buffer.isBuffer(t) ? t.equals(e) : t === e;
  }(s, B) !== i) F = !i; else if (i) l.unmatched++; else if (S && l._updateSnapshot === c.all) F = !i, 
  a(m, s), l.updated++; else {
    l.unmatched++;
    const t = _diffHint(B, s, o.diff);
    message = () => u(h, void 0, _, y) + t;
  } else !S || i || l._updateSnapshot !== c.new && l._updateSnapshot !== c.all ? (l.unmatched++, 
  message = () => `The output file ${f(_)} ${p("doesn't exist")}.`) : (F = !i, a(m, s), 
  l.added++);
  return {
    pass: F,
    message,
    actual: s,
    expected: B,
    name: h
  };
}

function _diffHint(t, e, a) {
  return Buffer.isBuffer(t) || Buffer.isBuffer(e) ? "" : _(t, e, null != a ? a : g);
}

var S = {
  toMatchFile
};

export { _diffHint, _hintSnapshotFileName, S as default, getBaseSnapshotDirectory, getBaseSnapshotFileName, toMatchFile };
//# sourceMappingURL=index.esm.mjs.map
