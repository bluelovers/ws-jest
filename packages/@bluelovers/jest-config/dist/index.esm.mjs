import { requireResolveExtra as e, requireResolveCore as t } from "@yarn-tool/require-resolve";

import { console as s } from "debug-color2";

import { defaults as o } from "jest-config";

import { Table as r, applyStyleBorderless as n } from "@yarn-tool/table";

import { inspect as i } from "util";

import { getJestCacheDirectory as l } from "jest-cache-directory";

function _requireResolve(o) {
  const r = [ e("@bluelovers/tsdx").result, e("tsdx").result ].filter(Boolean), n = t(o, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: r
  });
  return s.debug("[require.resolve]", o, "=>", n), n;
}

function makeTestRegexConfig(e) {
  return {
    testMatch: void 0,
    testRegex: [ `\\.(tests?|spec)\\.(${e = [ e ].flat().join("|")})$`, `__tests__/.*\\.(tests?|spec)\\.(${e})$` ]
  };
}

function fixJestConfig(e) {
  return e.testMatch ? e.testRegex = void 0 : e.testRegex && (e.testMatch = void 0), 
  e;
}

function defaultTsJestTransformerOptions(e) {
  var t, s;
  const o = null !== (t = null === (s = e.jestConfig.globals) || void 0 === s ? void 0 : s["ts-jest"]) && void 0 !== t ? t : {}, r = "object" == typeof o.tsconfig ? o.tsconfig : {};
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
  return [ ...o.moduleFileExtensions, "mts", "cts" ];
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
  const {result: r} = e("jest-tsd-transform", s);
  if (null != r && r.length) {
    const {result: t} = e("jest-chain-transform", s);
    null != t && t.length && (o = [ t, {
      transformers: [ r, o ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": o
  };
}

function _newTableBorderless(e) {
  let t = new r({
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
  return t = n(t), t;
}

function printJestConfigInfo(e, t) {
  var o, r, n, l, u, f, a, _;
  const d = _newTableBorderless();
  null !== (o = t) && void 0 !== o || (t = {}), null !== (r = e) && void 0 !== r || (e = {}), 
  d.push([ "@bluelovers/jest-config:", "1.1.2" ]), d.push([ "process.versions.node:", process.versions.node ]), 
  d.push([ "cwd:", null !== (n = t.cwd) && void 0 !== n ? n : process.cwd() ]), (null === (l = t.file) || void 0 === l ? void 0 : l.length) && d.push([ "file:", t.file ]), 
  (null === (u = e.cacheDirectory) || void 0 === u ? void 0 : u.length) && d.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (f = e.rootDir) || void 0 === f ? void 0 : f.length) && d.push([ "rootDir:", e.rootDir ]), 
  (null === (a = e.roots) || void 0 === a ? void 0 : a.length) && d.push([ "roots:", i(e.roots) ]), 
  (null === (_ = e.preset) || void 0 === _ ? void 0 : _.length) && d.push([ "preset:", e.preset ]), 
  e.transform && d.push([ "transform:", i(e.transform, {
    depth: 3
  }) ]), s.gray.log("─".repeat(20)), s.log("jest.config"), s.log(d.toString()), s.gray.log("─".repeat(20));
}

const u = l();

function mixinJestConfig(e, t, s) {
  var o, r;
  null !== (o = e) && void 0 !== o || (e = {});
  const n = fixJestConfig({
    globals: {},
    cacheDirectory: u,
    maxWorkers: 1,
    clearMocks: !0,
    passWithNoTests: !0,
    moduleFileExtensions: defaultModuleFileExtensions(),
    ...makeTestRegexConfig([ "ts", "tsx", "mts", "cts" ]),
    testPathIgnorePatterns: [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ],
    setupFilesAfterEnv: [],
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...e
  });
  return null !== (r = n.transform) && void 0 !== r || (n.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: n
  })), t && printJestConfigInfo(n, s), n;
}

export { _newTableBorderless, _requireResolve, u as cacheDirectory, mixinJestConfig as default, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, fixJestConfig, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
