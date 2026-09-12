/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeNegative";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為負數（小於 0）
             * Check if value is negative (less than 0)
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
 * 檢查值是否為負數
 * Check if value is negative
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export declare function toBeNegative(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "negative";
    name: "toBeNegative";
};
declare const _default: {
    toBeNegative: typeof toBeNegative;
};
export default _default;
