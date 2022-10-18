"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("path"), t = require("os"), r = require("fs-realpath-native");

function getJestCacheDirectoryEnvVar() {
  return process.env.JEST_CACHE_DIRECTORY;
}

function getJestCacheDirectory() {
  const {getuid: c} = process, s = getJestCacheDirectoryEnvVar() || e.join(r.tryFsRealpathNativeSync(t.tmpdir()), "jest");
  return null == c ? s : `${s}_${c.call(process).toString(36)}`;
}

exports.default = getJestCacheDirectory, exports.getJestCacheDirectory = getJestCacheDirectory, 
exports.getJestCacheDirectoryEnvVar = getJestCacheDirectoryEnvVar;
//# sourceMappingURL=index.cjs.production.min.cjs.map
