import { MatcherHintOptions } from 'jest-matcher-utils';
import { IMatcherContext } from '@lazy-assert/jest-global-types-extra';
export declare function handleJestMatcherHintOptions(context: IMatcherContext, options?: MatcherHintOptions): MatcherHintOptions;
export declare function passMessage(received: any, matcherName: string, type: string): () => string;
export declare function failMessage(received: any, matcherName: string, type: string): () => string;
export declare function autoMessage(pass: boolean, received: any, matcherName: string, type: string): () => string;
