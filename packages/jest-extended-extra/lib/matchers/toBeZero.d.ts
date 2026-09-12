/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeZero";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為零（0 或 -0）
             * Check if value is zero (0 or -0)
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
 * 檢查值是否為零
 * Check if value is zero
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
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
