import assert from 'node:assert/strict';
import test from 'node:test';

// The minimal preset live in `reporter-min.ts`, which wires
// `createReporter({ }, { maybeOnly: true })` (zero counts are hidden by
// default). We exercise the real default export here, and also assert the
// env-override path that the preset relies on.
import repMin from '../reporter-min.ts';
import {
	createReporter,
	resolveReporterOptions,
	REPORTER_ENV_KEYS,
} from '../reporter.ts';
import type { IReporterEvent } from '../reporter.ts';

function runReporter(
	events: IReporterEvent[],
	reporter = createReporter({}, { maybeOnly: true }),
): Promise<string>
{
	let output = '';

	reporter.on('data', (chunk: Buffer | string) => {
		output += chunk.toString();
	});

	for (const event of events)
	{
		reporter.write(event);
	}

	reporter.end();

	return new Promise((resolve, reject) => {
		reporter.on('finish', () => resolve(output));
		reporter.on('error', reject);
	});
}

test('reporter-min default export is a Transform instance', () => {
	assert.equal(repMin.constructor.name, 'Transform');
});

test('reporter-min only adds ◌ MAYBE and keeps other messages intact', async () => {
	const out = await runReporter([
		{ type: 'test:pass', data: { testId: 1, name: 'normal pass', details: { duration_ms: 1 } } },
		{
			type: 'test:fail',
			data: {
				testId: 2,
				name: 'normal fail',
				details: { duration_ms: 1, error: new Error('boom') },
			},
		},
		{ type: 'test:pass', data: { testId: 3, name: '[maybe] ok', tags: ['maybe'], details: { duration_ms: 1 } } },
		{ type: 'test:stdout', data: { message: 'original stdout' } },
	], repMin);

	assert.doesNotMatch(out, /✔/);
	assert.doesNotMatch(out, /✖ FAIL/);
	assert.doesNotMatch(out, /boom/);
	assert.match(out, /◌ MAYBE ok/);
	assert.match(out, /original stdout/);
});

test('reporter-min summary only shows the Maybe line', async () => {
	const out = await runReporter([
		{ type: 'test:pass', data: { testId: 1, name: 'normal', details: { duration_ms: 1 } } },
		{ type: 'test:pass', data: { testId: 2, name: '[maybe] ok', tags: ['maybe'], details: { duration_ms: 1 } } },
		{
			type: 'test:summary',
			data: { file: 'a.ts', counts: { total: 2, passed: 1, failed: 0, skipped: 0, cancelled: 0, todo: 1 } },
		},
	]);

	assert.doesNotMatch(out, /Tests:/);
	assert.doesNotMatch(out, /Passed:/);
	assert.match(out, /Maybe:\s+1 \(passed: 1, failed: 0\)/);
});

test('reporter-min reads env vars via the same resolution path', () => {
	const key = REPORTER_ENV_KEYS.maybeOnly;
	const prev = process.env[key];

	try
	{
		process.env[key] = '1';

		// The preset supplies `maybeOnly: true` as an `envDefaults` value, so
		// an env `true` keeps the minimal behaviour.
		const opts = resolveReporterOptions({}, { maybeOnly: true });

		assert.equal(opts.maybeOnly, true);
		assert.equal(opts.showZero, false);

		// An env `false` must override the preset's `maybeOnly: true`.
		process.env[key] = '0';
		const overridden = resolveReporterOptions({}, { maybeOnly: true });

		assert.equal(overridden.maybeOnly, false);
	}
	finally
	{
		if (prev === undefined)
		{
			delete process.env[key];
		}
		else
		{
			process.env[key] = prev;
		}
	}
});
