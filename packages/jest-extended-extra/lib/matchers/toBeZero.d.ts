/// <reference types="jest" />
declare const matcherName: "toBeZero";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](expected: number): R;
        }
    }
}
export declare const toBeZero: (this: jest.MatcherContext, received: number) => {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeZero: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
};
export default _default;
