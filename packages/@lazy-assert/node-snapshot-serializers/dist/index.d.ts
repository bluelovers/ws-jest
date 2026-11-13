import { AssertSnapshotOptions } from 'node:test';
import { ITSRequiredWith } from 'ts-type';
import { InspectOptions } from 'util';

export interface IAssertSnapshotOptions extends AssertSnapshotOptions {
	circularReferenceWithIndex?: boolean;
	fnLabel?: ICircularReferencesLabelFn;
}
export interface ICreateSnapshotResult extends AssertSnapshotOptions {
	_stringify: (obj: any) => string;
}
export declare function _nodeInspectResultNoOuterRef(inspectResult: string): string;
export declare function _nodeSnapshotInspectFnWrapper(fn: (value: unknown, options?: InspectOptions) => string, inspectOptions?: InspectOptions): (value: unknown) => string;
export declare function _nodeInspectOptions(inspectOptions?: InspectOptions): InspectOptions;
export declare function _isObjectNotNull(value: unknown): value is object;
export interface ISeenCtx {
	seenCache: WeakMap<object, number>;
	seenIndex: number;
	seenCount: number;
}
export type ICircularReferencesLabelFn = (value?: number) => string | undefined;
export declare function _handleCircularReferences(value: unknown, runtime: {
	fnLabel: ICircularReferencesLabelFn;
	seenCtx: ISeenCtx;
}): unknown;
export declare function _circularLabelWithIndex(seenIndex: number): string;
export declare function _circularLabel(_seenIndex?: number): string;
export declare function _handleOptions(options?: IAssertSnapshotOptions): ITSRequiredWith<IAssertSnapshotOptions, "fnLabel">;
export declare function _createSerializer(options?: IAssertSnapshotOptions): {
	seenCache: WeakMap<object, number>;
	seenIndex(): number;
	seenCount(): number;
	test: (value: unknown) => value is object;
	serialize: (_key: any, value: unknown) => unknown;
};
export declare function createSnapshotStringify(options?: IAssertSnapshotOptions): ICreateSnapshotResult;

export {
	createSnapshotStringify as default,
};

export {};
