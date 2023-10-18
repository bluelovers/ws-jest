"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("@yarn-tool/require-resolve"), t = require("debug-color2"), s = require("@yarn-tool/table"), o = require("util"), r = require("jest-cache-directory");

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

var n = "@bluelovers/jest-config", i = "1.1.7";

function _newTableBorderless(e) {
  let t = new s.Table({
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
  return t = s.applyStyleBorderless(t), t;
}

function printJestConfigInfo(e, s) {
  var r, l, u, a, _, f, c, d;
  const g = _newTableBorderless();
  null !== (r = s) && void 0 !== r || (s = {}), null !== (l = e) && void 0 !== l || (e = {}), 
  g.push([ `${n}:`, i ]), g.push([ "process.versions.node:", process.versions.node ]), 
  g.push([ "cwd:", null !== (u = s.cwd) && void 0 !== u ? u : process.cwd() ]), (null === (a = s.file) || void 0 === a ? void 0 : a.length) && g.push([ "file:", s.file ]), 
  (null === (_ = e.cacheDirectory) || void 0 === _ ? void 0 : _.length) && g.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (f = e.rootDir) || void 0 === f ? void 0 : f.length) && g.push([ "rootDir:", e.rootDir ]), 
  (null === (c = e.roots) || void 0 === c ? void 0 : c.length) && g.push([ "roots:", o.inspect(e.roots) ]), 
  (null === (d = e.preset) || void 0 === d ? void 0 : d.length) && g.push([ "preset:", e.preset ]), 
  e.transform && g.push([ "transform:", o.inspect(e.transform, {
    depth: 3
  }) ]), t.console.gray.log("─".repeat(20)), t.console.log("jest.config"), t.console.log(g.toString()), 
  t.console.gray.log("─".repeat(20));
}

const l = r.getJestCacheDirectory();

function mixinJestConfig(e, t, s) {
  var o, r;
  null !== (o = e) && void 0 !== o || (e = {});
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
    ...e
  });
  return null !== (r = n.transform) && void 0 !== r || (n.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: n
  })), t && printJestConfigInfo(n, s), n;
}

exports._newTableBorderless = _newTableBorderless, exports._requireResolve = _requireResolve, 
exports.cacheDirectory = l, exports.default = mixinJestConfig, exports.defaultCoveragePathIgnorePatterns = function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}, exports.defaultModuleFileExtensions = function defaultModuleFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ];
}, exports.defaultTestFileExtensions = function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.defaultTestPathIgnorePatterns = function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}, exports.defaultTransform = defaultTransform, exports.fixJestConfig = fixJestConfig, 
exports.makeTestRegexConfig = makeTestRegexConfig, exports.mixinJestConfig = mixinJestConfig, 
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.production.min.cjs.map
