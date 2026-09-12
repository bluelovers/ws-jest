/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeFinite";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為有限數字（非 Infinity）
             * Check if value is a finite number (not Infinity)
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
 * 檢查值是否為有限數字
 * Check if value is finite
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 要檢查的數值 / Number to check
 * @returns 匹配結果 / Match result
 */
export declare function toBeFinite(this: jest.MatcherContext, received: number): {
    pass: boolean;
    message: () => string;
    actual: number;
    expected: "finite";
    name: "toBeFinite";
};
declare const _default: {
    toBeFinite: typeof toBeFinite;
};
export default _default;
