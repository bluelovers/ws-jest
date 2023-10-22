import { requireResolveExtra as t, requireResolveCore as e } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { array_unique as o } from "array-hyper-unique";

import { Table as n, applyStyleBorderless as r } from "@yarn-tool/table";

import { inspect as i } from "util";

import { getJestCacheDirectory as l } from "jest-cache-directory";

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
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ];
}

function defaultCoverageFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx" ];
}

function defaultTransformFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
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
    [`.(${_handleFileExtensions([ "ts", "tsx", "mts", "cts" ], "|")})$`]: o
  };
}

function _requireResolve(o) {
  const n = [ t("@bluelovers/tsdx").result, t("tsdx").result ].filter(Boolean), r = e(o, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: n
  });
  return s.debug("[require.resolve]", o, "=>", r), r;
}

function makeTestRegexConfig(t) {
  var e;
  null !== (e = t) && void 0 !== e || (t = [ "ts", "tsx", "mts", "cts" ]);
  const s = _handleFileExtensions(t, "|");
  return {
    testMatch: null,
    testRegex: [ `\\.(tests?|spec)\\.(${s})$`, `__tests__/.*\\.(tests?|spec)\\.(${s})$` ]
  };
}

function _handleFileExtensionsCore(t) {
  return o([ t ].flat());
}

function _handleFileExtensions(t, e) {
  return _handleFileExtensionsCore(t).join(e);
}

function fixJestConfig(t) {
  var e, s, o;
  return t.testMatch ? t.testRegex = null : t.testRegex && (t.testMatch = null), t.testURL && (null !== (e = t.testEnvironmentOptions) && void 0 !== e || (t.testEnvironmentOptions = {}), 
  t.testURL = null !== (o = (s = t.testEnvironmentOptions).url) && void 0 !== o ? o : s.url = t.testURL), 
  t;
}

var u = "@bluelovers/jest-config", a = "1.1.10";

function _newTableBorderless(t) {
  let e = new n({
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
  var o, n, r, l, f, _, d, c;
  const m = _newTableBorderless();
  null !== (o = e) && void 0 !== o || (e = {}), null !== (n = t) && void 0 !== n || (t = {}), 
  m.push([ `${u}:`, a ]), m.push([ "process.versions.node:", process.versions.node ]), 
  m.push([ "cwd:", null !== (r = e.cwd) && void 0 !== r ? r : process.cwd() ]), (null === (l = e.file) || void 0 === l ? void 0 : l.length) && m.push([ "file:", e.file ]), 
  (null === (f = t.cacheDirectory) || void 0 === f ? void 0 : f.length) && m.push([ "cacheDirectory:", t.cacheDirectory ]), 
  (null === (_ = t.rootDir) || void 0 === _ ? void 0 : _.length) && m.push([ "rootDir:", t.rootDir ]), 
  (null === (d = t.roots) || void 0 === d ? void 0 : d.length) && m.push([ "roots:", i(t.roots) ]), 
  (null === (c = t.preset) || void 0 === c ? void 0 : c.length) && m.push([ "preset:", t.preset ]), 
  t.transform && m.push([ "transform:", i(t.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(m.toString()), s.gray.log("─".repeat(20));
}

const f = l();

function mixinJestConfig(t, e, s) {
  var o, n;
  null !== (o = t) && void 0 !== o || (t = {});
  const r = fixJestConfig({
    globals: {},
    cacheDirectory: f,
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
  return null !== (n = r.transform) && void 0 !== n || (r.transform = defaultTransform({
    jestConfig: t,
    autoPrint: e,
    options: s,
    newJestConfig: r
  })), e && printJestConfigInfo(r, s), r;
}

export { _handleFileExtensions, _handleFileExtensionsCore, _newTableBorderless, _requireResolve, f as cacheDirectory, mixinJestConfig as default, defaultCoverageFileExtensions, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, defaultTransformFileExtensions, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
