/// <reference types="jest" />
declare const matcherName: "toBeZero";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare function toBeZero(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeZero: typeof toBeZero;
};
export default _default;
