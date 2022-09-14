/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { IExpectExtendMap } from '@lazy-assert/jest-global-types-extra';

export interface IOptions
{
	expect?: jest.Expect,

	cbNotExists?(matchers: IExpectExtendMap, options?: IOptions): any,

	cbExists?(matchers: IExpectExtendMap, options?: IOptions): any,
}

export function getGlobalExpect(): jest.Expect
{
	// @ts-ignore
	if (typeof global !== 'undefined' && global.expect)
	{
		// @ts-ignore
		return global.expect;
	}
	// @ts-ignore
	else if (typeof globalThis !== 'undefined' && globalThis.expect)
	{
		// @ts-ignore
		return globalThis.expect;
	}
	// @ts-ignore
	else if (typeof window !== 'undefined' && window.expect)
	{
		// @ts-ignore
		return window.expect;
	}
}

export function jestInstallExpectExtend(matchers: IExpectExtendMap, expect?: jest.Expect)
{
	return (expect ?? getGlobalExpect()).extend(matchers)
}

export function jestAutoInstallExpectExtend(matchers: IExpectExtendMap, options?: IOptions)
{
	const expect = options?.expect ?? getGlobalExpect();

	if (typeof expect !== 'undefined')
	{
		expect.extend(matchers);
		options?.cbExists?.(matchers, options)
	}
	else
	{
		options?.cbNotExists?.(matchers, options)
	}
}

export default jestAutoInstallExpectExtend
