import { join } from 'path';
import { tmpdir } from 'os';
import { tryFsRealpathNativeSync } from 'fs-realpath-native';

declare global
{
	namespace NodeJS
	{
		interface ProcessEnv
		{
			JEST_CACHE_DIRECTORY?: string
		}
	}
}

/**
 * process.env['JEST_CACHE_DIRECTORY']
 */
export function getJestCacheDirectoryEnvVar(): string
{
	return process.env['JEST_CACHE_DIRECTORY']
}

/**
 * @see https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts
 */
export function getJestCacheDirectory()
{
	const { getuid } = process;
	const tmpdirPath = getJestCacheDirectoryEnvVar() || join(tryFsRealpathNativeSync(tmpdir()), 'jest');
	if (getuid == null)
	{
		return tmpdirPath;
	}
	else
	{
		// On some platforms tmpdir() is `/tmp`, causing conflicts between different
		// users and permission issues. Adding an additional subdivision by UID can
		// help.
		return `${tmpdirPath}_${getuid.call(process).toString(36)}`;
	}
}

export default getJestCacheDirectory
