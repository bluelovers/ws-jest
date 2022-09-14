/// <reference types="jest" />
/// <reference types="node" />
import { DiffOptions } from 'jest-matcher-utils';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { IFindRootReturnType } from '@yarn-tool/find-root';
export interface IFileMatcherOptions {
    diff?: DiffOptions;
}
declare global {
    namespace jest {
        interface Matchers<R, T> {
            toMatchFile(filename?: string, options?: IFileMatcherOptions): void;
        }
        interface Expect {
            toMatchFile: (filename?: string, options?: IFileMatcherOptions) => void;
        }
    }
}
export interface IMatcherContext extends jest.MatcherContext {
    snapshotState?: {
        added: number;
        updated: number;
        unmatched: number;
        _updateSnapshot: ITSTypeAndStringLiteral<EnumUpdateSnapshot>;
    };
}
export declare const enum EnumUpdateSnapshot {
    'none' = "none",
    'new' = "new",
    'all' = "all"
}
export declare function getBaseSnapshotDirectory(context: Pick<IMatcherContext, 'testPath'>): string;
/**
 * generate from the test title
 */
export declare function getBaseSnapshotFileName(context: Pick<IMatcherContext, 'testPath' | 'currentTestName' | 'assertionCalls'>): string;
export declare function _hintSnapshotFileName(context: Pick<IMatcherContext, 'testPath'>, snapshotFileName: string): {
    snapshotFileName: string;
    snapshotDisplayName: string;
    rootData: IFindRootReturnType;
};
/**
 * Match given content against content of the specified file.
 *
 * @param {string | Buffer} received Output content to match
 * @param {string} [filepath] Path to the file to match against
 * @param {{ diff?: import('jest-diff').DiffOptions }} options Additional options for matching
 */
export declare function toMatchFile(this: IMatcherContext, received: string | Buffer, filepath: string, options?: IFileMatcherOptions): {
    pass: boolean;
    message: () => string;
    actual: string | Buffer;
    name: "toMatchFile";
    expected?: undefined;
} | {
    pass: boolean;
    message: () => string;
    actual: string | Buffer;
    expected: string | Buffer;
    name: "toMatchFile";
};
export declare function _diffHint(received: Buffer | string, expected: Buffer | string, options?: DiffOptions): string;
declare const _default: {
    toMatchFile: typeof toMatchFile;
};
export default _default;
