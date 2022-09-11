import { outputFileSync, pathExistsSync, readFileSync } from 'fs-extra';
import { basename, dirname, join } from 'path';
import filenamify from 'filenamify';
import { diff, DiffOptions, EXPECTED_COLOR, matcherHint, MatcherHintOptions, RECEIVED_COLOR } from 'jest-matcher-utils';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';

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

/**
 * Check if 2 strings or buffer are equal
 */
function isEqual(a: string | Buffer, b: string | Buffer)
{
	// @ts-ignore: TypeScript gives error if we pass string to buffer.equals
	return Buffer.isBuffer(a) ? a.equals(b) : a === b;
}

/**
 * generate from the test title
 */
export function currentSnapshotFileName(context: Pick<IMatcherContext, 'testPath' | 'currentTestName' | 'assertionCalls'>)
{
	return join(
		dirname(context.testPath),
		'__file_snapshots__',
		`${filenamify(context.currentTestName, {
			replacement: '-',
		}).replace(/\s/g, '-')}-${context.assertionCalls}`,
	)
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
	const snapshotFileName = filepath ?? currentSnapshotFileName(this);
	const snapshotBaseName = basename(snapshotFileName);

	options = {
		// Options for jest-diff
		diff: Object.assign(
			{
				expand: false,
				contextLines: 5,
				aAnnotation: `Snapshot`,
			},
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
					snapshotBaseName,
				)} was ${RECEIVED_COLOR('not written')}.\n\n` +
				'The update flag must be explicitly passed to write a new snapshot.\n\n' +
				`This is likely because this test is run in a ${EXPECTED_COLOR(
					'continuous integration (CI) environment',
				)} in which snapshots are not written by default.\n\n`,
		};
	}

	let pass = false;
	let message = () => matcherHint(matcherName, undefined, snapshotBaseName, optsMatcherHint);

	if (pathExistsSync(snapshotFileName))
	{
		const expected = readFileSync(
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

					const difference =
						Buffer.isBuffer(received) || Buffer.isBuffer(expected)
							? ''
							: `\n\n${diff(expected, received, options.diff)}`;

					message = () =>
					{
						return matcherHint(matcherName, undefined, snapshotBaseName, optsMatcherHint) + difference
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
	};
}

export default {
	toMatchFile,
}
