declare const matcherName: "toBeInteger";
declare global {
    namespace jest {
        interface Matchers<R> {
            [matcherName](): R;
        }
    }
}
export declare const toBeInteger: (this: jest.MatcherContext, received: number) => {
    pass: boolean;
    message: () => string;
};
declare const _default: {
    toBeInteger: (this: jest.MatcherContext, received: number) => {
        pass: boolean;
        message: () => string;
    };
};
export default _default;
