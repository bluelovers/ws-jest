/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import { SnapshotStateType } from 'jest-snapshot';
import { Config } from '@jest/types';

export const enum EnumUpdateSnapshot
{
	'none' = 'none',
	'new' = 'new',
	'all' = 'all',
}

interface I_SnapshotStateCore
{
	_counters: Map<string, number>;
	_dirty: boolean;
	_index: number;
	readonly _updateSnapshot: Config.SnapshotUpdateState & ITSTypeAndStringLiteral<EnumUpdateSnapshot>,
	readonly _snapshotPath: string;
	readonly _rootDir: string;
}

export interface ISnapshotState extends ITSOverwrite<SnapshotStateType, I_SnapshotStateCore>
{

}

interface I_CustomMatcherResult
{
	actual?: unknown,
	expected?: unknown,
	name?: string,
}

declare global
{
	namespace jest
	{
		interface CustomMatcherResult extends I_CustomMatcherResult
		{

		}
	}
}

declare module 'expect'
{
	// @ts-ignore
	interface MatcherState
	{
		snapshotState?: ISnapshotState
	}

	// @ts-ignore
	type SyncExpectationResult = {
		pass: boolean;
		message(): string;
	} & I_CustomMatcherResult;
}

export type ICustomMatcherResult = jest.CustomMatcherResult;
export type ICustomMatcherResultRequired = Required<jest.CustomMatcherResult>;

export type IMatcherContext = jest.MatcherContext;
export type IExpectExtendMap = jest.ExpectExtendMap;
