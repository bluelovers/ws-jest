/// <reference types="jest" />
import { IExpectExtendMap } from '@lazy-assert/jest-global-types-extra';
export interface IOptions {
    expect?: jest.Expect;
    cbNotExists?(matchers: IExpectExtendMap, options?: IOptions): any;
    cbExists?(matchers: IExpectExtendMap, options?: IOptions): any;
}
export declare function getGlobalExpect(): jest.Expect;
export declare function jestInstallExpectExtend(matchers: IExpectExtendMap, expect?: jest.Expect): void;
export declare function jestAutoInstallExpectExtend(matchers: IExpectExtendMap, options?: IOptions): void;
export default jestAutoInstallExpectExtend;
