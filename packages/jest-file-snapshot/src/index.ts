import { outputFileSync, pathExistsSync, readFileSync } from 'fs-extra';
import { basename, dirname, join, relative, resolve } from 'upath2';
import filenamify from 'filenamify';
import {
	diff,
	DiffOptions,
	EXPECTED_COLOR,
	matcherHint,
	MatcherHintOptions,
	RECEIVED_COLOR,
} from 'jest-matcher-utils';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { chkcrlf, crlf, EnumLineBreak } from 'crlf-normalize';
import pathInsideDirectory from 'path-in-dir';
import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';

export interface IFileMatcherOptions
{
	diff?: DiffOptions;
}

declare global
{
	namespace jest
	{
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface Matchers<R, T>
		{
			toMatchFile(filename?: string, options?: IFileMatcherOptions): void;
		}

		interface Expect
		{
			toMatchFile: (filename?: string, options?: IFileMatcherOptions) => void;
		}
	}
}

export interface IMatcherContext extends jest.MatcherContext
{
	snapshotState?: {
		added: number,
		updated: number,
		unmatched: number,
		_updateSnapshot: ITSTypeAndStringLiteral<EnumUpdateSnapshot>
	}
}

export const enum EnumUpdateSnapshot
{
	'none' = 'none',
	'new' = 'new',
	'all' = 'all',
}

const _defaultDiffOptions: DiffOptions = {
	expand: false,
	contextLines: 5,
	aAnnotation: `Snapshot`,
};

/**
 * Check if 2 strings or buffer are equal
 */
function isEqual(a: string | Buffer, b: string | Buffer)
{
	// @ts-ignore: TypeScript gives error if we pass string to buffer.equals
	return Buffer.isBuffer(a) ? a.equals(b) : a === b;
}

export function getBaseSnapshotDirectory(context: Pick<IMatcherContext, 'testPath'>)
{
	return join(dirname(context.testPath),'__file_snapshots__')
}

/**
 * generate from the test title
 */
export function getBaseSnapshotFileName(context: Pick<IMatcherContext, 'testPath' | 'currentTestName' | 'assertionCalls'>)
{
	return join(
		getBaseSnapshotDirectory(context),
		`${filenamify(context.currentTestName, {
			replacement: '-',
		}).replace(/\s/g, '-')}-${context.assertionCalls}`,
	)
}

export function _hintSnapshotFileName(context: Pick<IMatcherContext, 'testPath'>, snapshotFileName: string)
{
	const snapshotDirectory = getBaseSnapshotDirectory(context);

	let rootData: IFindRootReturnType;
	let snapshotDisplayName: string;

	if (pathInsideDirectory(snapshotFileName, snapshotDirectory))
	{
		snapshotDisplayName = relative(snapshotDirectory, snapshotFileName);
	}
	else
	{
		rootData = findRootLazy({
			cwd: context.testPath,
		}, false);

		if (rootData)
		{
			if (pathInsideDirectory(snapshotFileName, rootData.pkg))
			{
				snapshotDisplayName = relative(rootData.pkg, snapshotFileName);
			}
			else if (pathInsideDirectory(snapshotFileName, rootData.root))
			{
				snapshotDisplayName = relative(rootData.root, snapshotFileName);
			}
		}
	}

	if (!snapshotDisplayName?.length)
	{
		let rootData2 = findRootLazy({
			cwd: dirname(snapshotFileName),
		}, false);

		if (rootData2?.pkg)
		{
			snapshotDisplayName = relative(resolve(rootData2.pkg, '..'), snapshotFileName);
		}
		else
		{
			snapshotDisplayName = snapshotFileName;
		}
	}

	return {
		snapshotFileName,
		snapshotDisplayName,
		rootData,
	}
}

/**
 * Match given content against content of the specified file.
 *
 * @param {string | Buffer} received Output content to match
 * @param {string} [filepath] Path to the file to match against
 * @param {{ diff?: import('jest-diff').DiffOptions }} options Additional options for matching
 */
export function toMatchFile(this: IMatcherContext,
	received: string | Buffer,
	filepath: string,
	options: IFileMatcherOptions = {},
)
{
	const { isNot, snapshotState } = this;
	const matcherName = 'toMatchFile' as const;

	/**
	 * If file name is not specified, generate one from the test title
	 */
	const snapshotFileName = filepath ?? getBaseSnapshotFileName(this);
	const snapshotDisplayName = _hintSnapshotFileName(this, snapshotFileName).snapshotDisplayName;

	options = {
		// Options for jest-diff
		diff: Object.assign(
			{},
			_defaultDiffOptions,
			options.diff,
		),
	};

	const optsMatcherHint: MatcherHintOptions = {
		isNot,
		promise: this.promise,
	};

	if (snapshotState._updateSnapshot === EnumUpdateSnapshot.none && !pathExistsSync(snapshotFileName))
	{
		// We're probably running in CI environment

		snapshotState.unmatched++;

		return {
			pass: isNot,
			message: () =>
				`New output file ${EXPECTED_COLOR(
					snapshotDisplayName,
				)} was ${RECEIVED_COLOR('not written')}.\n\n` +
				'The update flag must be explicitly passed to write a new snapshot.\n\n' +
				`This is likely because this test is run in a ${EXPECTED_COLOR(
					'continuous integration (CI) environment',
				)} in which snapshots are not written by default.\n\n`,
		};
	}

	let pass = false;
	let message = () => matcherHint(matcherName, undefined, snapshotDisplayName, optsMatcherHint);

	let expected: Buffer | string;

	if (pathExistsSync(snapshotFileName))
	{
		expected = readFileSync(
			snapshotFileName,
			Buffer.isBuffer(received) ? null : 'utf8',
		);

		if (isNot)
		{
			// The matcher is being used with `.not`

			if (!isEqual(received, expected))
			{
				pass = false;
			}
			else
			{
				snapshotState.unmatched++;
				pass = true;
			}
		}
		else
		{
			if (isEqual(received, expected))
			{
				pass = true;
			}
			else
			{
				if (snapshotState._updateSnapshot === EnumUpdateSnapshot.all)
				{
					pass = true;
					outputFileSync(snapshotFileName, received);

					snapshotState.updated++;
				}
				else
				{
					snapshotState.unmatched++;

					const difference = _diffHint(expected, received, options.diff);

					message = () =>
					{
						return matcherHint(matcherName, undefined, snapshotDisplayName, optsMatcherHint) + difference
					};
				}
			}
		}
	}
	else
	{
		pass = true;

		if (
			!isNot &&
			(snapshotState._updateSnapshot === EnumUpdateSnapshot.new ||
				snapshotState._updateSnapshot === EnumUpdateSnapshot.all)
		)
		{
			outputFileSync(snapshotFileName, received);

			snapshotState.added++;
		}
		else
		{
			snapshotState.unmatched++;

			message = () =>
				`The output file ${EXPECTED_COLOR(
					basename(snapshotFileName),
				)} ${RECEIVED_COLOR("doesn't exist")}.`;
		}
	}

	return {
		pass,
		message,
		actual: received,
		expected,
		name: matcherName,
	};
}

export function _diffHint(received: Buffer | string, expected: Buffer | string, options?: DiffOptions)
{
	if (Buffer.isBuffer(received) || Buffer.isBuffer(expected))
	{
		return ''
	}

	options ??= _defaultDiffOptions;

	let difference: string[] = [''];

	if (crlf(expected) === crlf(received))
	{
		difference.push(`Contents have differences only in line separators`);
		difference.push(diff(chkcrlf(expected), chkcrlf(received)));
	}
	else
	{
		difference.push(diff(expected, received, options));
	}

	return difference.join(EnumLineBreak.LF + EnumLineBreak.LF);
}

export default {
	toMatchFile,
}
