/// <reference types="jest" />
export declare const matchers: {
    toBeFloat: (this: jest.MatcherContext, received: number) => {
        pass: any;
        message: () => string;
    };
} & {
    toBeInteger: (this: jest.MatcherContext, received: number) => {
        pass: any;
        message: () => string;
    };
} & {
    toBeZero: typeof import("./matchers/toBeZero").toBeZero;
};
export default matchers;
