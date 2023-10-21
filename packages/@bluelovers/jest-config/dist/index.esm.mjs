import { requireResolveExtra as e, requireResolveCore as t } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { array_unique as o } from "array-hyper-unique";

import { Table as n, applyStyleBorderless as r } from "@yarn-tool/table";

import { inspect as i } from "util";

import { getJestCacheDirectory as l } from "jest-cache-directory";

function defaultTsJestTransformerOptions(e) {
  var t, s;
  const o = null !== (t = null === (s = e.jestConfig.globals) || void 0 === s ? void 0 : s["ts-jest"]) && void 0 !== t ? t : {}, n = "object" == typeof o.tsconfig ? o.tsconfig : {};
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

function defaultTransform(t) {
  const s = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ e("@bluelovers/jest-config").result ].filter(Boolean)
  };
  let o = _requireResolve("ts-jest");
  o = [ o, defaultTsJestTransformerOptions(t) ];
  const {result: n} = e("jest-tsd-transform", s);
  if (null != n && n.length) {
    const {result: t} = e("jest-chain-transform", s);
    null != t && t.length && (o = [ t, {
      transformers: [ n, o ]
    } ]);
  }
  return {
    [`.(${_handleFileExtensions([ "ts", "tsx", "mts", "cts" ], "|")})$`]: o
  };
}

function _requireResolve(o) {
  const n = [ e("@bluelovers/tsdx").result, e("tsdx").result ].filter(Boolean), r = t(o, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: n
  });
  return s.debug("[require.resolve]", o, "=>", r), r;
}

function makeTestRegexConfig(e) {
  var t;
  null !== (t = e) && void 0 !== t || (e = [ "ts", "tsx", "mts", "cts" ]);
  const s = _handleFileExtensions(e, "|");
  return {
    testMatch: null,
    testRegex: [ `\\.(tests?|spec)\\.(${s})$`, `__tests__/.*\\.(tests?|spec)\\.(${s})$` ]
  };
}

function _handleFileExtensionsCore(e) {
  return o([ e ].flat());
}

function _handleFileExtensions(e, t) {
  return _handleFileExtensionsCore(e).join(t);
}

function fixJestConfig(e) {
  return e.testMatch ? e.testRegex = null : e.testRegex && (e.testMatch = null), e;
}

var u = "@bluelovers/jest-config", a = "1.1.9";

function _newTableBorderless(e) {
  let t = new n({
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
    ...e
  });
  return t = r(t), t;
}

function printJestConfigInfo(e, t) {
  var o, n, r, l, f, _, d, c;
  const m = _newTableBorderless();
  null !== (o = t) && void 0 !== o || (t = {}), null !== (n = e) && void 0 !== n || (e = {}), 
  m.push([ `${u}:`, a ]), m.push([ "process.versions.node:", process.versions.node ]), 
  m.push([ "cwd:", null !== (r = t.cwd) && void 0 !== r ? r : process.cwd() ]), (null === (l = t.file) || void 0 === l ? void 0 : l.length) && m.push([ "file:", t.file ]), 
  (null === (f = e.cacheDirectory) || void 0 === f ? void 0 : f.length) && m.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (_ = e.rootDir) || void 0 === _ ? void 0 : _.length) && m.push([ "rootDir:", e.rootDir ]), 
  (null === (d = e.roots) || void 0 === d ? void 0 : d.length) && m.push([ "roots:", i(e.roots) ]), 
  (null === (c = e.preset) || void 0 === c ? void 0 : c.length) && m.push([ "preset:", e.preset ]), 
  e.transform && m.push([ "transform:", i(e.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(m.toString()), s.gray.log("─".repeat(20));
}

const f = l();

function mixinJestConfig(e, t, s) {
  var o, n;
  null !== (o = e) && void 0 !== o || (e = {});
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
    ...e
  });
  return null !== (n = r.transform) && void 0 !== n || (r.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: r
  })), t && printJestConfigInfo(r, s), r;
}

export { _handleFileExtensions, _handleFileExtensionsCore, _newTableBorderless, _requireResolve, f as cacheDirectory, mixinJestConfig as default, defaultCoverageFileExtensions, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, defaultTransformFileExtensions, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
