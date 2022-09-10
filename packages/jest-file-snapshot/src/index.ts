import { existsSync, readFileSync, outputFileSync } from 'fs-extra';
import { basename, dirname, join } from 'path';
import filenamify from 'filenamify';
import { diff, DiffOptions, EXPECTED_COLOR, RECEIVED_COLOR } from 'jest-matcher-utils';

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

interface IMatcherContext extends jest.MatcherContext
{
	snapshotState?: {
		added: number,
		updated: number,
		unmatched: number,
		_updateSnapshot: 'none' | 'new' | 'all'
	}
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
 * Match given content against content of the specified file.
 *
 * @param {string | Buffer} content Output content to match
 * @param {string} [filepath] Path to the file to match against
 * @param {{ diff?: import('jest-diff').DiffOptions }} options Additional options for matching
 */
export function toMatchFile(this: IMatcherContext,
	content: string | Buffer,
	filepath: string,
	options: IFileMatcherOptions = {},
)
{
	const { isNot, snapshotState } = this;

	/**
	 * If file name is not specified, generate one from the test title
	 */
	const filename = filepath ?? join(
		dirname(this.testPath),
		'__file_snapshots__',
		`${filenamify(this.currentTestName, {
			replacement: '-',
		}).replace(/\s/g, '-')}-${this.assertionCalls}`,
	);

	options = {
		// Options for jest-diff
		diff: Object.assign(
			{
				expand: false,
				contextLines: 5,
				aAnnotation: 'Snapshot',
			},
			options.diff,
		),
	};

	if (snapshotState._updateSnapshot === 'none' && !existsSync(filename))
	{
		// We're probably running in CI environment

		snapshotState.unmatched++;

		return {
			pass: isNot,
			message: () =>
				`New output file ${EXPECTED_COLOR(
					basename(filename),
				)} was ${RECEIVED_COLOR('not written')}.\n\n` +
				'The update flag must be explicitly passed to write a new snapshot.\n\n' +
				`This is likely because this test is run in a ${EXPECTED_COLOR(
					'continuous integration (CI) environment',
				)} in which snapshots are not written by default.\n\n`,
		};
	}

	if (existsSync(filename))
	{
		const output = readFileSync(
			filename,
			Buffer.isBuffer(content) ? null : 'utf8',
		);

		if (isNot)
		{
			// The matcher is being used with `.not`

			if (!isEqual(content, output))
			{
				// The value of `pass` is reversed when used with `.not`
				return { pass: false, message: () => '' };
			}
			else
			{
				snapshotState.unmatched++;

				return {
					pass: true,
					message: () =>
						`Expected received content ${RECEIVED_COLOR(
							'to not match',
						)} the file ${EXPECTED_COLOR(basename(filename))}.`,
				};
			}
		}
		else
		{
			if (isEqual(content, output))
			{
				return { pass: true, message: () => '' };
			}
			else
			{
				if (snapshotState._updateSnapshot === 'all')
				{
					outputFileSync(filename, content);

					snapshotState.updated++;

					return { pass: true, message: () => '' };
				}
				else
				{
					snapshotState.unmatched++;

					const difference =
						Buffer.isBuffer(content) || Buffer.isBuffer(output)
							? ''
							: `\n\n${diff(output, content, options.diff)}`;

					return {
						pass: false,
						message: () =>
							`Received content ${RECEIVED_COLOR(
								"doesn't match",
							)} the file ${EXPECTED_COLOR(basename(filename))}.${difference}`,
					};
				}
			}
		}
	}
	else
	{
		if (
			!isNot &&
			(snapshotState._updateSnapshot === 'new' ||
				snapshotState._updateSnapshot === 'all')
		)
		{
			outputFileSync(filename, content);

			snapshotState.added++;

			return { pass: true, message: () => '' };
		}
		else
		{
			snapshotState.unmatched++;

			return {
				pass: true,
				message: () =>
					`The output file ${EXPECTED_COLOR(
						basename(filename),
					)} ${RECEIVED_COLOR("doesn't exist")}.`,
			};
		}
	}
}

export default {
	toMatchFile,
}
