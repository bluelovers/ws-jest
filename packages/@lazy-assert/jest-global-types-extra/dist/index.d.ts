/// <reference types="jest" />
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import { SnapshotState } from 'jest-snapshot';
import { Config } from '@jest/types';
export declare const enum EnumUpdateSnapshot {
    'none' = "none",
    'new' = "new",
    'all' = "all"
}
interface I_SnapshotStateCore {
    _counters: Map<string, number>;
    _dirty: boolean;
    _index: number;
    readonly _updateSnapshot: Config.SnapshotUpdateState & ITSTypeAndStringLiteral<EnumUpdateSnapshot>;
    readonly _snapshotPath: string;
    readonly _rootDir: string;
}
export interface ISnapshotState extends ITSOverwrite<SnapshotState, I_SnapshotStateCore> {
}
interface I_CustomMatcherResult {
    actual?: unknown;
    expected?: unknown;
    name?: string;
}
declare global {
    namespace jest {
        interface CustomMatcherResult extends I_CustomMatcherResult {
        }
    }
}
declare module 'expect' {
    interface MatcherState {
        snapshotState?: ISnapshotState;
    }
    type SyncExpectationResult = {
        pass: boolean;
        message(): string;
    } & I_CustomMatcherResult;
}
export type ICustomMatcherResult = jest.CustomMatcherResult;
export type ICustomMatcherResultRequired = Required<jest.CustomMatcherResult>;
export type IMatcherContext = jest.MatcherContext;
export type IExpectExtendMap = jest.ExpectExtendMap;
export {};
