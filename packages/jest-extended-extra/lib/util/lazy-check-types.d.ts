import check from 'check-types';
import { ITSKeyofByExtractType } from 'ts-type/lib/helper/record/pick-type';
export declare function createNewCheckTypes(matcherName: string, type: ITSKeyofByExtractType<typeof check, ((...argv: any[]) => any)> | string): (this: jest.MatcherContext, received: number) => {
    pass: boolean;
    message: () => string;
};
