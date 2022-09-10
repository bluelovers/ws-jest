/// <reference types="jest" />

export interface IOptions
{
	expect?: jest.Expect,

	cbNotExists?(matchers: jest.ExpectExtendMap, options?: IOptions): any,

	cbExists?(matchers: jest.ExpectExtendMap, options?: IOptions): any,
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

export function jestInstallExpectExtend(matchers: jest.ExpectExtendMap, expect?: jest.Expect)
{
	return (expect ?? getGlobalExpect()).extend(matchers)
}

export function jestAutoInstallExpectExtend(matchers: jest.ExpectExtendMap, options?: IOptions)
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
