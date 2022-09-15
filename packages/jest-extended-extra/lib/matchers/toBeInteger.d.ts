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
declare module 'expect' {
    interface Matchers<R extends void | Promise<void>> {
        [matcherName](): R;
    }
}
export declare const toBeInteger: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
declare const _default: {
    toBeInteger: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
};
export default _default;
