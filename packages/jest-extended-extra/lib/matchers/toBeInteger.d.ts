/** 匹配器名稱 / Matcher name */
declare const matcherName: "toBeInteger";
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * 檢查值是否為整數
             * Check if value is an integer
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
 * 檢查值是否為整數
 * Check if value is an integer
 *
 * 使用 check-types 函式庫進行驗證
 * Uses check-types library for validation
 */
export declare const toBeInteger: (this: IMatcherContext, received: number) => ICustomMatcherResult;
declare const _default: {
    toBeInteger: (this: IMatcherContext, received: number) => ICustomMatcherResult;
};
export default _default;
