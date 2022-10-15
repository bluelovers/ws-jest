import { requireResolveExtra as t, requireResolveCore as e } from "@yarn-tool/require-resolve";

import { join as s } from "path";

import { tmpdir as o } from "os";

import { console as r } from "debug-color2";

import { realpathSync as n } from "graceful-fs";

import { Table as i, applyStyleBorderless as l } from "@yarn-tool/table";

import { inspect as u } from "util";

function _requireResolve(s) {
  const o = [ t("@bluelovers/tsdx").result, t("tsdx").result ].filter(Boolean), n = e(s, {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: o
  });
  return r.debug("[require.resolve]", s, "=>", n), n;
}

function getCacheDirectory() {
  const {getuid: t} = process, e = process.env.JEST_CACHE_DIRECTORY || s(function tryRealpath(t) {
    try {
      t = n.native(t);
    } catch (t) {
      if ("ENOENT" !== t.code) throw t;
    }
    return t;
  }(o()), "jest");
  return null == t ? e : `${e}_${t.call(process).toString(36)}`;
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

function defaultTestFileExtensions() {
  return [ "ts", "tsx", "mts", "cts" ];
}

function defaultModuleFileExtensions() {
  return [ "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "json", "node" ];
}

function defaultCoveragePathIgnorePatterns() {
  return [ "/node_modules/", "/__snapshots__/", "/__tests__/", "/__test__/", "/dist/", "/test/", "/fixture/", "/__file_snapshots__/", "/__fixtures__/" ];
}

function defaultTestPathIgnorePatterns() {
  return [ "/node_modules/", "/__fixtures__/", "/__file_snapshots__/", "/fixtures/", "/__tests__/helpers/", "/__tests__/utils/", "__mocks__", "/dist/" ];
}

function defaultTransform() {
  const e = {
    includeGlobal: !0,
    includeCurrentDirectory: !0,
    paths: [ t("@bluelovers/jest-config").result ].filter(Boolean)
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
  const {result: o} = t("jest-tsd-transform", e);
  if (null != o && o.length) {
    const {result: r} = t("jest-chain-transform", e);
    null != r && r.length && (s = [ r, {
      transformers: [ o, s ]
    } ]);
  }
  return {
    ".(ts|tsx|mts|cts)$": s
  };
}

function _newTableBorderless(t) {
  let e = new i({
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
  return e = l(e), e;
}

function printJestConfigInfo(t, e) {
  var s, o, n, i, l, _, a, c;
  const f = _newTableBorderless();
  null !== (s = e) && void 0 !== s || (e = {}), null !== (o = t) && void 0 !== o || (t = {}), 
  f.push([ "@bluelovers/jest-config:", "1.1.1" ]), f.push([ "process.versions.node:", process.versions.node ]), 
  f.push([ "cwd:", null !== (n = e.cwd) && void 0 !== n ? n : process.cwd() ]), (null === (i = e.file) || void 0 === i ? void 0 : i.length) && f.push([ "file:", e.file ]), 
  (null === (l = t.cacheDirectory) || void 0 === l ? void 0 : l.length) && f.push([ "cacheDirectory:", t.cacheDirectory ]), 
  (null === (_ = t.rootDir) || void 0 === _ ? void 0 : _.length) && f.push([ "rootDir:", t.rootDir ]), 
  (null === (a = t.roots) || void 0 === a ? void 0 : a.length) && f.push([ "roots:", u(t.roots) ]), 
  (null === (c = t.preset) || void 0 === c ? void 0 : c.length) && f.push([ "preset:", t.preset ]), 
  t.transform && f.push([ "transform:", u(t.transform, {
    depth: 3
  }) ]), r.gray.log("─".repeat(20)), r.log("jest.config"), r.log(f.toString()), r.gray.log("─".repeat(20));
}

const _ = getCacheDirectory();

function mixinJestConfig(t, e, s) {
  var o;
  null !== (o = t) && void 0 !== o || (t = {});
  const r = fixJestConfig({
    globals: {},
    cacheDirectory: _,
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
    ...t
  });
  return e && printJestConfigInfo(r, s), r;
}

export { _newTableBorderless, _requireResolve, _ as cacheDirectory, mixinJestConfig as default, defaultCoveragePathIgnorePatterns, defaultModuleFileExtensions, defaultTestFileExtensions, defaultTestPathIgnorePatterns, defaultTransform, fixJestConfig, getCacheDirectory, makeTestRegexConfig, mixinJestConfig, printJestConfigInfo };
//# sourceMappingURL=index.esm.mjs.map
