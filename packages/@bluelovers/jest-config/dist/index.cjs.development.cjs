'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var requireResolve = require('@yarn-tool/require-resolve');
var debugColor2 = require('debug-color2');
var arrayHyperUnique = require('array-hyper-unique');
var table = require('@yarn-tool/table');
var util = require('util');
var jestCacheDirectory = require('jest-cache-directory');

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
  const value = ['ts', 'tsx', 'mts', 'cts'
  //	'js',
  //	'jsx',
  //	'mjs',
  //	'cjs',
  ];

  return value;
}
/**
 * @see https://jestjs.io/docs/configuration#options
 */
function defaultModuleFileExtensions() {
  const value = ['js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx', 'json', 'node'];
  return value;
}
function defaultCoverageFileExtensions() {
  const value = ['js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx'
  //'json',
  //'node',
  ];

  return value;
}
function defaultTransformFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts'];
  return value;
}
function defaultCoveragePathIgnorePatterns() {
  const value = ['/node_modules/', '/__snapshots__/', '/__tests__/', '/__test__/',
  //'**/node_modules/',
  //'**/__snapshots__/',
  //'**/__tests__/',
  '/dist/', '/test/', '/fixture/', '/__file_snapshots__/', '/__fixtures__/'];
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
        transformers: [tsd,
        // @ts-ignore
        ts_transform]
      }];
    }
  }
  const value = {
    [`.(${_handleFileExtensions(defaultTransformFileExtensions(), '|')})$`]: ts_transform
  };
  return value;
}

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
  var _testExt2;
  (_testExt2 = testExt) !== null && _testExt2 !== void 0 ? _testExt2 : testExt = defaultTestFileExtensions();
  const _testExt = _handleFileExtensions(testExt, '|');
  return {
    testMatch: null,
    testRegex: [`\\.(tests?|spec)\\.(${_testExt})$`, `__tests__\/\.*\\.(tests?|spec)\\.(${_testExt})$`]
  };
}
function _handleFileExtensionsCore(testExt) {
  return arrayHyperUnique.array_unique([testExt].flat());
}
function _handleFileExtensions(testExt, sep) {
  return _handleFileExtensionsCore(testExt).join(sep);
}
function fixJestConfig(jestConfig) {
  if (jestConfig.testMatch) {
    jestConfig.testRegex = null;
  } else if (jestConfig.testRegex) {
    jestConfig.testMatch = null;
  }
  return jestConfig;
}

var name = "@bluelovers/jest-config";
var version = "1.1.9";

function _newTableBorderless(options) {
  let table$1 = new table.Table({
    colAligns: ['right', 'left'],
    //colAligns: ['left', 'center', 'center', 'center'],
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
  // @ts-ignore
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
  // @ts-ignore
  (_jestConfig = jestConfig) !== null && _jestConfig !== void 0 ? _jestConfig : jestConfig = {};
  const newJestConfig = fixJestConfig({
    globals: {
      //			'ts-jest': {
      //				//tsconfig: 'tsconfig.spec.json',
      //			},
    },
    cacheDirectory,
    maxWorkers: 1,
    clearMocks: true,
    passWithNoTests: true,
    moduleFileExtensions: defaultModuleFileExtensions(),
    //testEnvironment: 'node',
    //testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    ...makeTestRegexConfig(defaultTestFileExtensions()),
    testPathIgnorePatterns: defaultTestPathIgnorePatterns(),
    //testRunner: 'jest-circus/runner',
    setupFilesAfterEnv: [
      //"jest-chain",
      //"jest-extended/all",
      //"jest-extended-extra",
      //"jest-num-close-with",
      /**
       * https://medium.com/doctolib/how-to-run-the-same-jest-test-suite-across-several-platforms-jest-os-detection-plugin-included-f8113832482b
       * https://github.com/doctolib/jest-os-detection
       */
      //'jest-os-detection',
    ],
    //transform: defaultTransform(),
    verbose: true,
    /**
     * if didn't set `coverageProvider` to `v8`
     * with `collectCoverage` `true`, nodejs debug point maybe will fail
     */
    coverageProvider: 'v8',
    collectCoverage: false,
    coveragePathIgnorePatterns: defaultCoveragePathIgnorePatterns(),
    /**
     * https://github.com/facebook/jest/issues/9771#issuecomment-872764344
     */
    //resolver: 'jest-node-exports-resolver',
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

exports._handleFileExtensions = _handleFileExtensions;
exports._handleFileExtensionsCore = _handleFileExtensionsCore;
exports._newTableBorderless = _newTableBorderless;
exports._requireResolve = _requireResolve;
exports.cacheDirectory = cacheDirectory;
exports.default = mixinJestConfig;
exports.defaultCoverageFileExtensions = defaultCoverageFileExtensions;
exports.defaultCoveragePathIgnorePatterns = defaultCoveragePathIgnorePatterns;
exports.defaultModuleFileExtensions = defaultModuleFileExtensions;
exports.defaultTestFileExtensions = defaultTestFileExtensions;
exports.defaultTestPathIgnorePatterns = defaultTestPathIgnorePatterns;
exports.defaultTransform = defaultTransform;
exports.defaultTransformFileExtensions = defaultTransformFileExtensions;
exports.fixJestConfig = fixJestConfig;
exports.makeTestRegexConfig = makeTestRegexConfig;
exports.mixinJestConfig = mixinJestConfig;
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.development.cjs.map
