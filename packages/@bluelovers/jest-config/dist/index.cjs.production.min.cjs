"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("@yarn-tool/require-resolve"), t = require("debug-color2"), s = require("array-hyper-unique"), o = require("@yarn-tool/table"), r = require("util"), n = require("jest-cache-directory");

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
    [`.(${_handleFileExtensions([ "ts", "tsx", "mts", "cts" ], "|")})$`]: o
  };
}

function _requireResolve(s) {
  const o = [ e.requireResolveExtra("@bluelovers/tsdx").result, e.requireResolveExtra("tsdx").result ].filter(Boolean), r = e.requireResolveCore(s, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return t.console.debug("[require.resolve]", s, "=>", r), r;
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
  return s.array_unique([ e ].flat());
}

function _handleFileExtensions(e, t) {
  return _handleFileExtensionsCore(e).join(t);
}

function fixJestConfig(e) {
  return e.testMatch ? e.testRegex = null : e.testRegex && (e.testMatch = null), e;
}

var i = "@bluelovers/jest-config", l = "1.1.9";

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
  var o, n, u, a, _, f, c, d;
  const x = _newTableBorderless();
  null !== (o = s) && void 0 !== o || (s = {}), null !== (n = e) && void 0 !== n || (e = {}), 
  x.push([ `${i}:`, l ]), x.push([ "process.versions.node:", process.versions.node ]), 
  x.push([ "cwd:", null !== (u = s.cwd) && void 0 !== u ? u : process.cwd() ]), (null === (a = s.file) || void 0 === a ? void 0 : a.length) && x.push([ "file:", s.file ]), 
  (null === (_ = e.cacheDirectory) || void 0 === _ ? void 0 : _.length) && x.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (f = e.rootDir) || void 0 === f ? void 0 : f.length) && x.push([ "rootDir:", e.rootDir ]), 
  (null === (c = e.roots) || void 0 === c ? void 0 : c.length) && x.push([ "roots:", r.inspect(e.roots) ]), 
  (null === (d = e.preset) || void 0 === d ? void 0 : d.length) && x.push([ "preset:", e.preset ]), 
  e.transform && x.push([ "transform:", r.inspect(e.transform, {
    depth: 3
  }) ]), t.console.gray.log("─".repeat(20)), t.console.log("jest.config"), t.console.log(x.toString()), 
  t.console.gray.log("─".repeat(20));
}

const u = n.getJestCacheDirectory();

function mixinJestConfig(e, t, s) {
  var o, r;
  null !== (o = e) && void 0 !== o || (e = {});
  const n = fixJestConfig({
    globals: {},
    cacheDirectory: u,
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

exports._handleFileExtensions = _handleFileExtensions, exports._handleFileExtensionsCore = _handleFileExtensionsCore, 
exports._newTableBorderless = _newTableBorderless, exports._requireResolve = _requireResolve, 
exports.cacheDirectory = u, exports.default = mixinJestConfig, exports.defaultCoverageFileExtensions = function defaultCoverageFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx" ];
}, exports.defaultCoveragePathIgnorePatterns = function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}, exports.defaultModuleFileExtensions = function defaultModuleFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ];
}, exports.defaultTestFileExtensions = function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.defaultTestPathIgnorePatterns = function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}, exports.defaultTransform = defaultTransform, exports.defaultTransformFileExtensions = function defaultTransformFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.fixJestConfig = fixJestConfig, exports.makeTestRegexConfig = makeTestRegexConfig, 
exports.mixinJestConfig = mixinJestConfig, exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.production.min.cjs.map
