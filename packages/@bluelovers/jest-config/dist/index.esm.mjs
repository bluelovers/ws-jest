import { requireResolveExtra as t, requireResolveCore as e } from "@yarn-tool/require-resolve";

import { join as s } from "path";

import { tmpdir as o } from "os";

import { console as r } from "debug-color2";

import { realpathSync as n } from "graceful-fs";

import { Table as i, applyStyleBorderless as l } from "@yarn-tool/table";

import { inspect as _ } from "util";

function _requireResolve(s) {
  const o = [ t("@bluelovers/tsdx").result, t("tsdx").result ].filter(Boolean), n = e(s, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return r.debug("[require.resolve]", s, "=>", n), n;
}

function getCacheDirectory() {
  const {getuid: t} = process, e = process.env.JEST_CACHE_DIRECTORY || s(function tryRealpath(t) {
    try {
      t = n.native(t);
    } catch (t) {
      if ("ENOENT" !== t.code) throw t;
    }
    return t;
  }(o()), "jest");
  return null == t ? e : `${e}_${t.call(process).toString(36)}`;
}

function makeTestRegexConfig(t) {
  return {
    testMatch: void 0,
    testRegex: [ `\\.(tests?|spec)\\.(${t = [ t ].flat().join("|")})$`, `__tests__/.*\\.(tests?|spec)\\.(${t})$` ]
  };
}

function fixJestConfig(t) {
  return t.testMatch ? t.testRegex = void 0 : t.testRegex && (t.testMatch = void 0), 
  t;
}

function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}

function defaultModuleFileExtensions() {
  return [ "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "json", "node" ];
}

function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}

function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}

function defaultTransform() {
  let e = _requireResolve("ts-jest");
  const {result: s} = t("jest-tsd-transform");
  if (null != s && s.length) {
    const {result: o} = t("jest-chain-transform");
    null != o && o.length && (e = [ o, {
      transformers: [ s, e ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": e
  };
}

function _newTableBorderless(t) {
  let e = new i({
    colAligns: [ "right", "left" ],
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: ""
    },
    ...t
  });
  return e = l(e), e;
}

function printJestConfigInfo(t, e) {
  var s, o, n, i, l, u, f, a;
  const c = _newTableBorderless();
  null !== (s = e) && void 0 !== s || (e = {}), null !== (o = t) && void 0 !== o || (t = {}), 
  c.push([ "@bluelovers/jest-config:", "1.0.15" ]), c.push([ "process.versions.node:", process.versions.node ]), 
  c.push([ "cwd:", null !== (n = e.cwd) && void 0 !== n ? n : process.cwd() ]), (null === (i = e.file) || void 0 === i ? void 0 : i.length) && c.push([ "file:", e.file ]), 
  (null === (l = t.cacheDirectory) || void 0 === l ? void 0 : l.length) && c.push([ "cacheDirectory:", t.cacheDirectory ]), 
  (null === (u = t.rootDir) || void 0 === u ? void 0 : u.length) && c.push([ "rootDir:", t.rootDir ]), 
  (null === (f = t.roots) || void 0 === f ? void 0 : f.length) && c.push([ "roots:", _(t.roots) ]), 
  (null === (a = t.preset) || void 0 === a ? void 0 : a.length) && c.push([ "preset:", t.preset ]), 
  t.transform && c.push([ "transform:", _(t.transform, {
    depth: 3
  }) ]), r.gray.log("─".repeat(20)), r.log("jest.config"), r.log(c.toString()), r.gray.log("─".repeat(20));
}

const u = getCacheDirectory();

function mixinJestConfig(t, e, s) {
  var o;
  null !== (o = t) && void 0 !== o || (t = {});
  const r = fixJestConfig({
    globals: {
      "ts-jest": {}
    },
    cacheDirectory: u,
    maxWorkers: 1,
    clearMocks: !0,
    passWithNoTests: !0,
    moduleFileExtensions: [ "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "json", "node" ],
    testEnvironment: "node",
    ...makeTestRegexConfig([ "ts", "tsx", "mts", "cts" ]),
    testPathIgnorePatterns: [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ],
    setupFilesAfterEnv: [],
    transform: defaultTransform(),
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...t
  });
  return e && printJestConfigInfo(r, s), r;
}

export { _newTableBorderless, _requireResolve, u as cacheDirectory, mixinJestConfig as default, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, fixJestConfig, getCacheDirectory, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
