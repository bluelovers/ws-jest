/// <reference types="jest" />
declare const matcherName: "toBeFloat";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
        interface Expect {
            [matcherName](): void;
        }
    }
}
export declare const toBeFloat: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
declare const _default: {
    toBeFloat: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
};
export default _default;
