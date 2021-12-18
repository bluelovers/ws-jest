/// <reference types="jest" />
declare const matcherName: "toBeInfinity";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare function toBeInfinity(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeInfinity: typeof toBeInfinity;
};
export default _default;
