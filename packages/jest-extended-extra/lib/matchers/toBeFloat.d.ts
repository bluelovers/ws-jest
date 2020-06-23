/// <reference types="jest" />
declare const matcherName: "toBeFloat";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](expected: number): R;
        }
    }
}
export declare const toBeFloat: (this: jest.MatcherContext, received: number) => {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeFloat: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
};
export default _default;
