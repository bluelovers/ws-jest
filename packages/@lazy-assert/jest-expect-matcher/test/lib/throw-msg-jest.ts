/**
 * Jest AsymmetricMatcher-based implementation of allOf and anyOf
 * 基於 Jest AsymmetricMatcher 的 allOf 與 anyOf 實作
 */
import { AsymmetricMatcher } from 'expect';

export class AnyOf extends AsymmetricMatcher<(unknown | AsymmetricMatcher<any>)[]>
{
	constructor(matchers: (unknown | AsymmetricMatcher<any>)[], inverse = false)
	{
		super(matchers, inverse);
	}

	override asymmetricMatch(actual: unknown): boolean
	{
		const result = this.sample.some((matcher) =>
		{
			if (typeof (matcher as any)?.asymmetricMatch === 'function')
			{
				return (matcher as any).asymmetricMatch(actual);
			}
			return actual === matcher;
		});

		return this.inverse ? !result : result;
	}

	override toString(): string
	{
		return `AnyOf(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}

	override toAsymmetricMatcher(): string
	{
		return this.toString();
	}
}

export class AllOf extends AsymmetricMatcher<(unknown | AsymmetricMatcher<any>)[]>
{
	constructor(matchers: (unknown | AsymmetricMatcher<any>)[], inverse = false)
	{
		super(matchers, inverse);
	}

	override asymmetricMatch(actual: unknown): boolean
	{
		const result = this.sample.every((matcher) =>
		{
			if (typeof (matcher as any)?.asymmetricMatch === 'function')
			{
				return (matcher as any).asymmetricMatch(actual);
			}
			return actual === matcher;
		});

		return this.inverse ? !result : result;
	}

	override toString(): string
	{
		return `AllOf(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}

	override toAsymmetricMatcher(): string
	{
		return this.toString();
	}
}

export function anyOf(...matchers: (unknown | AsymmetricMatcher<any>)[]): AnyOf
{
	return new AnyOf(matchers);
}

export function allOf(...matchers: (unknown | AsymmetricMatcher<any>)[]): AllOf
{
	return new AllOf(matchers);
}

export class NotAnyOf extends AnyOf
{
	constructor(matchers: (unknown | AsymmetricMatcher<any>)[])
	{
		super(matchers, true);
	}

	override toString(): string
	{
		return `NotAnyOf(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}

export class NotAllOf extends AllOf
{
	constructor(matchers: (unknown | AsymmetricMatcher<any>)[])
	{
		super(matchers, true);
	}

	override toString(): string
	{
		return `NotAllOf(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}
