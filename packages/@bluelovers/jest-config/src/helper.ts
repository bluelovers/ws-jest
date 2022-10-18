import { requireResolveCore, requireResolveExtra } from '@yarn-tool/require-resolve';
import { InitialOptionsTsJest } from 'ts-jest';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import { console } from 'debug-color2';
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
