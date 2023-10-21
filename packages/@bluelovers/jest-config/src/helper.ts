import { requireResolveCore, requireResolveExtra } from '@yarn-tool/require-resolve';
import { InitialOptionsTsJest } from 'ts-jest';
import { ITSValueOrArrayMaybeReadonly } from 'ts-type/lib/type/base';
import { console } from 'debug-color2';
import { IJestConfig } from './types';
import { defaultTestFileExtensions } from './defaults';
import { array_unique } from 'array-hyper-unique';

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

export function makeTestRegexConfig<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>): Pick<InitialOptionsTsJest, 'testMatch' | 'testRegex'>
{
	testExt ??= defaultTestFileExtensions() as any as T[];
	const _testExt = _handleFileExtensions(testExt, '|')

	return {
		testMatch: null as undefined,
		testRegex: [
			`\\.(tests?|spec)\\.(${_testExt})$`,
			`__tests__\/\.*\\.(tests?|spec)\\.(${_testExt})$`,
		],
	}
}

export function _handleFileExtensionsCore<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>)
{
	return array_unique([testExt].flat()) as T[]
}

export function _handleFileExtensions<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>, sep: string)
{
	return _handleFileExtensionsCore(testExt).join(sep)
}

export function fixJestConfig<T extends IJestConfig>(jestConfig: T): T
{
	if (jestConfig.testMatch)
	{
		jestConfig.testRegex = null;
	}
	else if (jestConfig.testRegex)
	{
		jestConfig.testMatch = null;
	}

	return jestConfig
}
