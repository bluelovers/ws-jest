import { requireResolveCore, requireResolveExtra } from '@yarn-tool/require-resolve';
import { join } from 'path';
import { tmpdir } from 'os';
import { InitialOptionsTsJest } from 'ts-jest';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import { console } from 'debug-color2';
import { realpathSync } from 'graceful-fs';
import { IJestConfig } from './types';

export function _requireResolve(name: string)
{
	const paths = [
		requireResolveExtra('@bluelovers/tsdx').result,
		requireResolveExtra('tsdx').result,
	].filter(Boolean);

	const result = requireResolveCore(name, {
		includeGlobal: true,
		includeCurrentDirectory: true,
		paths,
	});

	console.debug('[require.resolve]', name, '=>', result)

	return result
}

/**
 * @see https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts
 */
export function getCacheDirectory()
{
	const { getuid } = process;
	const tmpdirPath = process.env['JEST_CACHE_DIRECTORY'] || join(tryRealpath(tmpdir()), 'jest');
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

export function makeTestRegexConfig(testExt: string | ITSArrayListMaybeReadonly<string>): Pick<InitialOptionsTsJest, 'testMatch' | 'testRegex'>
{
	testExt = [testExt].flat().join('|');

	return {
		testMatch: void 0 as undefined,
		testRegex: [
			`\\.(tests?|spec)\\.(${testExt})$`,
			`__tests__\/\.*\\.(tests?|spec)\\.(${testExt})$`,
		],
	}
}

export function fixJestConfig<T extends IJestConfig>(jestConfig: T): T
{
	if (jestConfig.testMatch)
	{
		jestConfig.testRegex = void 0;
	}
	else if (jestConfig.testRegex)
	{
		jestConfig.testMatch = void 0;
	}

	return jestConfig
}

/**
 * @see https://github.com/facebook/jest/blob/main/packages/jest-util/src/tryRealpath.ts
 */
export default function tryRealpath(path: string): string
{
	try
	{
		path = realpathSync.native(path);
	}
	catch (error: any)
	{
		if (error.code !== 'ENOENT')
		{
			throw error;
		}
	}

	return path;
}
