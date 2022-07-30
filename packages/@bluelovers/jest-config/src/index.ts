import { InitialOptionsTsJest } from 'ts-jest';
import { _requireResolve, fixJestConfig, getCacheDirectory, makeTestRegexConfig } from './helper';
import {
	defaultCoveragePathIgnorePatterns,
	defaultModuleFileExtensions,
	defaultTestFileExtensions,
	defaultTestPathIgnorePatterns,
} from './defaults';
import { IOptionsPrintJestConfigInfo, printJestConfigInfo } from './print';

export * from './helper';
export * from './defaults';
export * from './print';

const cacheDirectory = getCacheDirectory();

export { cacheDirectory }

export function mixinJestConfig<T extends InitialOptionsTsJest>(jestConfig?: T, autoPrint?: boolean,
	options?: IOptionsPrintJestConfigInfo): T
{
	// @ts-ignore
	jestConfig ??= {};
	const newJestConfig = fixJestConfig<T>({
		globals: {
			'ts-jest': {
				//tsconfig: 'tsconfig.spec.json',
			},
		},
		cacheDirectory,
		maxWorkers: 1,
		clearMocks: true,
		passWithNoTests: true,
		moduleFileExtensions: defaultModuleFileExtensions(),
		testEnvironment: 'node',
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
		transform: {
			'.(ts|tsx|mts|cts)$': _requireResolve('ts-jest'),
		},
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
		...jestConfig,
	});

	autoPrint && printJestConfigInfo(newJestConfig, options);

	return newJestConfig
}

export default mixinJestConfig
