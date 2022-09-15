/// <reference types="jest" />
declare const matcherName: "toBeInfinity";
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
export declare function toBeInfinity(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "infinity";
    name: "toBeInfinity";
};
declare const _default: {
    toBeInfinity: typeof toBeInfinity;
};
export default _default;
