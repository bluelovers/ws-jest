import { Table } from '@yarn-tool/table';
import { TableConstructorOptions } from 'cli-table3';
import { InitialOptionsTsJest, JestConfigWithTsJest } from 'ts-jest';
import { ITSWriteable } from 'ts-type/lib/helper/readonly';
import { ITSValueOrArrayMaybeReadonly } from 'ts-type/lib/type/base';

export type IJestConfig = InitialOptionsTsJest | JestConfigWithTsJest;
export interface IRuntime<T extends IJestConfig = IJestConfig> {
	jestConfig: T;
	autoPrint: boolean;
	options: IOptionsPrintJestConfigInfo;
	newJestConfig?: T;
}
export declare function _newTableBorderless(options?: TableConstructorOptions): Table.Table;
export interface IOptionsPrintJestConfigInfo {
	cwd?: string;
	file?: string;
}
export declare function printJestConfigInfo(jestConfig: IJestConfig, options?: IOptionsPrintJestConfigInfo): void;
export declare function _requireResolve(name: string): string;
export declare function makeTestRegexConfig<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>): Pick<InitialOptionsTsJest, "testMatch" | "testRegex">;
export declare function _handleFileExtensionsCore<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>): T[];
export declare function _handleFileExtensions<T extends string>(testExt: ITSValueOrArrayMaybeReadonly<T>, sep: string): string;
export declare function fixJestConfig<T extends IJestConfig>(jestConfig: T): T;
export declare function defaultTestFileExtensions(): [
	"ts",
	"tsx",
	"mts",
	"cts"
];
/**
 * @see https://jestjs.io/docs/configuration#options
 */
export declare function defaultModuleFileExtensions(): [
	"js",
	"mjs",
	"cjs",
	"jsx",
	"ts",
	"mts",
	"cts",
	"tsx",
	"json",
	"node"
];
export declare function defaultCoverageFileExtensions(): [
	"js",
	"mjs",
	"cjs",
	"jsx",
	"ts",
	"mts",
	"cts",
	"tsx"
];
export declare function defaultTransformFileExtensions(): [
	"ts",
	"tsx",
	"mts",
	"cts"
];
export declare function defaultCoveragePathIgnorePatterns(): [
	"/node_modules/",
	"/__snapshots__/",
	"/__tests__/",
	"/__test__/",
	"/dist/",
	"/test/",
	"/fixture/",
	"/__file_snapshots__/",
	"/__fixtures__/"
];
export declare function defaultTestPathIgnorePatterns(): [
	"/node_modules/",
	"/__fixtures__/",
	"/__file_snapshots__/",
	"/fixtures/",
	"/__tests__/helpers/",
	"/__tests__/utils/",
	"__mocks__",
	"/dist/"
];
export declare function defaultTransform(runtime: IRuntime): ITSWriteable<{
	readonly [x: string]: import("@jest/types/build/Config").TransformerConfig;
}>;
export declare const cacheDirectory: string;
export declare function mixinJestConfig<T extends IJestConfig>(jestConfig?: T, autoPrint?: boolean, options?: IOptionsPrintJestConfigInfo): {
	testPathIgnorePatterns: [
		"/node_modules/",
		"/__fixtures__/",
		"/__file_snapshots__/",
		"/fixtures/",
		"/__tests__/helpers/",
		"/__tests__/utils/",
		"__mocks__",
		"/dist/"
	];
	setupFilesAfterEnv: any[];
	verbose: true;
	/**
	 * if didn't set `coverageProvider` to `v8`
	 * with `collectCoverage` `true`, nodejs debug point maybe will fail
	 */
	coverageProvider: "v8";
	collectCoverage: false;
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/__snapshots__/",
		"/__tests__/",
		"/__test__/",
		"/dist/",
		"/test/",
		"/fixture/",
		"/__file_snapshots__/",
		"/__fixtures__/"
	];
	testMatch?: string[];
	testRegex?: string | string[];
	globals: {};
	cacheDirectory: string;
	maxWorkers: number;
	clearMocks: true;
	passWithNoTests: true;
	moduleFileExtensions: [
		"js",
		"mjs",
		"cjs",
		"jsx",
		"ts",
		"mts",
		"cts",
		"tsx",
		"json",
		"node"
	];
} & T;

export {
	mixinJestConfig as default,
};

export {};
