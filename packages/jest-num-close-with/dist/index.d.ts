import { IMatcherContext, ICustomMatcherResult } from '@lazy-assert/jest-global-types-extra';
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查實際數值是否在預期數值的 ± delta 範圍內
             * Check if actual number is within expected number ± delta
             */
            toBeCloseWith(expected: number, delta?: number, numDigits?: number): R;
        }
        interface Expect {
            toBeCloseWith(expected: number, delta?: number, numDigits?: number): void;
        }
    }
}
declare module 'expect' {
    interface Matchers<R extends void | Promise<void>> {
        toBeCloseWith(expected: number, delta?: number, numDigits?: number): R;
    }
}
/**
 * 檢查實際數值是否在預期數值的 ± delta 範圍內
 * Check if actual number is within expected number ± delta
 *
 * 結合 num-in-delta 和 Jest 的 toBeCloseTo 功能，提供更靈活的數值比較
 * Combines num-in-delta with Jest's toBeCloseTo for more flexible number comparison
 *
 * @param this - 匹配器上下文 / Matcher context
 * @param received - 實際數值 / Actual number
 * @param expected - 預期數值 / Expected number
 * @param delta - 允許的誤差範圍 / Allowed delta
 * @param precision - 精度位數（預設 4）/ Precision digits (default 4)
 * @returns 匹配結果 / Match result
 */
export declare function toBeCloseWith(this: IMatcherContext, received: number, expected: number, delta?: number, precision?: number): ICustomMatcherResult;
declare const _default: {
    /**
     * 檢查實際數值是否在預期數值的 ± delta 範圍內
     * Check if actual number is within expected number ± delta
     */
    toBeCloseWith: typeof toBeCloseWith;
};
export default _default;
