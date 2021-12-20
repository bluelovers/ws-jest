/// <reference types="jest" />
declare const matcherName: "toBeNegative";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare function toBeNegative(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeNegative: typeof toBeNegative;
};
export default _default;
