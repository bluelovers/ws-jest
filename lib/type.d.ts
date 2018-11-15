/**
 * Created by user on 2018/11/15/015.
 */
import chai = require('chai');
export declare type IChaiStatic = typeof chai;
export declare type IPickMember<T, K extends keyof T> = T[K];
export declare type IDiff<T extends keyof any, U extends keyof any> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type IOverwrite<T, U> = Pick<T, IDiff<keyof T, keyof U>> & U;
export declare type IExpectStatic = IPickMember<IChaiStatic, "expect">;
export declare type IAssertion = ReturnType<IExpectStatic>;
export declare type IExpectStaticFail = IPickMember<IExpectStatic, "fail">;
export declare type IAssertionStatic<T = IAssertion> = {
    (target: any, message?: string): T;
    fail(...args: Parameters<IExpectStaticFail>): ReturnType<IExpectStaticFail>;
};
