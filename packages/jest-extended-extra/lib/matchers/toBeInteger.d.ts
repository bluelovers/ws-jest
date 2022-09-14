/// <reference types="jest" />
declare const matcherName: "toBeInteger";
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
export declare const toBeInteger: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
declare const _default: {
    toBeInteger: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
};
export default _default;
