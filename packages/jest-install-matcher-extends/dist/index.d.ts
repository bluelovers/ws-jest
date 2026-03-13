import { IExpectExtendMap } from '@lazy-assert/jest-global-types-extra';
/**
 * Jest 擴展安裝選項介面
 * Jest extend installation options interface
 */
export interface IOptions {
    /** 自定義 expect 實例 / Custom expect instance */
    expect?: jest.Expect;
    /** expect 不存在時的回調 / Callback when expect doesn't exist */
    cbNotExists?(matchers: IExpectExtendMap, options?: IOptions): any;
    /** expect 存在時的回調 / Callback when expect exists */
    cbExists?(matchers: IExpectExtendMap, options?: IOptions): any;
}
/**
 * 取得全域 expect 物件
 * Get global expect object
 *
 * 依序檢查 global、globalThis、window 物件
 * Checks global, globalThis, window objects in order
 *
 * @returns Jest expect 物件 / Jest expect object
 */
export declare function getGlobalExpect(): jest.Expect;
/**
 * 安裝 Jest 擴展匹配器
 * Install Jest extend matchers
 *
 * @param matchers - 匹配器映射表 / Matchers map
 * @param expect - 可選的 expect 實例 / Optional expect instance
 * @returns 擴展後的 expect / Extended expect
 */
export declare function jestInstallExpectExtend(matchers: IExpectExtendMap, expect?: jest.Expect): void;
/**
 * 自動安裝 Jest 擴展匹配器
 * Auto-install Jest extend matchers
 *
 * 若 expect 存在則自動安裝，否則呼叫回調函數
 * Automatically installs if expect exists, otherwise calls callback
 *
 * @param matchers - 匹配器映射表 / Matchers map
 * @param options - 安裝選項 / Installation options
 */
export declare function jestAutoInstallExpectExtend(matchers: IExpectExtendMap, options?: IOptions): void;
export default jestAutoInstallExpectExtend;
