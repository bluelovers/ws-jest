'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var requireResolve = require('@yarn-tool/require-resolve');
var path = require('path');
var jestUtil = require('jest-util');
var os = require('os');
var debugColor2 = require('debug-color2');
var table = require('@yarn-tool/table');

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
function getCacheDirectory() {
  const {
    getuid
  } = process;
  const tmpdirPath = process.env['JEST_CACHE_DIRECTORY'] || path.join(jestUtil.tryRealpath(os.tmpdir()), 'jest');

  if (getuid == null) {
    return tmpdirPath;
  } else {
    return `${tmpdirPath}_${getuid.call(process).toString(36)}`;
  }
}
function makeTestRegexConfig(testExt) {
  testExt = [testExt].flat().join('|');
  return {
    testMatch: void 0,
    testRegex: [`\\.(tests?|spec)\\.(${testExt})$`, `__tests__\/\.*\\.(${testExt})$`]
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

function defaultTestFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts'];
  return value;
}
function defaultModuleFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'];
  return value;
}
function defaultCoveragePathIgnorePatterns() {
  const value = ['/node_modules/', '/__snapshots__/', '/__tests__/', '/__test__/', '/dist/', '/test/', '/fixture/'];
  return value;
}
function defaultTestPathIgnorePatterns() {
  const value = ['/node_modules/', '/__fixtures__/', '/fixtures/', '/__tests__/helpers/', '/__tests__/utils/', '__mocks__', '/dist/'];
  return value;
}

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
  var _options, _jestConfig, _options$cwd, _options$file, _jestConfig$cacheDire;

  const table = _newTableBorderless();

  (_options = options) !== null && _options !== void 0 ? _options : options = {};
  (_jestConfig = jestConfig) !== null && _jestConfig !== void 0 ? _jestConfig : jestConfig = {};
  table.push(['cwd:', (_options$cwd = options.cwd) !== null && _options$cwd !== void 0 ? _options$cwd : process.cwd()]);
  ((_options$file = options.file) === null || _options$file === void 0 ? void 0 : _options$file.length) && table.push(['file:', options.file]);
  ((_jestConfig$cacheDire = jestConfig.cacheDirectory) === null || _jestConfig$cacheDire === void 0 ? void 0 : _jestConfig$cacheDire.length) && table.push(['cacheDirectory:', jestConfig.cacheDirectory]);
  debugColor2.console.gray.log('─'.repeat(20));
  debugColor2.console.log(`jest.config`);
  debugColor2.console.log(table.toString());
  debugColor2.console.gray.log('─'.repeat(20));
}

const cacheDirectory = /*#__PURE__*/getCacheDirectory();
function mixinJestConfig(jestConfig, autoPrint, options) {
  var _jestConfig;

  (_jestConfig = jestConfig) !== null && _jestConfig !== void 0 ? _jestConfig : jestConfig = {};
  const newJestConfig = fixJestConfig({
    globals: {
      'ts-jest': {}
    },
    cacheDirectory,
    maxWorkers: 1,
    clearMocks: true,
    passWithNoTests: true,
    moduleFileExtensions: defaultModuleFileExtensions(),
    testEnvironment: 'node',
    ...makeTestRegexConfig(defaultTestFileExtensions()),
    testPathIgnorePatterns: defaultTestPathIgnorePatterns(),
    setupFilesAfterEnv: [],
    transform: {
      '.(ts|tsx|mts|cts)$': _requireResolve('ts-jest')
    },
    verbose: true,
    coverageProvider: 'v8',
    collectCoverage: false,
    coveragePathIgnorePatterns: defaultCoveragePathIgnorePatterns(),
    ...jestConfig
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
exports.fixJestConfig = fixJestConfig;
exports.getCacheDirectory = getCacheDirectory;
exports.makeTestRegexConfig = makeTestRegexConfig;
exports.mixinJestConfig = mixinJestConfig;
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.development.cjs.map