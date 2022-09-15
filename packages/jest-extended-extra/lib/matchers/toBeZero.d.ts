/// <reference types="jest" />
declare const matcherName: "toBeZero";
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
export declare function toBeZero(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "zero";
    name: "toBeZero";
};
declare const _default: {
    toBeZero: typeof toBeZero;
};
export default _default;
