import check from 'check-types';
import { ITSKeyofByExtractType } from 'ts-type/lib/helper/record/pick-type';
import { IMatcherContext, ICustomMatcherResult } from '@lazy-assert/jest-global-types-extra';
export declare function createNewCheckTypes(matcherName: string, type: ITSKeyofByExtractType<typeof check, ((...argv: any[]) => any)> | string): (this: IMatcherContext, received: number) => ICustomMatcherResult;
