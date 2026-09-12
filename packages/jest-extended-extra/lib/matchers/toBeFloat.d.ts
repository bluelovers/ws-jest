/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeFloat";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為浮點數（非整數）
             * Check if value is a float (non-integer)
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
 * 檢查值是否為浮點數
 * Check if value is a float
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
export declare const toBeFloat: (this: IMatcherContext, received: number) => ICustomMatcherResult;
declare const _default: {
    toBeFloat: (this: IMatcherContext, received: number) => ICustomMatcherResult;
};
export default _default;
