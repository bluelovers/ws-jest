"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var t = require("fs-extra"), e = require("upath2"), a = require("filenamify"), n = require("jest-matcher-utils"), s = require("path-in-dir"), i = require("@yarn-tool/find-root"), o = require("@lazy-assert/jest-global-types-extra"), r = require("@lazy-assert/jest-util"), l = require("@lazy-assert/jest-diff");

const p = {
  expand: !1,
  contextLines: 5,
  aAnnotation: "Snapshot"
};

function getBaseSnapshotDirectory(t) {
  return e.join(e.dirname(t.testPath), "__file_snapshots__");
}

function getBaseSnapshotFileName(t) {
  return e.join(getBaseSnapshotDirectory(t), `${a(t.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${t.assertionCalls}`);
}

function _hintSnapshotFileName(t, a) {
  var n;
  const o = getBaseSnapshotDirectory(t);
  let r, l, p;
  var u, h;
  if (s.pathInsideDirectory(a, o) ? (l = e.relative(o, a), p = !0) : (r = i.findRootLazy({
    cwd: t.testPath
  }, !1), r && (s.pathInsideDirectory(a, r.pkg) ? (l = e.relative(r.pkg, a), p = !0) : s.pathInsideDirectory(a, r.root) && (l = e.relative(r.root, a), 
  p = !0)), null !== (u = l) && void 0 !== u && u.length || null === (h = t.snapshotState) || void 0 === h || null === (h = h._rootDir) || void 0 === h || !h.length || !s.pathInsideDirectory(a, t.snapshotState._rootDir) || (l = e.relative(t.snapshotState._rootDir, a), 
  p = !0)), null === (n = l) || void 0 === n || !n.length) {
    let t = i.findRootLazy({
      cwd: e.dirname(a)
    }, !1);
    l = null != t && t.pkg ? e.relative(e.resolve(t.pkg, ".."), a) : a;
  }
  return p = p && a.includes("/__file_snapshots__/"), {
    snapshotFileName: a,
    snapshotDisplayName: l,
    rootData: r,
    safeUpdateSnapshot: p
  };
}

function toMatchFile(a, s, i = {}) {
  const {isNot: l, snapshotState: u} = this, h = "toMatchFile", f = e.normalize(null != s ? s : getBaseSnapshotFileName(this)), {snapshotDisplayName: d, safeUpdateSnapshot: c} = _hintSnapshotFileName(this, f);
  i = {
    diff: Object.assign({}, p, i.diff)
  };
  const m = r.handleJestMatcherHintOptions(this);
  if (u._updateSnapshot === o.EnumUpdateSnapshot.none && !t.pathExistsSync(f)) return u.unmatched++, 
  {
    pass: l,
    message: () => `New output file ${n.EXPECTED_COLOR(d)} was ${n.RECEIVED_COLOR("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${n.EXPECTED_COLOR("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`,
    actual: a,
    name: h
  };
  let S, _ = l, message = () => n.matcherHint(h, void 0, d, m);
  if (t.pathExistsSync(f)) if (S = t.readFileSync(f, Buffer.isBuffer(a) ? null : "utf8"), 
  function isEqual(t, e) {
    return Buffer.isBuffer(t) ? t.equals(e) : t === e;
  }(a, S) !== l) _ = !l; else if (l) u.unmatched++; else if (c && u._updateSnapshot === o.EnumUpdateSnapshot.all) _ = !l, 
  t.outputFileSync(f, a), u.updated++; else {
    u.unmatched++;
    const t = _diffHint(S, a, i.diff);
    message = () => n.matcherHint(h, void 0, d, m) + t;
  } else !c || l || u._updateSnapshot !== o.EnumUpdateSnapshot.new && u._updateSnapshot !== o.EnumUpdateSnapshot.all ? (u.unmatched++, 
  message = () => `The output file ${n.EXPECTED_COLOR(d)} ${n.RECEIVED_COLOR("doesn't exist")}.`) : (_ = !l, 
  t.outputFileSync(f, a), u.added++);
  return {
    pass: _,
    message,
    actual: a,
    expected: S,
    name: h
  };
}

function _diffHint(t, e, a) {
  return Buffer.isBuffer(t) || Buffer.isBuffer(e) ? "" : l._stringDiff(t, e, null != a ? a : p);
}

var u = {
  toMatchFile
};

exports._diffHint = _diffHint, exports._hintSnapshotFileName = _hintSnapshotFileName, 
exports.default = u, exports.getBaseSnapshotDirectory = getBaseSnapshotDirectory, 
exports.getBaseSnapshotFileName = getBaseSnapshotFileName, exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.production.min.cjs.map
