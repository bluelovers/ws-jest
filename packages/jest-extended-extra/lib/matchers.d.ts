/// <reference types="jest" />
export declare const matchers: {
    toBeFloat: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
} & {
    toBeInteger: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
} & {
    toBeZero: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
};
export default matchers;
