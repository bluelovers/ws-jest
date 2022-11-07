import { requireResolveExtra as t, requireResolveCore as e } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { Table as o, applyStyleBorderless as r } from "@yarn-tool/table";

import { inspect as n } from "util";

import { getJestCacheDirectory as i } from "jest-cache-directory";

function _requireResolve(o) {
  const r = [ t("@bluelovers/tsdx").result, t("tsdx").result ].filter(Boolean), n = e(o, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: r
  });
  return s.debug("[require.resolve]", o, "=>", n), n;
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
  const o = null !== (e = null === (s = t.jestConfig.globals) || void 0 === s ? void 0 : s["ts-jest"]) && void 0 !== e ? e : {}, r = "object" == typeof o.tsconfig ? o.tsconfig : {};
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
      ...r
    }
  };
}

function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}

function defaultModuleFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ];
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
  const {result: r} = t("jest-tsd-transform", s);
  if (null != r && r.length) {
    const {result: e} = t("jest-chain-transform", s);
    null != e && e.length && (o = [ e, {
      transformers: [ r, o ]
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
  return e = r(e), e;
}

function printJestConfigInfo(t, e) {
  var o, r, i, l, u, a, _, f;
  const d = _newTableBorderless();
  null !== (o = e) && void 0 !== o || (e = {}), null !== (r = t) && void 0 !== r || (t = {}), 
  d.push([ "@bluelovers/jest-config:", "1.1.5" ]), d.push([ "process.versions.node:", process.versions.node ]), 
  d.push([ "cwd:", null !== (i = e.cwd) && void 0 !== i ? i : process.cwd() ]), (null === (l = e.file) || void 0 === l ? void 0 : l.length) && d.push([ "file:", e.file ]), 
  (null === (u = t.cacheDirectory) || void 0 === u ? void 0 : u.length) && d.push([ "cacheDirectory:", t.cacheDirectory ]), 
  (null === (a = t.rootDir) || void 0 === a ? void 0 : a.length) && d.push([ "rootDir:", t.rootDir ]), 
  (null === (_ = t.roots) || void 0 === _ ? void 0 : _.length) && d.push([ "roots:", n(t.roots) ]), 
  (null === (f = t.preset) || void 0 === f ? void 0 : f.length) && d.push([ "preset:", t.preset ]), 
  t.transform && d.push([ "transform:", n(t.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(d.toString()), s.gray.log("─".repeat(20));
}

const l = i();

function mixinJestConfig(t, e, s) {
  var o, r;
  null !== (o = t) && void 0 !== o || (t = {});
  const n = fixJestConfig({
    globals: {},
    cacheDirectory: l,
    maxWorkers: 1,
    clearMocks: !0,
    passWithNoTests: !0,
    moduleFileExtensions: [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ],
    ...makeTestRegexConfig([ "ts", "tsx", "mts", "cts" ]),
    testPathIgnorePatterns: [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ],
    setupFilesAfterEnv: [],
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...t
  });
  return null !== (r = n.transform) && void 0 !== r || (n.transform = defaultTransform({
    jestConfig: t,
    autoPrint: e,
    options: s,
    newJestConfig: n
  })), e && printJestConfigInfo(n, s), n;
}

export { _newTableBorderless, _requireResolve, l as cacheDirectory, mixinJestConfig as default, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
