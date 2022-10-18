import { join as e } from "path";

import { tmpdir as t } from "os";

import { tryFsRealpathNativeSync as r } from "fs-realpath-native";

function getJestCacheDirectoryEnvVar() {
  return process.env.JEST_CACHE_DIRECTORY;
}

function getJestCacheDirectory() {
  const {getuid: o} = process, c = getJestCacheDirectoryEnvVar() || e(r(t()), "jest");
  return null == o ? c : `${c}_${o.call(process).toString(36)}`;
}

export { getJestCacheDirectory as default, getJestCacheDirectory, getJestCacheDirectoryEnvVar };
//# sourceMappingURL=index.esm.mjs.map
