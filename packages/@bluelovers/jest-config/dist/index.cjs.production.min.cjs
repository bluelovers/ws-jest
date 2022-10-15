"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("@yarn-tool/require-resolve"), t = require("path"), s = require("os"), o = require("debug-color2"), r = require("graceful-fs"), n = require("@yarn-tool/table"), i = require("util");

function _requireResolve(t) {
  const s = [ e.requireResolveExtra("@bluelovers/tsdx").result, e.requireResolveExtra("tsdx").result ].filter(Boolean), r = e.requireResolveCore(t, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: s
  });
  return o.console.debug("[require.resolve]", t, "=>", r), r;
}

function getCacheDirectory() {
  const {getuid: e} = process, o = process.env.JEST_CACHE_DIRECTORY || t.join(function tryRealpath(e) {
    try {
      e = r.realpathSync.native(e);
    } catch (e) {
      if ("ENOENT" !== e.code) throw e;
    }
    return e;
  }(s.tmpdir()), "jest");
  return null == e ? o : `${o}_${e.call(process).toString(36)}`;
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

function defaultTransform() {
  const t = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ e.requireResolveExtra("@bluelovers/jest-config").result ].filter(Boolean)
  };
  let s = _requireResolve("ts-jest");
  s = [ s, {
    tsconfig: {
      noEmit: !0,
      emitDeclarationOnly: !1,
      noUnusedParameters: !1,
      allowUnusedLabels: !0,
      noUnusedLocals: !1,
      noPropertyAccessFromIndexSignature: !1,
      noImplicitAny: !1
    }
  } ];
  const {result: o} = e.requireResolveExtra("jest-tsd-transform", t);
  if (null != o && o.length) {
    const {result: r} = e.requireResolveExtra("jest-chain-transform", t);
    null != r && r.length && (s = [ r, {
      transformers: [ o, s ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": s
  };
}

function _newTableBorderless(e) {
  let t = new n.Table({
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
  return t = n.applyStyleBorderless(t), t;
}

function printJestConfigInfo(e, t) {
  var s, r, n, l, u, a, c, _;
  const f = _newTableBorderless();
  null !== (s = t) && void 0 !== s || (t = {}), null !== (r = e) && void 0 !== r || (e = {}), 
  f.push([ "@bluelovers/jest-config:", "1.1.1" ]), f.push([ "process.versions.node:", process.versions.node ]), 
  f.push([ "cwd:", null !== (n = t.cwd) && void 0 !== n ? n : process.cwd() ]), (null === (l = t.file) || void 0 === l ? void 0 : l.length) && f.push([ "file:", t.file ]), 
  (null === (u = e.cacheDirectory) || void 0 === u ? void 0 : u.length) && f.push([ "cacheDirectory:", e.cacheDirectory ]), 
  (null === (a = e.rootDir) || void 0 === a ? void 0 : a.length) && f.push([ "rootDir:", e.rootDir ]), 
  (null === (c = e.roots) || void 0 === c ? void 0 : c.length) && f.push([ "roots:", i.inspect(e.roots) ]), 
  (null === (_ = e.preset) || void 0 === _ ? void 0 : _.length) && f.push([ "preset:", e.preset ]), 
  e.transform && f.push([ "transform:", i.inspect(e.transform, {
    depth: 3
  }) ]), o.console.gray.log("─".repeat(20)), o.console.log("jest.config"), o.console.log(f.toString()), 
  o.console.gray.log("─".repeat(20));
}

const l = getCacheDirectory();

function mixinJestConfig(e, t, s) {
  var o;
  null !== (o = e) && void 0 !== o || (e = {});
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
    transform: defaultTransform(),
    verbose: !0,
    coverageProvider: "v8",
    collectCoverage: !1,
    coveragePathIgnorePatterns: [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ],
    ...e
  });
  return t && printJestConfigInfo(r, s), r;
}

exports._newTableBorderless = _newTableBorderless, exports._requireResolve = _requireResolve, 
exports.cacheDirectory = l, exports.default = mixinJestConfig, exports.defaultCoveragePathIgnorePatterns = function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}, exports.defaultModuleFileExtensions = function defaultModuleFileExtensions() {
  return [ "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "json", "node" ];
}, exports.defaultTestFileExtensions = function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}, exports.defaultTestPathIgnorePatterns = function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}, exports.defaultTransform = defaultTransform, exports.fixJestConfig = fixJestConfig, 
exports.getCacheDirectory = getCacheDirectory, exports.makeTestRegexConfig = makeTestRegexConfig, 
exports.mixinJestConfig = mixinJestConfig, exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.production.min.cjs.map
