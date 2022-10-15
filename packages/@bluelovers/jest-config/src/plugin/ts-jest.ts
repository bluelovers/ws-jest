import { TsJestTransformerOptions } from 'ts-jest/dist/types';

export function defaultTsJestTransformerOptions()
{
	return {
		tsconfig: {
			noEmit: true,
			emitDeclarationOnly: false,
			noUnusedParameters: false,
			allowUnusedLabels: true,
			noUnusedLocals: false,
			noPropertyAccessFromIndexSignature: false,
			noImplicitAny: false,
		},
	} satisfies TsJestTransformerOptions
}
