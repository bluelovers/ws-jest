'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var requireResolve = require('@yarn-tool/require-resolve');
var debugColor2 = require('debug-color2');
var arrayHyperUnique = require('array-hyper-unique');
var table = require('@yarn-tool/table');
var util = require('util');
var jestCacheDirectory = require('jest-cache-directory');
var regexpHelperCore = require('regexp-helper-core');

/**
 * 取得預設的測試檔案副檔名列表
 * Get default test file extensions list
 *
 * 定義哪些副檔名的檔案會被視為測試檔案
 * Defines which file extensions are recognized as test files
 *
 * @returns {string[]} 測試檔案副檔名陣列 / Array of test file extensions
 */
function defaultTestFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts'];
  return value;
}
/**
 * 取得預設的模組檔案副檔名列表
 * Get default module file extensions list
 *
 * 定義模組解析時搜尋的副檔名順序
 * Defines the order of extensions to search during module resolution
 *
 * @see https://jestjs.io/docs/configuration#options
 * @returns {string[]} 模組檔案副檔名陣列 / Array of module file extensions
 */
function defaultModuleFileExtensions() {
  const value = ['js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx', 'json', 'node'];
  return value;
}
/**
 * 取得預設的覆蓋率檔案副檔名列表
 * Get default coverage file extensions list
 *
 * 定義哪些副檔名的檔案會被納入覆蓋率統計
 * Defines which file extensions are included in coverage statistics
 *
 * @returns {string[]} 覆蓋率檔案副檔名陣列 / Array of coverage file extensions
 */
function defaultCoverageFileExtensions() {
  const value = ['js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx'];
  return value;
}
/**
 * 取得預設的轉換器檔案副檔名列表
 * Get default transformer file extensions list
 *
 * 定義哪些副檔名的檔案需要經過 ts-jest 轉換
 * Defines which file extensions need to be transformed by ts-jest
 *
 * @returns {string[]} 轉換器檔案副檔名陣列 / Array of transformer file extensions
 */
function defaultTransformFileExtensions() {
  const value = ['ts', 'tsx', 'mts', 'cts'];
  return value;
}
/**
 * 取得預設的覆蓋率忽略路徑模式
 * Get default coverage path ignore patterns
 *
 * 定義哪些路徑的檔案不納入覆蓋率統計
 * Defines which paths are excluded from coverage statistics
 *
 * @returns {string[]} 覆蓋率忽略路徑模式陣列 / Array of coverage ignore patterns
 */
function defaultCoveragePathIgnorePatterns() {
  const value = ['/node_modules/', '/__snapshots__/', '/__tests__/', '/__test__/', '/dist/', '/test/', '/fixture/', '/__file_snapshots__/', '/__fixtures__/'];
  return value;
}
/**
 * 取得預設的測試路徑忽略模式
 * Get default test path ignore patterns
 *
 * 定義哪些路徑的檔案不會被視為測試檔案
 * Defines which paths are excluded from test file recognition
 *
 * @returns {string[]} 測試路徑忽略模式陣列 / Array of test path ignore patterns
 */
function defaultTestPathIgnorePatterns() {
  const value = ['/node_modules/', '/__fixtures__/', '/__file_snapshots__/', '/fixtures/', '/__tests__/helpers/', '/__tests__/utils/', '__mocks__', '/dist/'];
  return value;
}

/**
 * 解析模組路徑的內部輔助函數
 * Internal helper function for resolving module paths
 *
 * 優先從 @bluelovers/tsdx 或 tsdx 套件路徑中搜尋，若失敗則使用標準 require.resolve
 * Searches from @bluelovers/tsdx or tsdx package paths first, falls back to standard require.resolve
 *
 * @param {string} name - 要解析的模組名稱 / Module name to resolve
 * @returns {string} 解析後的模組絕對路徑 / Resolved absolute module path
 */
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
function _requireResolve2(name) {
  return requireResolve.requireResolveExtra(name, {
    includeGlobal: true,
    includeCurrentDirectory: true
  });
}
/**
 * 建立測試正則表達式配置
 * Create test regex configuration
 *
 * 根據測試檔案副檔名生成 testMatch 和 testRegex 配置
 * Generates testMatch and testRegex configs based on test file extensions
 *
 * @param {T} testExt - 測試檔案副檔名或陣列 / Test file extension(s)
 * @returns {object} 包含 testMatch 和 testRegex 的配置物件 / Object containing testMatch and testRegex
 */
function makeTestRegexConfig(testExt) {
  testExt !== null && testExt !== void 0 ? testExt : testExt = defaultTestFileExtensions();
  const _testExt = _handleFileExtensions(testExt, '|');
  return {
    testMatch: null,
    testRegex: [`\\.(tests?|spec)\\.(${_testExt})$`, `__tests__\/\.*\\.(tests?|spec)\\.(${_testExt})$`]
  };
}
/**
 * 處理檔案副檔名陣列的核心函數
 * Core function for processing file extension arrays
 *
 * 將輸入轉換為唯一的副檔名陣列
 * Converts input to unique array of extensions
 *
 * @param {T} testExt - 輸入的副檔名（可為陣列或單一值） / Input extension(s)
 * @returns {T[]} 唯一的副檔名陣列 / Unique array of extensions
 */
function _handleFileExtensionsCore(testExt) {
  return arrayHyperUnique.array_unique([testExt].flat());
}
/**
 * 處理檔案副檔名並以指定分隔符連接
 * Process file extensions and join with specified separator
 *
 * @param {T} testExt - 輸入的副檔名（可為陣列或單一值） / Input extension(s)
 * @param {string} sep - 分隔符號 / Separator string
 * @returns {string} 連接後的副檔名字串 / Joined extension string
 */
function _handleFileExtensions(testExt, sep) {
  return _handleFileExtensionsCore(testExt).join(sep);
}
/**
 * 修復 Jest 配置中的相容性問題
 * Fix compatibility issues in Jest configuration
 *
 * 處理 testMatch/testRegex 互斥問題以及 testURL 已棄用選項的遷移
 * Handles testMatch/testRegex mutual exclusivity and testURL deprecated option migration
 *
 * @param {T} jestConfig - 原始 Jest 配置 / Original Jest configuration
 * @returns {T} 修復後的 Jest 配置 / Fixed Jest configuration
 */
function fixJestConfig(jestConfig) {
  if (jestConfig.testMatch) {
    jestConfig.testRegex = null;
  } else if (jestConfig.testRegex) {
    jestConfig.testMatch = null;
  }
  /**
   * testURL 選項已被 testEnvironmentOptions.url 取代
   * testURL option has been replaced by testEnvironmentOptions.url
   *
   * @see https://jestjs.io/docs/configuration#testurl-string
   */
  if (jestConfig.testURL) {
    var _jestConfig$testEnvir, _jestConfig$testEnvir2, _url, _jestConfig$testEnvir3;
    (_jestConfig$testEnvir = jestConfig.testEnvironmentOptions) !== null && _jestConfig$testEnvir !== void 0 ? _jestConfig$testEnvir : jestConfig.testEnvironmentOptions = {};
    jestConfig.testURL = (_jestConfig$testEnvir3 = (_jestConfig$testEnvir2 = jestConfig.testEnvironmentOptions)[_url = 'url']) !== null && _jestConfig$testEnvir3 !== void 0 ? _jestConfig$testEnvir3 : _jestConfig$testEnvir2[_url] = jestConfig.testURL;
  }
  return jestConfig;
}

var name = "@bluelovers/jest-config";
var version = "1.1.12";

/**
 * 建立無邊框表格實例
 * Create borderless table instance
 *
 * 用於以整齊的格式顯示 Jest 配置資訊
 * Used to display Jest configuration info in a neat format
 *
 * @param {TableConstructorOptions} options - 表格建構選項 / Table constructor options
 * @returns {Table} 無邊框表格實例 / Borderless table instance
 */
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
/**
 * 印出 Jest 配置資訊
 * Print Jest configuration information
 *
 * 以表格格式顯示當前 Jest 配置的關鍵資訊，方便除錯和確認設定
 * Displays key info of current Jest config in table format for debugging and verification
 *
 * @param {IJestConfig} jestConfig - Jest 配置物件 / Jest configuration object
 * @param {IOptionsPrintJestConfigInfo} options - 印出選項 / Print options
 */
function printJestConfigInfo(jestConfig, options) {
  var _options$cwd, _options$file, _jestConfig$cacheDire, _jestConfig$rootDir, _jestConfig$roots, _jestConfig$preset;
  const table = _newTableBorderless();
  options !== null && options !== void 0 ? options : options = {};
  // @ts-ignore
  jestConfig !== null && jestConfig !== void 0 ? jestConfig : jestConfig = {};
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

/**
 * 取得預設的 ts-jest 轉換器選項
 * Get default ts-jest transformer options
 *
 * 此函數會合併使用者自定義的 ts-jest 設定與預設值，確保測試環境的最佳配置
 * This function merges user custom ts-jest settings with defaults for optimal test environment
 *
 * 主要調整項目:
 * - 禁用輸出檔案（noEmit: true）
 * - 允許未使用的參數和標籤（用於測試開發）
 * - 禁用嚴格的型別檢查選項（確保測試能順利執行）
 *
 * Key adjustments:
 * - Disable file output (noEmit: true)
 * - Allow unused parameters and labels (for test development)
 * - Disable strict type checking options (ensure tests run smoothly)
 *
 * @param runtime - 執行時期配置，包含原始 Jest 配置 / Runtime configuration containing original Jest config
 * @returns ts-jest 轉換器選項 / ts-jest transformer options
 */
function defaultTsJestTransformerOptions(runtime) {
  var _runtime$jestConfig$g, _runtime$jestConfig$g2, _tsconfig$types;
  const old = (_runtime$jestConfig$g = (_runtime$jestConfig$g2 = runtime.jestConfig.globals) === null || _runtime$jestConfig$g2 === void 0 ? void 0 : _runtime$jestConfig$g2['ts-jest']) !== null && _runtime$jestConfig$g !== void 0 ? _runtime$jestConfig$g : {};
  const tsconfig = typeof old.tsconfig === 'object' ? old.tsconfig : {};
  const types = arrayHyperUnique.array_unique([...((_tsconfig$types = tsconfig.types) !== null && _tsconfig$types !== void 0 ? _tsconfig$types : []), 'jest']);
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
      ...tsconfig,
      types
    }
  };
}

/**
 * 建立預設的轉換器配置
 * Create default transformer configuration
 *
 * 配置 ts-jest 作為主要轉換器，並在可用時整合 jest-tsd-transform 和 jest-chain-transform
 * Configures ts-jest as the main transformer, integrating jest-tsd-transform and jest-chain-transform when available
 *
 * @param {IRuntime} runtime - 執行時期配置 / Runtime configuration
 * @returns {object} 轉換器配置物件 / Transformer configuration object
 */
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

/**
 * Detects all values in an array that include any of the given keys.
 *
 * @example
 * const arr = ['abc', 'def', 'ghi'];
 * const keys = ['a', 'e', 'i'];
 * const result = detectIncludes(arr, keys);
 * // result is { a: ['abc', 'def'], e: ['def', 'ghi'], i: ['abc', 'ghi'] }
 *
 * @param arr - The array to search.
 * @param keys - The keys to search for.
 * @returns An object with the keys as properties and the
 *   corresponding values as arrays of strings.
 */
function detectIncludes(arr, keys) {
  let result = {};
  if (arr !== null && arr !== void 0 && arr.length) {
    if (keys.length) {
      keys = Array.isArray(keys) ? keys : [keys];
      const re = new RegExp(`(${escapeArrayToRegExpSource(keys)})`);
      arr.forEach(value => {
        var _match, _ref;
        let m = value === null || value === void 0 || (_match = (_ref = value).match) === null || _match === void 0 ? void 0 : _match.call(_ref, re);
        if (m) {
          var _result$k;
          const k = m[1];
          ((_result$k = result[k]) !== null && _result$k !== void 0 ? _result$k : result[k] = []).push(value);
        }
        return result;
      });
    }
  }
  return result;
}
/**
 * Escapes all strings in an array to be used in a regular expression source.
 *
 * @example
 * const arr = ['abc', 'def', 'ghi'];
 * const result = escapeArrayToRegExpSource(arr);
 * // result is 'abc|def|ghi'
 *
 * @param arr - The array of strings to escape.
 * @returns A single string that can be used as a regular expression source.
 */
function escapeArrayToRegExpSource(arr) {
  return arr.map(s => regexpHelperCore.escapeRegExp(s)).join("|");
}

function defaultSetupFiles(runtime) {
  var _runtime$jestConfig, _jestConfig$setupFile, _jestConfig$setupFile2;
  const jestConfig = (_runtime$jestConfig = runtime === null || runtime === void 0 ? void 0 : runtime.jestConfig) !== null && _runtime$jestConfig !== void 0 ? _runtime$jestConfig : {};
  let detect = detectIncludes(jestConfig.setupFiles, 'dotenv');
  const setupFiles = [
  /**
   * @see https://lusbuab.medium.com/using-dotenv-with-jest-7e735b34e55f
   */
  !detect['dotenv'] && _requireResolve2('dotenv/config').result, ...((_jestConfig$setupFile = jestConfig.setupFiles) !== null && _jestConfig$setupFile !== void 0 ? _jestConfig$setupFile : [])].filter(Boolean);
  const setupFilesAfterEnv = [
  /**
   * 跨平台測試支援參考 / Cross-platform testing support reference
   * @see https://medium.com/doctolib/how-to-run-the-same-jest-test-suite-across-several-platforms-jest-os-detection-plugin-included-f8113832482b
   * @see https://github.com/doctolib/jest-os-detection
   */
  ...((_jestConfig$setupFile2 = jestConfig.setupFilesAfterEnv) !== null && _jestConfig$setupFile2 !== void 0 ? _jestConfig$setupFile2 : [])].filter(Boolean);
  const ret = {};
  if (setupFiles.length) {
    ret.setupFiles = setupFiles;
  }
  if (setupFilesAfterEnv.length) {
    ret.setupFilesAfterEnv = setupFilesAfterEnv;
  }
  return ret;
}

const cacheDirectory = /*#__PURE__*/jestCacheDirectory.getJestCacheDirectory();
/**
 * 混合 Jest 配置函數 - 將預設配置與使用者自定義配置合併
 * Mix Jest configuration function - Merges default config with user custom config
 *
 * 此函數提供了一個完整的 Jest 配置模板，包含 TypeScript 支援、快取管理、覆蓋率收集等功能
 * This function provides a complete Jest configuration template with TypeScript support,
 * cache management, coverage collection, and more.
 *
 * @param {T} jestConfig - 使用者自定義的 Jest 配置 / User custom Jest configuration
 * @param {boolean} autoPrint - 是否自動印出配置資訊 / Whether to auto print config info
 * @param {IOptionsPrintJestConfigInfo} options - 印出配置的選項 / Options for printing config
 * @returns {T} 合併後的完整 Jest 配置 / Merged complete Jest configuration
 */
function mixinJestConfig(jestConfig, autoPrint, options) {
  var _newJestConfig$transf;
  // @ts-ignore
  jestConfig !== null && jestConfig !== void 0 ? jestConfig : jestConfig = {};
  const newJestConfig = fixJestConfig({
    globals: {},
    cacheDirectory,
    maxWorkers: 1,
    clearMocks: true,
    passWithNoTests: true,
    moduleFileExtensions: defaultModuleFileExtensions(),
    ...makeTestRegexConfig(defaultTestFileExtensions()),
    testPathIgnorePatterns: defaultTestPathIgnorePatterns(),
    ...defaultSetupFiles(),
    verbose: true,
    coverageProvider: 'v8',
    collectCoverage: false,
    coveragePathIgnorePatterns: defaultCoveragePathIgnorePatterns(),
    /**
     * Jest 模組解析器參考 / Jest module resolver reference
     * @see https://github.com/facebook/jest/issues/9771#issuecomment-872764344
     */
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
exports._requireResolve2 = _requireResolve2;
exports.cacheDirectory = cacheDirectory;
exports.default = mixinJestConfig;
exports.defaultCoverageFileExtensions = defaultCoverageFileExtensions;
exports.defaultCoveragePathIgnorePatterns = defaultCoveragePathIgnorePatterns;
exports.defaultModuleFileExtensions = defaultModuleFileExtensions;
exports.defaultSetupFiles = defaultSetupFiles;
exports.defaultTestFileExtensions = defaultTestFileExtensions;
exports.defaultTestPathIgnorePatterns = defaultTestPathIgnorePatterns;
exports.defaultTransform = defaultTransform;
exports.defaultTransformFileExtensions = defaultTransformFileExtensions;
exports.fixJestConfig = fixJestConfig;
exports.makeTestRegexConfig = makeTestRegexConfig;
exports.mixinJestConfig = mixinJestConfig;
exports.printJestConfigInfo = printJestConfigInfo;
//# sourceMappingURL=index.cjs.development.cjs.map
