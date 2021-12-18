/// <reference types="jest" />
declare const matcherName: "toBeFinite";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare function toBeFinite(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeFinite: typeof toBeFinite;
};
export default _default;