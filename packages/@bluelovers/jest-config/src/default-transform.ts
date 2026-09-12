import { IJestConfig, IRuntime } from './types';
import { _handleFileExtensions, _requireResolve } from './helper';
import { defaultTsJestTransformerOptions } from './plugin/ts-jest';
import { defaultTransformFileExtensions } from './defaults';
import { IOptionsRequireResolve as IOptions, requireResolveExtra } from '@yarn-tool/require-resolve';
import { ITSWriteable } from 'ts-type';

/**
 * 建立預設的轉換器配置
 * Create default transformer configuration
 *
 * 配置 ts-jest 作為主要轉換器，並在可用時整合 jest-tsd-transform 和 jest-chain-transform
 * Configures ts-jest as the main transformer, integrating jest-tsd-transform and jest-chain-transform when available
 *
 * @param {IRuntime} runtime - 執行時期配置 / Runtime configuration
 * @returns {object} 轉換器配置物件 / Transformer configuration object
 */
export function defaultTransform(runtime: IRuntime)
{
	/**
	 * 搜尋路徑列表，用於解析相關模組
	 * Search paths list for resolving related modules
	 */
	const paths: string[] = [
		requireResolveExtra('@bluelovers/jest-config').result,
	].filter(Boolean);

	/**
	 * 模組解析選項 / Module resolution options
	 */
	const opts: IOptions = {
		includeGlobal: true,
		includeCurrentDirectory: true,
		paths,
	};

	/**
	 * ts-jest 轉換器配置
	 * ts-jest transformer configuration
	 */
	let ts_transform: IJestConfig["transform"][string] = _requireResolve('ts-jest') as 'ts-jest';

	/**
	 * 將 ts-jest 與其選項合併
	 * Merge ts-jest with its options
	 */
	ts_transform = [ts_transform, defaultTsJestTransformerOptions(runtime)];

	/**
	 * 嘗試解析 jest-tsd-transform（TypeScript 宣告檔轉換器）
	 * Try to resolve jest-tsd-transform (TypeScript declaration file transformer)
	 */
	const { result: tsd } = requireResolveExtra('jest-tsd-transform', opts);

	/**
	 * 如果 jest-tsd-transform 可用，嘗試建立轉換鏈
	 * If jest-tsd-transform is available, try to create transform chain
	 */
	if (tsd?.length)
	{
		/**
		 * 嘗試解析 jest-chain-transform（轉換鏈協調器）
		 * Try to resolve jest-chain-transform (transform chain coordinator)
		 */
		const { result: chain } = requireResolveExtra('jest-chain-transform', opts);

		/**
		 * 如果 jest-chain-transform 可用，建立轉換鏈
		 * If jest-chain-transform is available, create transform chain
		 */
		if (chain?.length)
		{
			ts_transform = [
				chain as 'jest-chain-transform', {
					transformers: [
						tsd as 'jest-tsd-transform',
						// @ts-ignore
						ts_transform as 'ts-jest',
					],
				},
			] satisfies [
				string,
				Record<string, unknown>
			]
		}
	}

	/**
	 * 建立最終的轉換器配置物件
	 * Create final transformer configuration object
	 */
	const value = {
		[`.(${_handleFileExtensions(defaultTransformFileExtensions(), '|')})$`]: ts_transform,
	} as const
	return value as ITSWriteable<typeof value>;
}
