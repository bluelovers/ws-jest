/// <reference types="jest" />
declare const matcherName: "toBePositive";
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
export declare function toBePositive(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "positive";
    name: "toBePositive";
};
declare const _default: {
    toBePositive: typeof toBePositive;
};
export default _default;
