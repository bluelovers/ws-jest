import { IJestConfig, IRuntime } from './types';
import { detectIncludes } from './util';
import { _requireResolve2 } from './helper';
import { ITSPickExtra } from 'ts-type';

/** 環境設置載入的檔案 / Files to load environment setup */
export function defaultSetupFiles(runtime?: ITSPickExtra<IRuntime, 'jestConfig'>)
{
	const jestConfig = runtime?.jestConfig ?? {} as IJestConfig;

	let detect = detectIncludes(jestConfig.setupFiles, 'dotenv');

	const setupFiles: IJestConfig['setupFiles'] = [
		/**
		 * @see https://lusbuab.medium.com/using-dotenv-with-jest-7e735b34e55f
		 */
		!detect['dotenv'] && _requireResolve2('dotenv/config').result,
		...(jestConfig.setupFiles ?? []),

	].filter(Boolean);

	const setupFilesAfterEnv = [
		// 可選擇性啟用的 Jest 擴充套件 / Optional Jest extensions
		//"jest-chain",
		//"jest-extended/all",
		//"jest-extended-extra",
		//"jest-num-close-with",
		/**
		 * 跨平台測試支援參考 / Cross-platform testing support reference
		 * @see https://medium.com/doctolib/how-to-run-the-same-jest-test-suite-across-several-platforms-jest-os-detection-plugin-included-f8113832482b
		 * @see https://github.com/doctolib/jest-os-detection
		 */
		//'jest-os-detection',
		...(jestConfig.setupFilesAfterEnv ?? []),
	].filter(Boolean);

	const ret = {} as Pick<IJestConfig, 'setupFiles' | 'setupFilesAfterEnv'>;

	if (setupFiles.length)
	{
		ret.setupFiles = setupFiles;
	}
	if (setupFilesAfterEnv.length)
	{
		ret.setupFilesAfterEnv = setupFilesAfterEnv;
	}

	return ret
}
