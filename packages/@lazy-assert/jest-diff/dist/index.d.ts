import { DiffOptions } from 'jest-matcher-utils';
export declare const enum EnumDiffMessage {
    LINE_SEPARATORS = "Contents have differences only in line separators"
}
export declare function _stringDiffCore(received: string, expected: string, options?: DiffOptions): string[];
export declare function _stringDiff(received: string, expected: string, options?: DiffOptions): string;
