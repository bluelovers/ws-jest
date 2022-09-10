import { existsSync as e, readFileSync as t, outputFileSync as s } from "fs-extra";

import { join as a, dirname as n, basename as i } from "path";

import o from "filenamify";

import { EXPECTED_COLOR as r, RECEIVED_COLOR as u, diff as f } from "jest-matcher-utils";

function isEqual(e, t) {
  return Buffer.isBuffer(e) ? e.equals(t) : e === t;
}

function toMatchFile(p, h, l = {}) {
  const {isNot: c, snapshotState: m} = this, d = null != h ? h : a(n(this.testPath), "__file_snapshots__", `${o(this.currentTestName, {
    replacement: "-"
  }).replace(/\s/g, "-")}-${this.assertionCalls}`);
  if (l = {
    diff: Object.assign({
      expand: !1,
      contextLines: 5,
      aAnnotation: "Snapshot"
    }, l.diff)
  }, "none" === m._updateSnapshot && !e(d)) return m.unmatched++, {
    pass: c,
    message: () => `New output file ${r(i(d))} was ${u("not written")}.\n\nThe update flag must be explicitly passed to write a new snapshot.\n\nThis is likely because this test is run in a ${r("continuous integration (CI) environment")} in which snapshots are not written by default.\n\n`
  };
  if (e(d)) {
    const e = t(d, Buffer.isBuffer(p) ? null : "utf8");
    if (c) return isEqual(p, e) ? (m.unmatched++, {
      pass: !0,
      message: () => `Expected received content ${u("to not match")} the file ${r(i(d))}.`
    }) : {
      pass: !1,
      message: () => ""
    };
    if (isEqual(p, e)) return {
      pass: !0,
      message: () => ""
    };
    if ("all" === m._updateSnapshot) return s(d, p), m.updated++, {
      pass: !0,
      message: () => ""
    };
    {
      m.unmatched++;
      const t = Buffer.isBuffer(p) || Buffer.isBuffer(e) ? "" : `\n\n${f(e, p, l.diff)}`;
      return {
        pass: !1,
        message: () => `Received content ${u("doesn't match")} the file ${r(i(d))}.${t}`
      };
    }
  }
  return c || "new" !== m._updateSnapshot && "all" !== m._updateSnapshot ? (m.unmatched++, 
  {
    pass: !0,
    message: () => `The output file ${r(i(d))} ${u("doesn't exist")}.`
  }) : (s(d, p), m.added++, {
    pass: !0,
    message: () => ""
  });
}

var p = {
  toMatchFile
};

export { p as default, toMatchFile };
//# sourceMappingURL=index.esm.mjs.map
