import { Table } from '@yarn-tool/table';
import { TableConstructorOptions } from 'cli-table3';
import { InitialOptionsTsJest, JestConfigWithTsJest } from 'ts-jest';
import { ITSWriteable } from 'ts-type/lib/helper/readonly';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';

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
export declare function makeTestRegexConfig(testExt: string | ITSArrayListMaybeReadonly<string>): Pick<InitialOptionsTsJest, "testMatch" | "testRegex">;
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
	readonly ".(ts|tsx|mts|cts)$": [
		string,
		Record<string, unknown>
	];
}>;
export declare const cacheDirectory: string;
export declare function mixinJestConfig<T extends IJestConfig>(jestConfig?: T, autoPrint?: boolean, options?: IOptionsPrintJestConfigInfo): T;

export {
	mixinJestConfig as default,
};

export {};
