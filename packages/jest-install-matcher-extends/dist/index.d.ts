/// <reference types="jest" />
export interface IOptions {
    expect?: jest.Expect;
    cbNotExists?(matchers: jest.ExpectExtendMap, options?: IOptions): any;
    cbExists?(matchers: jest.ExpectExtendMap, options?: IOptions): any;
}
export declare function getGlobalExpect(): jest.Expect;
export declare function jestInstallExpectExtend(matchers: jest.ExpectExtendMap, expect?: jest.Expect): void;
export declare function jestAutoInstallExpectExtend(matchers: jest.ExpectExtendMap, options?: IOptions): void;
export default jestAutoInstallExpectExtend;
