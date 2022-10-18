'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var requireResolve = require('@yarn-tool/require-resolve');
var debugColor2 = require('debug-color2');
var table = require('@yarn-tool/table');
var util = require('util');
var jestCacheDirectory = require('jest-cache-directory');

function _requireResolve(name) {
  const paths = [requireResolve.requireResolveExtra('@bluelovers/tsdx').result, requireResolve.requireResolveExtra('tsdx').result].filter(Boolean);
  const result = requireResolve.requireResolveCore(name, {
    includeGlobal: true,
    includeCurrentDirectory: true,
    paths
  });
  debugColor2.console.debug('[require.resolve]', name, '=>', result);
  return result;
}
function makeTestRegexConfig(testExt) {
  testExt = [testExt].flat().join('|');
  return {
    testMatch: void 0,
    testRegex: [`\\.(tests?|spec)\\.(${testExt})$`, `__tests__\/\.*\\.(tests?|spec)\\.(${testExt})$`]
  };
}
function fixJestConfig(jestConfig) {
  if (jestConfig.testMatch) {
    jestConfig.testRegex = void 0;
  } else if (jestConfig.testRegex) {
    jestConfig.testMatch = void 0;
  }
  return jestConfig;
}

function defaultTsJestTransformerOptions(runtime) {
  var _runtime$jestConfig$g, _runtime$jestConfig$g2;
  const old = (_runtime$jestConfig$g = (_runtime$jestConfig$g2 = runtime.jestConfig.globals) === null || _runtime$jestConfig$g2 === void 0 ? void 0 : _runtime$jestConfig$g2['ts-jest']) !== null && _runtime$jestConfig$g !== void 0 ? _runtime$jestConfig$g : {};
  const tsconfig = typeof old.tsconfig === 'object' ? old.tsconfig : {};
  return {
    ...old,
    tsconfig: {
      noEmit: true,
      emitDeclarationOnly: false,
      noUnusedParameters: false,
      allowUnusedLabels: true,
      noUnusedLocals: false,
      noPropertyAccessFromIndexSignature: false,
      noImplicitAny: false,
      ...tsconfig
    }
  };
}

function defaultTestFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts'];
  return value;
}
function defaultModuleFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'];
  return value;
}
function defaultCoveragePathIgnorePatterns() {
  const value = ['/node_modules/', '/__snapshots__/', '/__tests__/', '/__test__/', '/dist/', '/test/', '/fixture/', '/__file_snapshots__/', '/__fixtures__/'];
  return value;
}
function defaultTestPathIgnorePatterns() {
  const value = ['/node_modules/', '/__fixtures__/', '/__file_snapshots__/', '/fixtures/', '/__tests__/helpers/', '/__tests__/utils/', '__mocks__', '/dist/'];
  return value;
}
function defaultTransform(runtime) {
  const paths = [requireResolve.requireResolveExtra('@bluelovers/jest-config').result].filter(Boolean);
  const opts = {
    includeGlobal: true,
    includeCurrentDirectory: true,
    paths
  };
  let ts_transform = _requireResolve('ts-jest');
  ts_transform = [ts_transform, defaultTsJestTransformerOptions(runtime)];
  const {
    result: tsd
  } = requireResolve.requireResolveExtra('jest-tsd-transform', opts);
  if (tsd !== null && tsd !== void 0 && tsd.length) {
    const {
      result: chain
    } = requireResolve.requireResolveExtra('jest-chain-transform', opts);
    if (chain !== null && chain !== void 0 && chain.length) {
      ts_transform = [chain, {
        transformers: [tsd, ts_transform]
      }];
    }
  }
  const value = {
    '.(ts|tsx|mts|cts)$': ts_transform
  };
  return value;
}

var name = "@bluelovers/jest-config";
var version = "1.1.1";

function _newTableBorderless(options) {
  let table$1 = new table.Table({
    colAligns: ['right', 'left'],
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ''
    },
    ...options
  });
  table$1 = table.applyStyleBorderless(table$1);
  return table$1;
}
function printJestConfigInfo(jestConfig, options) {
  var _options, _jestConfig, _options$cwd, _options$file, _jestConfig$cacheDire, _jestConfig$rootDir, _jestConfig$roots, _jestConfig$preset;
  const table = _newTableBorderless();
  (_options = options) !== null && _options !== void 0 ? _options : options = {};
  (_jestConfig = jestConfig) !== null && _jestConfig !== void 0 ? _jestConfig : jestConfig = {};
  table.push([`${name}:`, version]);
  table.push([`process.versions.node:`, process.versions.node]);
  table.push(['cwd:', (_options$cwd = options.cwd) !== null && _options$cwd !== void 0 ? _options$cwd : process.cwd()]);
  ((_options$file = options.file) === null || _options$file === void 0 ? void 0 : _options$file.length) && table.push(['file:', options.file]);
  ((_jestConfig$cacheDire = jestConfig.cacheDirectory) === null || _jestConfig$cacheDire === void 0 ? void 0 : _jestConfig$cacheDire.length) && table.push(['cacheDirectory:', jestConfig.cacheDirectory]);
  ((_jestConfig$rootDir = jestConfig.rootDir) === null || _jestConfig$rootDir === void 0 ? void 0 : _jestConfig$rootDir.length) && table.push(['rootDir:', jestConfig.rootDir]);
  ((_jestConfig$roots = jestConfig.roots) === null || _jestConfig$roots === void 0 ? void 0 : _jestConfig$roots.length) && table.push(['roots:', util.inspect(jestConfig.roots)]);
  ((_jestConfig$preset = jestConfig.preset) === null || _jestConfig$preset === void 0 ? void 0 : _jestConfig$preset.length) && table.push(['preset:', jestConfig.preset]);
  jestConfig.transform && table.push(['transform:', util.inspect(jestConfig.transform, {
    depth: 3
  })]);
  debugColor2.console.gray.log('─'.repeat(20));
  debugColor2.console.log(`jest.config`);
  debugColor2.console.log(table.toString());
  debugColor2.console.gray.log('─'.repeat(20));
}

const cacheDirectory = /*#__PURE__*/jestCacheDirectory.getJestCacheDirectory();
function mixinJestConfig(jestConfig, autoPrint, options) {
  var _jestConfig, _newJestConfig$transf;
  (_jestConfig = jestConfig) !== null && _jestConfig !== void 0 ? _jestConfig : jestConfig = {};
  const newJestConfig = fixJestConfig({
    globals: {},
    cacheDirectory,
    maxWorkers: 1,
    clearMocks: true,
    passWithNoTests: true,
    moduleFileExtensions: defaultModuleFileExtensions(),
    testEnvironment: 'node',
    ...makeTestRegexConfig(defaultTestFileExtensions()),
    testPathIgnorePatterns: defaultTestPathIgnorePatterns(),
    setupFilesAfterEnv: [],
    verbose: true,
    coverageProvider: 'v8',
    collectCoverage: false,
    coveragePathIgnorePatterns: defaultCoveragePathIgnorePatterns(),
    ...jestConfig
  });
  (_newJestConfig$transf = newJestConfig.transform) !== null && _newJestConfig$transf !== void 0 ? _newJestConfig$transf : newJestConfig.transform = defaultTransform({
    jestConfig,
    autoPrint,
    options,
    newJestConfig
  });
  autoPrint && printJestConfigInfo(newJestConfig, options);
  return newJestConfig;
}

exports._newTableBorderless = _newTableBorderless;
exports._requireResolve = _requireResolve;
exports.cacheDirectory = cacheDirectory;
exports["default"] = mixinJestConfig;
exports.defaultCoveragePathIgnorePatterns = defaultCoveragePathIgnorePatterns;
exports.defaultModuleFileExtensions = defaultModuleFileExtensions;
exports.defaultTestFileExtensions = defaultTestFileExtensions;
exports.defaultTestPathIgnorePatterns = defaultTestPathIgnorePatterns;
exports.defaultTransform = defaultTransform;
exports.fixJestConfig = fixJestConfig;
exports.makeTestRegexConfig = makeTestRegexConfig;
exports.mixinJestConfig = mixinJestConfig;
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.development.cjs.map
