/// <reference types="jest" />
declare const matcherName: "toBePositive";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare function toBePositive(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBePositive: typeof toBePositive;
};
export default _default;
