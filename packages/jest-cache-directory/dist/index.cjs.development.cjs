'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var os = require('os');
var fsRealpathNative = require('fs-realpath-native');

function getJestCacheDirectoryEnvVar() {
  return process.env['JEST_CACHE_DIRECTORY'];
}
function getJestCacheDirectory() {
  const {
    getuid
  } = process;
  const tmpdirPath = getJestCacheDirectoryEnvVar() || path.join(fsRealpathNative.tryFsRealpathNativeSync(os.tmpdir()), 'jest');
  if (getuid == null) {
    return tmpdirPath;
  } else {
    return `${tmpdirPath}_${getuid.call(process).toString(36)}`;
  }
}

exports.default = getJestCacheDirectory;
exports.getJestCacheDirectory = getJestCacheDirectory;
exports.getJestCacheDirectoryEnvVar = getJestCacheDirectoryEnvVar;
//# sourceMappingURL=index.cjs.development.cjs.map
