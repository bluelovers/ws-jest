import { InitialOptionsTsJest, JestConfigWithTsJest } from 'ts-jest';
import { IOptionsPrintJestConfigInfo } from './print';

export type IJestConfig = InitialOptionsTsJest | JestConfigWithTsJest;

export interface IRuntime<T extends IJestConfig = IJestConfig>
{
	jestConfig: T,
	autoPrint: boolean,
	options: IOptionsPrintJestConfigInfo,
	newJestConfig?: T,
}
