import { Table } from '@yarn-tool/table';
import { TableConstructorOptions } from 'cli-table3';
import { InitialOptionsTsJest } from 'ts-jest';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';

export declare function _newTableBorderless(options?: TableConstructorOptions): Table.Table;
export interface IOptionsPrintJestConfigInfo {
	cwd?: string;
	file?: string;
}
export declare function printJestConfigInfo(jestConfig: InitialOptionsTsJest, options?: IOptionsPrintJestConfigInfo): void;
export declare function _requireResolve(name: string): string;
/**
 * @see https://github.com/facebook/jest/blob/main/packages/jest-config/src/getCacheDirectory.ts
 */
export declare function getCacheDirectory(): string;
export declare function makeTestRegexConfig(testExt: string | ITSArrayListMaybeReadonly<string>): Pick<InitialOptionsTsJest, "testMatch" | "testRegex">;
export declare function fixJestConfig<T extends InitialOptionsTsJest>(jestConfig: T): T;
export declare function defaultTestFileExtensions(): [
	"ts",
	"tsx",
	"mts",
	"cts"
];
export declare function defaultModuleFileExtensions(): [
	"ts",
	"tsx",
	"mts",
	"cts",
	"js",
	"jsx",
	"mjs",
	"cjs",
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
export declare const cacheDirectory: string;
export declare function mixinJestConfig<T extends InitialOptionsTsJest>(jestConfig?: T, autoPrint?: boolean, options?: IOptionsPrintJestConfigInfo): T;

export {
	mixinJestConfig as default,
};

export {};
