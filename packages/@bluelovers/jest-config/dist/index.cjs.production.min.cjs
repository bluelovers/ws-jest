"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("@yarn-tool/require-resolve"), t = require("debug-color2"), s = require("array-hyper-unique"), o = require("@yarn-tool/table"), r = require("util"), n = require("jest-cache-directory"), l = require("regexp-helper-core");

function _requireResolve(s) {
  const o = [ e.requireResolveExtra("@bluelovers/tsdx").result, e.requireResolveExtra("tsdx").result ].filter(Boolean), r = e.requireResolveCore(s, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return t.console.debug("[require.resolve]", s, "=>", r), r;
}

function _requireResolve2(t) {
  return e.requireResolveExtra(t, {
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
  return s.array_unique([ e ].flat());
}

function _handleFileExtensions(e, t) {
  return _handleFileExtensionsCore(e).join(t);
}

function fixJestConfig(e) {
  var t, s, o;
  return e.testMatch ? e.testRegex = null : e.testRegex && (e.testMatch = null), e.testURL && (null !== (t = e.testEnvironmentOptions) && void 0 !== t || (e.testEnvironmentOptions = {}), 
  e.testURL = null !== (o = (s = e.testEnvironmentOptions).url) && void 0 !== o ? o : s.url = e.testURL), 
  e;
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
  var o, n, l, i, u, a;
  const c = _newTableBorderless();
  null != s || (s = {}), null != e || (e = {}), c.push([ "@bluelovers/jest-config:", "1.1.13" ]), 
  c.push([ "process.versions.node:", process.versions.node ]), c.push([ "cwd:", null !== (o = s.cwd) && void 0 !== o ? o : process.cwd() ]), 
  (null === (n = s.file) || void 0 === n ? void 0 : n.length) && c.push([ "file:", s.file ]), 
  (null === (l = e.cacheDirectory) || void 0 === l ? void 0 : l.length) && c.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (i = e.rootDir) || void 0 === i ? void 0 : i.length) && c.push([ "rootDir:", e.rootDir ]), 
  (null === (u = e.roots) || void 0 === u ? void 0 : u.length) && c.push([ "roots:", r.inspect(e.roots) ]), 
  (null === (a = e.preset) || void 0 === a ? void 0 : a.length) && c.push([ "preset:", e.preset ]), 
  e.transform && c.push([ "transform:", r.inspect(e.transform, {
    depth: 3
  }) ]), t.console.gray.log("─".repeat(20)), t.console.log("jest.config"), t.console.log(c.toString()), 
  t.console.gray.log("─".repeat(20));
}

function defaultTsJestTransformerOptions(e) {
  var t, o, r;
  const n = null !== (t = null === (o = e.jestConfig.globals) || void 0 === o ? void 0 : o["ts-jest"]) && void 0 !== t ? t : {}, l = "object" == typeof n.tsconfig ? n.tsconfig : {}, i = s.array_unique([ ...null !== (r = l.types) && void 0 !== r ? r : [], "jest" ]);
  return {
    ...n,
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

function detectIncludes(e, t) {
  let s = {};
  if (null != e && e.length && t.length) {
    t = Array.isArray(t) ? t : [ t ];
    const o = new RegExp(`(${function escapeArrayToRegExpSource(e) {
      return e.map(e => l.escapeRegExp(e)).join("|");
    }(t)})`);
    e.forEach(e => {
      var t, r;
      let n = null == e || null === (t = (r = e).match) || void 0 === t ? void 0 : t.call(r, o);
      if (n) {
        var l;
        const t = n[1];
        (null !== (l = s[t]) && void 0 !== l ? l : s[t] = []).push(e);
      }
      return s;
    });
  }
  return s;
}

function defaultSetupFiles(e) {
  var t, s, o;
  const r = null !== (t = null == e ? void 0 : e.jestConfig) && void 0 !== t ? t : {}, n = [ !detectIncludes(r.setupFiles, "dotenv").dotenv && _requireResolve2("dotenv/config").result, ...null !== (s = r.setupFiles) && void 0 !== s ? s : [] ].filter(Boolean), l = [ ...null !== (o = r.setupFilesAfterEnv) && void 0 !== o ? o : [] ].filter(Boolean), i = {};
  return n.length && (i.setupFiles = n), l.length && (i.setupFilesAfterEnv = l), i;
}

const i = /*#__PURE__*/ n.getJestCacheDirectory();

function mixinJestConfig(e, t, s) {
  var o;
  null != e || (e = {});
  const r = fixJestConfig({
    globals: {},
    cacheDirectory: i,
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
  return null !== (o = r.transform) && void 0 !== o || (r.transform = defaultTransform({
    jestConfig: e,
    autoPrint: t,
    options: s,
    newJestConfig: r
  })), t && printJestConfigInfo(r, s), r;
}

exports._handleFileExtensions = _handleFileExtensions, exports._handleFileExtensionsCore = _handleFileExtensionsCore, 
exports._newTableBorderless = _newTableBorderless, exports._requireResolve = _requireResolve, 
exports._requireResolve2 = _requireResolve2, exports.cacheDirectory = i, exports.default = mixinJestConfig, 
exports.defaultCoverageFileExtensions = function defaultCoverageFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx" ];
}, exports.defaultCoveragePathIgnorePatterns = function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}, exports.defaultModuleFileExtensions = function defaultModuleFileExtensions() {
  return [ "js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node" ];
}, exports.defaultSetupFiles = defaultSetupFiles, exports.defaultTestFileExtensions = function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.defaultTestPathIgnorePatterns = function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}, exports.defaultTransform = defaultTransform, exports.defaultTransformFileExtensions = function defaultTransformFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.fixJestConfig = fixJestConfig, exports.makeTestRegexConfig = makeTestRegexConfig, 
exports.mixinJestConfig = mixinJestConfig, exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.production.min.cjs.map
