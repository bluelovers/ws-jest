/// <reference types="jest" />
/// <reference types="node" />
import { DiffOptions } from 'jest-matcher-utils';
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
interface IMatcherContext extends jest.MatcherContext {
    snapshotState?: {
        added: number;
        updated: number;
        unmatched: number;
        _updateSnapshot: 'none' | 'new' | 'all';
    };
}
/**
 * Match given content against content of the specified file.
 *
 * @param {string | Buffer} content Output content to match
 * @param {string} [filepath] Path to the file to match against
 * @param {{ diff?: import('jest-diff').DiffOptions }} options Additional options for matching
 */
export declare function toMatchFile(this: IMatcherContext, content: string | Buffer, filepath: string, options?: IFileMatcherOptions): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toMatchFile: typeof toMatchFile;
};
export default _default;
