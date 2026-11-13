import { AssertSnapshotOptions } from 'node:test';
// import { inspect } from 'util';
import type { ITSRequiredWith } from 'ts-type';
import { InspectOptions } from 'util';

export interface IAssertSnapshotOptions extends AssertSnapshotOptions
{
	circularReferenceWithIndex?: boolean;
	fnLabel?: ICircularReferencesLabelFn;
}

export interface ICreateSnapshotResult extends AssertSnapshotOptions
{
	_stringify: (obj: any) => string;
}

// export function _nodeSnapshotInspect(value: unknown): string
// {
// 	return inspect(value, {
// 		depth: Infinity,
// 		compact: false,
// 		sorted: true,
// 	});
// }

export function _nodeInspectResultNoOuterRef(inspectResult: string): string
{
	return inspectResult.replace(/^\<ref \*\d\> (?=\{)/, '');
}

export function _nodeSnapshotInspectFnWrapper(fn: (value: unknown, options?: InspectOptions) => string, inspectOptions?: InspectOptions)
{
	inspectOptions = _nodeInspectOptions(inspectOptions);

	return (value: unknown) => {
		return _nodeInspectResultNoOuterRef(fn(value, inspectOptions));
	};
}

export function _nodeInspectOptions(inspectOptions?: InspectOptions): InspectOptions
{
	return {
		depth: Infinity,
		compact: false,
		sorted: true,
		colors: false,
		...inspectOptions,
	};
}

export function _isObjectNotNull(value: unknown): value is object
{
	return typeof value === 'object' && value !== null;
}

export interface ISeenCtx
{
	seenCache: WeakMap<object, number>;
	seenIndex: number;
	seenCount: number;
}

export type ICircularReferencesLabelFn = (value?: number) => string | undefined;

export function _handleCircularReferences(value: unknown, runtime: {
	fnLabel: ICircularReferencesLabelFn,
	seenCtx: ISeenCtx
}): unknown
{
	const { seenCtx } = runtime;

	if (_isObjectNotNull(value))
	{
		if (seenCtx.seenCache.has(value))
		{
			/** 遇到循環引用時以字串代替，或回傳 undefined 略過 */
			return runtime.fnLabel(seenCtx.seenCache.get(value));
		}
		/**
		 * 從 1 開始編號，符合 JavaScript 對象的循環引用標記方式
		 */
		seenCtx.seenCache.set(value, ++seenCtx.seenIndex);
		seenCtx.seenCount++;
	}
	return value;
}

export function _circularLabelWithIndex(seenIndex: number)
{
	return `[Circular *${seenIndex}]`;
}

export function _circularLabel(_seenIndex?: number)
{
	return `[Circular]`;
}

export function _handleOptions(options?: IAssertSnapshotOptions): ITSRequiredWith<IAssertSnapshotOptions, 'fnLabel'>
{
	options ??= {};

	const fnLabel = options.fnLabel ?? (options.circularReferenceWithIndex ? _circularLabelWithIndex : _circularLabel);

	return {
		...options,
		fnLabel,
	};
}

export function _createSerializer(options?: IAssertSnapshotOptions)
{
	const seenCache = new WeakMap<object, number>();

	const seenCtx: ISeenCtx = {
		seenCache,
		seenIndex: 0,
		seenCount: 0,
	};

	const opts = _handleOptions(options);

	const fnLabel = opts.fnLabel;

	return {
		seenCache,
		seenIndex()
		{
			return seenCtx.seenIndex;
		},
		seenCount()
		{
			return seenCtx.seenCount;
		},
		test: (value: unknown) => _isObjectNotNull(value),
		serialize: (_key: any, value: unknown) =>
		{
			return _handleCircularReferences(value, {
				fnLabel: fnLabel,
				seenCtx,
			});
		},
	};
}

export function createSnapshotStringify(options?: IAssertSnapshotOptions): ICreateSnapshotResult
{
	const _stringify = (obj: any) => {
		const serializer = _createSerializer(options);
		const result = JSON.stringify(obj, serializer.serialize, 2);
		return result;
	};

	return {
		serializers: [
			...(options?.serializers ?? []),
			_stringify,
		],

		_stringify,
	};
}

export default createSnapshotStringify;

// snapshot.setDefaultSnapshotSerializers([

// ]);
