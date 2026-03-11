import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import { type SnapshotState as SnapshotStateType } from 'jest-snapshot';
import { Config } from '@jest/types';
/**
 * Snapshot 更新模式列舉
 * Snapshot update mode enumeration
 */
export declare const enum EnumUpdateSnapshot {
    /** 不更新 / Do not update */
    'none' = "none",
    /** 僅新增 / Only new */
    'new' = "new",
    /** 更新全部 / Update all */
    'all' = "all"
}
/**
 * Snapshot 狀態核心介面
 * Snapshot state core interface
 */
interface I_SnapshotStateCore {
    /** 計數器映射表 / Counter map */
    _counters: Map<string, number>;
    /** 是否有變更 / Whether modified */
    _dirty: boolean;
    /** 當前索引 / Current index */
    _index: number;
    /** 更新模式 / Update mode */
    readonly _updateSnapshot: Config.SnapshotUpdateState & ITSTypeAndStringLiteral<EnumUpdateSnapshot>;
    /** Snapshot 檔案路徑 / Snapshot file path */
    readonly _snapshotPath: string;
    /** 根目錄 / Root directory */
    readonly _rootDir: string;
}
/**
 * Snapshot 狀態介面（合併類型）
 * Snapshot state interface (merged type)
 */
export interface ISnapshotState extends ITSOverwrite<SnapshotStateType, I_SnapshotStateCore> {
}
/**
 * 自定義匹配器結果介面
 * Custom matcher result interface
 */
interface I_CustomMatcherResult {
    /** 實際值 / Actual value */
    actual?: unknown;
    /** 預期值 / Expected value */
    expected?: unknown;
    /** 匹配器名稱 / Matcher name */
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
/** 自定義匹配器結果類型 / Custom matcher result type */
export type ICustomMatcherResult = jest.CustomMatcherResult;
/** 必填的自定義匹配器結果類型 / Required custom matcher result type */
export type ICustomMatcherResultRequired = Required<jest.CustomMatcherResult>;
/** 匹配器上下文類型 / Matcher context type */
export type IMatcherContext = jest.MatcherContext;
/** Expect 擴展映射類型 / Expect extend map type */
export type IExpectExtendMap = jest.ExpectExtendMap;
export {};
