import { IMatcherContext, ICustomMatcherResult } from '@lazy-assert/jest-global-types-extra';
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * check actual number is expected number ± delta
             */
            toBeCloseWith(expected: number, delta?: number, numDigits?: number): R;
        }
    }
}
/**
 * check actual number is expected number ± delta
 */
export declare function toBeCloseWith(this: IMatcherContext, received: number, expected: number, delta?: number, precision?: number): ICustomMatcherResult;
declare const _default: {
    /**
     * check actual number is expected number ± delta
     */
    toBeCloseWith: typeof toBeCloseWith;
};
export default _default;
