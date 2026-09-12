/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBePositive";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為正數（大於 0）
             * Check if value is positive (greater than 0)
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
 * 檢查值是否為正數
 * Check if value is positive
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export declare function toBePositive(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "positive";
    name: "toBePositive";
};
declare const _default: {
    toBePositive: typeof toBePositive;
};
export default _default;
