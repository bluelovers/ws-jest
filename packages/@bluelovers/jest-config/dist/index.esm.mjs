import { requireResolveExtra as e, requireResolveCore as t } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { array_unique as n } from "array-hyper-unique";

import { Table as o, applyStyleBorderless as r } from "@yarn-tool/table";

import { inspect as l } from "util";

import { getJestCacheDirectory as i } from "jest-cache-directory";

import { escapeRegExp as u } from "regexp-helper-core";

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

function _requireResolve(n) {
  const o = [ e("@bluelovers/tsdx").result, e("tsdx").result ].filter(Boolean), r = t(n, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return s.debug("[require.resolve]", n, "=>", r), r;
}

function _requireResolve2(t) {
  return e(t, {
    includeGlobal: !0,
    includeCurrentDirectory: !0
  });
}

function makeTestRegexConfig(e) {
  null != e || (e = [ "ts", "tsx", "mts", "cts" ]);
  const t = _handleFileExtensions(e, "|");
  return {
    testMatch: null,
    testRegex: [ `\\.(tests?|spec)\\.(${t})$`, `__tests__/.*\\.(tests?|spec)\\.(${t})$` ]
  };
}

function _handleFileExtensionsCore(e) {
  return n([ e ].flat());
}

function _handleFileExtensions(e, t) {
  return _handleFileExtensionsCore(e).join(t);
}

function fixJestConfig(e) {
  var t, s, n;
  return e.testMatch ? e.testRegex = null : e.testRegex && (e.testMatch = null), e.testURL && (null !== (t = e.testEnvironmentOptions) && void 0 !== t || (e.testEnvironmentOptions = {}), 
  e.testURL = null !== (n = (s = e.testEnvironmentOptions).url) && void 0 !== n ? n : s.url = e.testURL), 
  e;
}

function _newTableBorderless(e) {
  let t = new o({
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
  var n, o, r, i, u, a;
  const f = _newTableBorderless();
  null != t || (t = {}), null != e || (e = {}), f.push([ "@bluelovers/jest-config:", "1.1.13" ]), 
  f.push([ "process.versions.node:", process.versions.node ]), f.push([ "cwd:", null !== (n = t.cwd) && void 0 !== n ? n : process.cwd() ]), 
  (null === (o = t.file) || void 0 === o ? void 0 : o.length) && f.push([ "file:", t.file ]), 
  (null === (r = e.cacheDirectory) || void 0 === r ? void 0 : r.length) && f.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (i = e.rootDir) || void 0 === i ? void 0 : i.length) && f.push([ "rootDir:", e.rootDir ]), 
  (null === (u = e.roots) || void 0 === u ? void 0 : u.length) && f.push([ "roots:", l(e.roots) ]), 
  (null === (a = e.preset) || void 0 === a ? void 0 : a.length) && f.push([ "preset:", e.preset ]), 
  e.transform && f.push([ "transform:", l(e.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(f.toString()), s.gray.log("─".repeat(20));
}

function defaultTsJestTransformerOptions(e) {
  var t, s, o;
  const r = null !== (t = null === (s = e.jestConfig.globals) || void 0 === s ? void 0 : s["ts-jest"]) && void 0 !== t ? t : {}, l = "object" == typeof r.tsconfig ? r.tsconfig : {}, i = n([ ...null !== (o = l.types) && void 0 !== o ? o : [], "jest" ]);
  return {
    ...r,
    tsconfig: {
      noEmit: !0,
      emitDeclarationOnly: !1,
      noUnusedParameters: !1,
      allowUnusedLabels: !0,
      noUnusedLocals: !1,
      noPropertyAccessFromIndexSignature: !1,
      noImplicitAny: !1,
      ...l,
      types: i
    }
  };
}

function defaultTransform(t) {
  const s = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ e("@bluelovers/jest-config").result ].filter(Boolean)
  };
  let n = _requireResolve("ts-jest");
  n = [ n, defaultTsJestTransformerOptions(t) ];
  const {result: o} = e("jest-tsd-transform", s);
  if (null != o && o.length) {
    const {result: t} = e("jest-chain-transform", s);
    null != t && t.length && (n = [ t, {
      transformers: [ o, n ]
    } ]);
  }
  return {
    [`.(${_handleFileExtensions([ "ts", "tsx", "mts", "cts" ], "|")})$`]: n
  };
}

function detectIncludes(e, t) {
  let s = {};
  if (null != e && e.length && t.length) {
    t = Array.isArray(t) ? t : [ t ];
    const n = new RegExp(`(${function escapeArrayToRegExpSource(e) {
      return e.map(e => u(e)).join("|");
    }(t)})`);
    e.forEach(e => {
      var t, o;
      let r = null == e || null === (t = (o = e).match) || void 0 === t ? void 0 : t.call(o, n);
      if (r) {
        var l;
        const t = r[1];
        (null !== (l = s[t]) && void 0 !== l ? l : s[t] = []).push(e);
      }
      return s;
    });
  }
  return s;
}

function defaultSetupFiles(e) {
  var t, s, n;
  const o = null !== (t = null == e ? void 0 : e.jestConfig) && void 0 !== t ? t : {}, r = [ !detectIncludes(o.setupFiles, "dotenv").dotenv && _requireResolve2("dotenv/config").result, ...null !== (s = o.setupFiles) && void 0 !== s ? s : [] ].filter(Boolean), l = [ ...null !== (n = o.setupFilesAfterEnv) && void 0 !== n ? n : [] ].filter(Boolean), i = {};
  return r.length && (i.setupFiles = r), l.length && (i.setupFilesAfterEnv = l), i;
}

const a = /*#__PURE__*/ i();

function mixinJestConfig(e, t, s) {
  var n;
  null != e || (e = {});
  const o = fixJestConfig({
    globals: {},
    cacheDirectory: a,
    maxWorkers: 1,
    clearMocks: !0,
    passWithNoTests: !0,
    moduleFileExtensions: [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ],
    ...makeTestRegexConfig([ "ts", "tsx", "mts", "cts" ]),
    testPathIgnorePatterns: [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ],
    ...defaultSetupFiles(),
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...e
  });
  return null !== (n = o.transform) && void 0 !== n || (o.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: o
  })), t && printJestConfigInfo(o, s), o;
}

export { _handleFileExtensions, _handleFileExtensionsCore, _newTableBorderless, _requireResolve, _requireResolve2, a as cacheDirectory, mixinJestConfig as default, defaultCoverageFileExtensions, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultSetupFiles, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, defaultTransformFileExtensions, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
