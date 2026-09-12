/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeInfinity";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為無限大（Infinity 或 -Infinity）
             * Check if value is infinity (Infinity or -Infinity)
             */
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
/**
 * 檢查值是否為無限大
 * Check if value is infinity
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
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
