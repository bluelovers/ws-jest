/// <reference types="jest" />
export declare const matchers: {
    readonly toBeZero: typeof import("./matchers/toBeZero").toBeZero;
    readonly toBePositive: typeof import("./matchers/toBePositive").toBePositive;
    readonly toBeNegative: typeof import("./matchers/toBeNegative").toBeNegative;
    readonly toBeInteger: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
    readonly toBeInfinity: typeof import("./matchers/toBeInfinity").toBeInfinity;
    readonly toBeFloat: (this: jest.MatcherContext, received: number) => jest.CustomMatcherResult;
    readonly toBeFinite: typeof import("./matchers/toBeFinite").toBeFinite;
};
export default matchers;
