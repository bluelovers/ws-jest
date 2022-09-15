/// <reference types="node" />
import { DiffOptions } from 'jest-matcher-utils';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { ICustomMatcherResult, IMatcherContext } from '@lazy-assert/jest-global-types-extra';
export interface IFileMatcherOptions {
    diff?: DiffOptions;
}
declare global {
    namespace jest {
        interface Matchers<R, T> {
            toMatchFile(filename?: string, options?: IFileMatcherOptions): void;
        }
        interface Expect {
            toMatchFile(filename?: string, options?: IFileMatcherOptions): void;
        }
    }
}
declare module 'expect' {
    interface Matchers<R extends void | Promise<void>> {
        toMatchFile(filename?: string, options?: IFileMatcherOptions): R;
    }
}
export declare function getBaseSnapshotDirectory(context: Pick<IMatcherContext, 'testPath'>): string;
/**
 * generate from the test title
 */
export declare function getBaseSnapshotFileName(context: Pick<IMatcherContext, 'testPath' | 'currentTestName' | 'assertionCalls'>): string;
export declare function _hintSnapshotFileName(context: Pick<IMatcherContext, 'testPath' | 'snapshotState'>, snapshotFileName: string): {
    snapshotFileName: string;
    snapshotDisplayName: string;
    rootData: IFindRootReturnType;
    safeUpdateSnapshot: boolean;
};
/**
 * Match given content against content of the specified file.
 *
 * @param {string | Buffer} received Output content to match
 * @param {string} [filepath] Path to the file to match against
 * @param {{ diff?: import('jest-diff').DiffOptions }} options Additional options for matching
 */
export declare function toMatchFile(this: IMatcherContext, received: string | Buffer, filepath: string, options?: IFileMatcherOptions): ICustomMatcherResult;
export declare function _diffHint(received: Buffer | string, expected: Buffer | string, options?: DiffOptions): string;
declare const _default: {
    toMatchFile: typeof toMatchFile;
};
export default _default;
