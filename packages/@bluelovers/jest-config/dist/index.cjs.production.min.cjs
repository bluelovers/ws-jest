"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("@yarn-tool/require-resolve"), t = require("debug-color2"), s = require("jest-config"), o = require("@yarn-tool/table"), r = require("util");

function _requireResolve(s) {
  const o = [ e.requireResolveExtra("@bluelovers/tsdx").result, e.requireResolveExtra("tsdx").result ].filter(Boolean), r = e.requireResolveCore(s, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return t.console.debug("[require.resolve]", s, "=>", r), r;
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

function defaultModuleFileExtensions() {
  return [ ...s.defaults.moduleFileExtensions, "mts", "cts" ];
}

function defaultTransform(t) {
  const s = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ e.requireResolveExtra("@bluelovers/jest-config").result ].filter(Boolean)
  };
  let o = _requireResolve("ts-jest");
  o = [ o, defaultTsJestTransformerOptions(t) ];
  const {result: r} = e.requireResolveExtra("jest-tsd-transform", s);
  if (null != r && r.length) {
    const {result: t} = e.requireResolveExtra("jest-chain-transform", s);
    null != t && t.length && (o = [ t, {
      transformers: [ r, o ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": o
  };
}

function _newTableBorderless(e) {
  let t = new o.Table({
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
  return t = o.applyStyleBorderless(t), t;
}

function printJestConfigInfo(e, s) {
  var o, n, i, l, u, a, f, _;
  const c = _newTableBorderless();
  null !== (o = s) && void 0 !== o || (s = {}), null !== (n = e) && void 0 !== n || (e = {}), 
  c.push([ "@bluelovers/jest-config:", "1.1.2" ]), c.push([ "process.versions.node:", process.versions.node ]), 
  c.push([ "cwd:", null !== (i = s.cwd) && void 0 !== i ? i : process.cwd() ]), (null === (l = s.file) || void 0 === l ? void 0 : l.length) && c.push([ "file:", s.file ]), 
  (null === (u = e.cacheDirectory) || void 0 === u ? void 0 : u.length) && c.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (a = e.rootDir) || void 0 === a ? void 0 : a.length) && c.push([ "rootDir:", e.rootDir ]), 
  (null === (f = e.roots) || void 0 === f ? void 0 : f.length) && c.push([ "roots:", r.inspect(e.roots) ]), 
  (null === (_ = e.preset) || void 0 === _ ? void 0 : _.length) && c.push([ "preset:", e.preset ]), 
  e.transform && c.push([ "transform:", r.inspect(e.transform, {
    depth: 3
  }) ]), t.console.gray.log("─".repeat(20)), t.console.log("jest.config"), t.console.log(c.toString()), 
  t.console.gray.log("─".repeat(20));
}

const n = require("jest-cache-directory").getJestCacheDirectory();

function mixinJestConfig(e, t, s) {
  var o, r;
  null !== (o = e) && void 0 !== o || (e = {});
  const i = fixJestConfig({
    globals: {},
    cacheDirectory: n,
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
  return null !== (r = i.transform) && void 0 !== r || (i.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: i
  })), t && printJestConfigInfo(i, s), i;
}

exports._newTableBorderless = _newTableBorderless, exports._requireResolve = _requireResolve, 
exports.cacheDirectory = n, exports.default = mixinJestConfig, exports.defaultCoveragePathIgnorePatterns = function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}, exports.defaultModuleFileExtensions = defaultModuleFileExtensions, exports.defaultTestFileExtensions = function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.defaultTestPathIgnorePatterns = function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}, exports.defaultTransform = defaultTransform, exports.fixJestConfig = fixJestConfig, 
exports.makeTestRegexConfig = makeTestRegexConfig, exports.mixinJestConfig = mixinJestConfig, 
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.production.min.cjs.map
