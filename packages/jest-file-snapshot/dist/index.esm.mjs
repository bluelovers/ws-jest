import { pathExistsSync as e, readFileSync as t, outputFileSync as n } from "fs-extra";

import { join as s, dirname as a, basename as i } from "path";

import o from "filenamify";

import { EXPECTED_COLOR as r, RECEIVED_COLOR as u, diff as f, matcherHint as l } from "jest-matcher-utils";

var p;

function isEqual(e, t) {
  return Buffer.isBuffer(e) ? e.equals(t) : e === t;
}

function currentSnapshotFileName(e) {
  return s(a(e.testPath), "__file_snapshots__", `${o(e.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${e.assertionCalls}`);
}

function toMatchFile(s, a, o = {}) {
  const {isNot: p, snapshotState: h} = this, c = "toMatchFile", m = null != a ? a : currentSnapshotFileName(this), d = i(m);
  o = {
    diff: Object.assign({
      expand: !1,
      contextLines: 5,
      aAnnotation: "Snapshot"
    }, o.diff)
  };
  const w = {
    isNot: p,
    promise: this.promise
  };
  if ("none" === h._updateSnapshot && !e(m)) return h.unmatched++, {
    pass: p,
    message: () => `New output file ${r(d)} was ${u("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${r("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`
  };
  let S = !1, message = () => l(c, void 0, d, w);
  if (e(m)) {
    const e = t(m, Buffer.isBuffer(s) ? null : "utf8");
    if (p) isEqual(s, e) ? (h.unmatched++, S = !0) : S = !1; else if (isEqual(s, e)) S = !0; else if ("all" === h._updateSnapshot) S = !0, 
    n(m, s), h.updated++; else {
      h.unmatched++;
      const t = Buffer.isBuffer(s) || Buffer.isBuffer(e) ? "" : `\n\n${f(e, s, o.diff)}`;
      message = () => l(c, void 0, d, w) + t;
    }
  } else S = !0, p || "new" !== h._updateSnapshot && "all" !== h._updateSnapshot ? (h.unmatched++, 
  message = () => `The output file ${r(i(m))} ${u("doesn't exist")}.`) : (n(m, s), 
  h.added++);
  return {
    pass: S,
    message
  };
}

!function(e) {
  e.none = "none", e.new = "new", e.all = "all";
}(p || (p = {}));

var h = {
  toMatchFile
};

export { p as EnumUpdateSnapshot, currentSnapshotFileName, h as default, toMatchFile };
//# sourceMappingURL=index.esm.mjs.map
