"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("fs-extra"), t = require("upath2"), a = require("filenamify"), i = require("jest-matcher-utils"), n = require("path-in-dir"), s = require("@yarn-tool/find-root"), o = require("@lazy-assert/jest-util"), r = require("@lazy-assert/jest-diff");

const l = {
  expand: !1,
  contextLines: 5,
  aAnnotation: "Snapshot"
};

function getBaseSnapshotDirectory(e) {
  return t.join(t.dirname(e.testPath), "__file_snapshots__");
}

function getBaseSnapshotFileName(e) {
  return t.join(getBaseSnapshotDirectory(e), `${a(e.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${e.assertionCalls}`);
}

function _hintSnapshotFileName(e, a) {
  var i;
  const o = getBaseSnapshotDirectory(e);
  let r, l, u;
  var p, h, f;
  if (n.pathInsideDirectory(a, o) ? (l = t.relative(o, a), u = !0) : (r = s.findRootLazy({
    cwd: e.testPath
  }, !1), r && (n.pathInsideDirectory(a, r.pkg) ? (l = t.relative(r.pkg, a), u = !0) : n.pathInsideDirectory(a, r.root) && (l = t.relative(r.root, a), 
  u = !0)), null !== (p = l) && void 0 !== p && p.length || null === (h = e.snapshotState) || void 0 === h || null === (f = h._rootDir) || void 0 === f || !f.length || !n.pathInsideDirectory(a, e.snapshotState._rootDir) || (l = t.relative(e.snapshotState._rootDir, a), 
  u = !0)), null === (i = l) || void 0 === i || !i.length) {
    let e = s.findRootLazy({
      cwd: t.dirname(a)
    }, !1);
    l = null != e && e.pkg ? t.relative(t.resolve(e.pkg, ".."), a) : a;
  }
  return u = u && a.includes("/__file_snapshots__/"), {
    snapshotFileName: a,
    snapshotDisplayName: l,
    rootData: r,
    safeUpdateSnapshot: u
  };
}

function toMatchFile(a, n, s = {}) {
  const {isNot: r, snapshotState: u} = this, p = "toMatchFile", h = t.normalize(null != n ? n : getBaseSnapshotFileName(this)), {snapshotDisplayName: f, safeUpdateSnapshot: c} = _hintSnapshotFileName(this, h);
  s = {
    diff: Object.assign({}, l, s.diff)
  };
  const d = o.handleJestMatcherHintOptions(this);
  if ("none" === u._updateSnapshot && !e.pathExistsSync(h)) return u.unmatched++, 
  {
    pass: r,
    message: () => `New output file ${i.EXPECTED_COLOR(f)} was ${i.RECEIVED_COLOR("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${i.EXPECTED_COLOR("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`,
    actual: a,
    name: p
  };
  let _, m = r, message = () => i.matcherHint(p, void 0, f, d);
  if (e.pathExistsSync(h)) if (_ = e.readFileSync(h, Buffer.isBuffer(a) ? null : "utf8"), 
  function isEqual(e, t) {
    return Buffer.isBuffer(e) ? e.equals(t) : e === t;
  }(a, _) !== r) m = !r; else if (r) u.unmatched++; else if (c && "all" === u._updateSnapshot) m = !r, 
  e.outputFileSync(h, a), u.updated++; else {
    u.unmatched++;
    const e = _diffHint(_, a, s.diff);
    message = () => i.matcherHint(p, void 0, f, d) + e;
  } else !c || r || "new" !== u._updateSnapshot && "all" !== u._updateSnapshot ? (u.unmatched++, 
  message = () => `The output file ${i.EXPECTED_COLOR(f)} ${i.RECEIVED_COLOR("doesn't exist")}.`) : (m = !r, 
  e.outputFileSync(h, a), u.added++);
  return {
    pass: m,
    message,
    actual: a,
    expected: _,
    name: p
  };
}

function _diffHint(e, t, a) {
  return Buffer.isBuffer(e) || Buffer.isBuffer(t) ? "" : r._stringDiff(e, t, null != a ? a : l);
}

var u = {
  toMatchFile
};

exports._diffHint = _diffHint, exports._hintSnapshotFileName = _hintSnapshotFileName, 
exports.default = u, exports.getBaseSnapshotDirectory = getBaseSnapshotDirectory, 
exports.getBaseSnapshotFileName = getBaseSnapshotFileName, exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.production.min.cjs.map
