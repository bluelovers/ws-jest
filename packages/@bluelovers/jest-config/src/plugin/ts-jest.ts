import { TsJestTransformerOptions } from 'ts-jest';
import { IRuntime } from '../types';

export function defaultTsJestTransformerOptions(runtime: IRuntime)
{
	const old: TsJestTransformerOptions = runtime.jestConfig.globals?.['ts-jest'] ?? {};

	const tsconfig = typeof old.tsconfig === 'object' ? old.tsconfig : {};

	return {
		...old,
		tsconfig: {
			noEmit: true,
			emitDeclarationOnly: false,
			noUnusedParameters: false,
			allowUnusedLabels: true,
			noUnusedLocals: false,
			noPropertyAccessFromIndexSignature: false,
			noImplicitAny: false,
			...tsconfig,
		},
	} satisfies TsJestTransformerOptions
}
