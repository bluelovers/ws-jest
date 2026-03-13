/**
 * Class-based implementation of allOf and anyOf using AsymmetricMatcher pattern
 * 基於 Class 的 allOf 與 anyOf 實作，使用 AsymmetricMatcher 模式
 */
import { IAsymmetricMatcher, SymbolTypeofAsymmetricMatcher, _isAsymmetricMatcher } from '../../src/index';

/**
 * anyOf - Matches if any of the given matchers matches (OR logic)
 * anyOf - 如果任何一個 matcher 匹配則通過 (OR 邏輯)
 */
export class AnyOf
{
	// @ts-ignore
	$$typeof = SymbolTypeofAsymmetricMatcher;
	// @ts-ignore
	inverse = false;
	// @ts-ignore
	sample: (unknown | IAsymmetricMatcher)[];
	
	constructor(matchers: (unknown | IAsymmetricMatcher)[], inverse = false)
	{
		// @ts-ignore
		this.sample = matchers;
		// @ts-ignore
		this.inverse = inverse;
	}
	
	asymmetricMatch(actual: unknown): boolean
	{
		// @ts-ignore
		const result = this.sample.some((matcher) =>
		{
			if (_isAsymmetricMatcher(matcher))
			{
				return matcher.asymmetricMatch(actual);
			}
			return actual === matcher;
		});
		
		// @ts-ignore
		return this.inverse ? !result : result;
	}
	
	toString(): string
	{
		return `AnyOf`;
	}
	
	toAsymmetricMatcher(): string
	{
		return `${this.toString()}(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}

/**
 * allOf - Matches if all of the given matchers match (AND logic)
 * allOf - 如果所有 matcher 都匹配則通過 (AND 邏輯)
 */
export class AllOf
{
	// @ts-ignore
	$$typeof = SymbolTypeofAsymmetricMatcher;
	// @ts-ignore
	inverse = false;
	// @ts-ignore
	sample: (unknown | IAsymmetricMatcher)[];
	
	constructor(matchers: (unknown | IAsymmetricMatcher)[], inverse = false)
	{
		// @ts-ignore
		this.sample = matchers;
		// @ts-ignore
		this.inverse = inverse;
	}
	
	asymmetricMatch(actual: unknown): boolean
	{
		// @ts-ignore
		const result = this.sample.every((matcher) =>
		{
			if (_isAsymmetricMatcher(matcher))
			{
				return matcher.asymmetricMatch(actual);
			}
			return actual === matcher;
		});
		
		// @ts-ignore
		return this.inverse ? !result : result;
	}
	
	toString(): string
	{
		return `AllOf`;
	}
	
	toAsymmetricMatcher(): string
	{
		return `${this.toString()}(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}

/**
 * Factory functions to create instances
 * 工廠函數用於創建實例
 */
export function anyOf(...matchers: (unknown | IAsymmetricMatcher)[]): AnyOf
{
	return new AnyOf(matchers);
}

export function allOf(...matchers: (unknown | IAsymmetricMatcher)[]): AllOf
{
	return new AllOf(matchers);
}

/**
 * Inverse versions (NotAnyOf, NotAllOf)
 * 反向版本
 */
export class NotAnyOf extends AnyOf
{
	constructor(matchers: (unknown | IAsymmetricMatcher)[])
	{
		super(matchers, true);
	}
	
	override toString(): string
	{
		return `NotAnyOf`;
	}

	override toAsymmetricMatcher(): string
	{
		return `${this.toString()}(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}

export class NotAllOf extends AllOf
{
	constructor(matchers: (unknown | IAsymmetricMatcher)[])
	{
		super(matchers, true);
	}
	
	override toString(): string
	{
		return `NotAllOf`;
	}

	override toAsymmetricMatcher(): string
	{
		return `${this.toString()}(${this.sample.map(m => m?.toString?.() ?? String(m)).join(', ')})`;
	}
}
