import { requireResolveExtra as t, requireResolveCore as e } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { Table as o, applyStyleBorderless as n } from "@yarn-tool/table";

import { inspect as r } from "util";

import { getJestCacheDirectory as i } from "jest-cache-directory";

function _requireResolve(o) {
  const n = [ t("@bluelovers/tsdx").result, t("tsdx").result ].filter(Boolean), r = e(o, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: n
  });
  return s.debug("[require.resolve]", o, "=>", r), r;
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

function defaultTsJestTransformerOptions(t) {
  var e, s;
  const o = null !== (e = null === (s = t.jestConfig.globals) || void 0 === s ? void 0 : s["ts-jest"]) && void 0 !== e ? e : {}, n = "object" == typeof o.tsconfig ? o.tsconfig : {};
  return {
    ...o,
    tsconfig: {
      noEmit: !0,
      emitDeclarationOnly: !1,
      noUnusedParameters: !1,
      allowUnusedLabels: !0,
      noUnusedLocals: !1,
      noPropertyAccessFromIndexSignature: !1,
      noImplicitAny: !1,
      ...n
    }
  };
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

function defaultTransform(e) {
  const s = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ t("@bluelovers/jest-config").result ].filter(Boolean)
  };
  let o = _requireResolve("ts-jest");
  o = [ o, defaultTsJestTransformerOptions(e) ];
  const {result: n} = t("jest-tsd-transform", s);
  if (null != n && n.length) {
    const {result: e} = t("jest-chain-transform", s);
    null != e && e.length && (o = [ e, {
      transformers: [ n, o ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": o
  };
}

function _newTableBorderless(t) {
  let e = new o({
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
  return e = n(e), e;
}

function printJestConfigInfo(t, e) {
  var o, n, i, l, u, a, _, f;
  const d = _newTableBorderless();
  null !== (o = e) && void 0 !== o || (e = {}), null !== (n = t) && void 0 !== n || (t = {}), 
  d.push([ "@bluelovers/jest-config:", "1.1.2" ]), d.push([ "process.versions.node:", process.versions.node ]), 
  d.push([ "cwd:", null !== (i = e.cwd) && void 0 !== i ? i : process.cwd() ]), (null === (l = e.file) || void 0 === l ? void 0 : l.length) && d.push([ "file:", e.file ]), 
  (null === (u = t.cacheDirectory) || void 0 === u ? void 0 : u.length) && d.push([ "cacheDirectory:", t.cacheDirectory ]), 
  (null === (a = t.rootDir) || void 0 === a ? void 0 : a.length) && d.push([ "rootDir:", t.rootDir ]), 
  (null === (_ = t.roots) || void 0 === _ ? void 0 : _.length) && d.push([ "roots:", r(t.roots) ]), 
  (null === (f = t.preset) || void 0 === f ? void 0 : f.length) && d.push([ "preset:", t.preset ]), 
  t.transform && d.push([ "transform:", r(t.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(d.toString()), s.gray.log("─".repeat(20));
}

const l = i();

function mixinJestConfig(t, e, s) {
  var o, n;
  null !== (o = t) && void 0 !== o || (t = {});
  const r = fixJestConfig({
    globals: {},
    cacheDirectory: l,
    maxWorkers: 1,
    clearMocks: !0,
    passWithNoTests: !0,
    moduleFileExtensions: [ "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "json", "node" ],
    testEnvironment: "node",
    ...makeTestRegexConfig([ "ts", "tsx", "mts", "cts" ]),
    testPathIgnorePatterns: [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ],
    setupFilesAfterEnv: [],
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...t
  });
  return null !== (n = r.transform) && void 0 !== n || (r.transform = defaultTransform({
    jestConfig: t,
    autoPrint: e,
    options: s,
    newJestConfig: r
  })), e && printJestConfigInfo(r, s), r;
}

export { _newTableBorderless, _requireResolve, l as cacheDirectory, mixinJestConfig as default, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
