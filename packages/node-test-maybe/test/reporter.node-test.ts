import assert from 'node:assert/strict';
import test from 'node:test';
import {
	createReporter,
	isMaybeEvent,
} from '../reporter.ts';
import type { ReporterEvent } from '../reporter.ts';

function runReporter(events: ReporterEvent[]): Promise<string>
{
	const reporter = createReporter();
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

test('isMaybeEvent detects the maybe tag', () => {
	assert.equal(
		isMaybeEvent({ type: 'test:pass', data: { tags: ['network', 'maybe'] } }),
		true,
	);

	assert.equal(
		isMaybeEvent({ type: 'test:pass', data: { tags: ['network'] } }),
		false,
	);
});

test('isMaybeEvent detects the [maybe] name prefix', () => {
	assert.equal(
		isMaybeEvent({ type: 'test:pass', data: { name: '[maybe] external API' } }),
		true,
	);

	assert.equal(
		isMaybeEvent({ type: 'test:pass', data: { name: 'normal test' } }),
		false,
	);
});

test('isMaybeEvent returns false when there is no data', () => {
	assert.equal(isMaybeEvent({ type: 'test:plan' }), false);
});

test('reporter renders a normal pass with ✔', async () => {
	const out = await runReporter([
		{
			type: 'test:pass',
			data: { testId: 1, name: 'normal test', details: { duration_ms: 0.4 } },
		},
	]);

	assert.match(out, /✔ normal test \(400μs\)/);
	assert.doesNotMatch(out, /MAYBE/);
});

test('reporter renders a maybe pass with ◌ MAYBE', async () => {
	const out = await runReporter([
		{
			type: 'test:pass',
			data: {
				testId: 1,
				name: '[maybe] external API',
				tags: ['maybe'],
				details: { duration_ms: 124.2 },
			},
		},
	]);

	assert.match(out, /◌ MAYBE external API \(124\.2ms\)/);
});

test('reporter renders a normal failure with ✖ FAIL and the error', async () => {
	const out = await runReporter([
		{
			type: 'test:fail',
			data: {
				testId: 1,
				name: 'normal failure',
				details: {
					duration_ms: 0.8,
					error: new Error('boom'),
				},
			},
		},
	]);

	assert.match(out, /✖ FAIL normal failure/);
	assert.match(out, /boom/);
	assert.doesNotMatch(out, /MAYBE/);
});

test('reporter renders a maybe failure with ◌ MAYBE and the error', async () => {
	const out = await runReporter([
		{
			type: 'test:fail',
			data: {
				testId: 1,
				name: '[maybe] unstable service',
				tags: ['maybe'],
				details: {
					duration_ms: 0.7,
					error: new Error('Connection refused'),
				},
			},
		},
	]);

	assert.match(out, /◌ MAYBE unstable service/);
	assert.match(out, /Connection refused/);
	assert.doesNotMatch(out, /✖ FAIL/);
});

test('reporter distinguishes maybe via testId metadata', async () => {
	const out = await runReporter([
		// Metadata recorded before the result event.
		{
			type: 'test:start',
			data: { testId: 7, name: 'lazy name', tags: ['maybe'] },
		},
		{
			type: 'test:fail',
			data: { testId: 7, details: { error: new Error('nope') } },
		},
	]);

	assert.match(out, /◌ MAYBE lazy name/);
});

test('reporter prints a summary with a dedicated Maybe line', async () => {
	const out = await runReporter([
		{
			type: 'test:pass',
			data: { testId: 1, name: 'normal', details: { duration_ms: 1 } },
		},
		{
			type: 'test:pass',
			data: { testId: 2, name: '[maybe] ok', tags: ['maybe'], details: { duration_ms: 1 } },
		},
		{
			type: 'test:fail',
			data: {
				testId: 3,
				name: '[maybe] flaky',
				tags: ['maybe'],
				details: { duration_ms: 1, error: new Error('x') },
			},
		},
		{
			type: 'test:summary',
			data: {
				file: 'a.ts',
				counts: { total: 3, passed: 1, failed: 0, skipped: 0, cancelled: 0 },
			},
		},
	]);

	// The reporter prints the `Maybe` breakdown alongside the standard counts
	// for this file; the built-in summary is not echoed verbatim.
	assert.match(out, /Maybe:\s+2 \(passed: 1, failed: 1\)/);
	// The summary line must appear exactly once.
	assert.equal(out.match(/Maybe:/g)?.length, 1);
});

test('reporter prints the summary only once when the event fires twice', async () => {
	const out = await runReporter([
		{
			type: 'test:pass',
			data: { testId: 1, name: '[maybe] ok', tags: ['maybe'], details: { duration_ms: 1 } },
		},
		// Node may emit the same file's `test:summary` more than once under
		// some setups; the reporter must still print it only once.
		{
			type: 'test:summary',
			data: { file: 'a.ts', counts: { total: 1, passed: 0, failed: 0, skipped: 0, cancelled: 0 } },
		},
		{
			type: 'test:summary',
			data: { file: 'a.ts', counts: { total: 1, passed: 0, failed: 0, skipped: 0, cancelled: 0 } },
		},
	]);

	assert.match(out, /Maybe:\s+1 \(passed: 1, failed: 0\)/);
	assert.equal(out.match(/Maybe:/g)?.length, 1);
});

test('reporter summarizes from test:summary and omits zero counts', async () => {
	const out = await runReporter([
		// The `maybe` results are streamed during the file's run, before its
		// `test:summary` — matching the real event ordering.
		{ type: 'test:pass', data: { testId: 1, name: '[maybe] ok', tags: ['maybe'] } },
		{
			type: 'test:fail',
			data: { testId: 2, name: '[maybe] flaky', tags: ['maybe'], details: { error: new Error('x') } },
		},
		// Node delivers one `test:summary` per file; its counts are already
		// todo-aware — a failing `maybe` test lands in `todo`, not `failed`.
		// Here: 5 normal passes, 2 maybe (1 pass + 1 fail) counted as `todo`.
		{
			type: 'test:summary',
			data: { file: 'a.ts', counts: { total: 7, passed: 5, failed: 0, skipped: 0, cancelled: 0, todo: 2 } },
		},
		// A non-summary diagnostic must still be echoed.
		{ type: 'test:diagnostic', data: { message: 'note from runner' } },
	]);

	assert.match(out, /Tests:\s+7/);
	assert.match(out, /Passed:\s+5/);
	assert.match(out, /TODO:\s+2/);
	assert.match(out, /Maybe:\s+2 \(passed: 1, failed: 1\)/);

	// A hard `Failed` of 0 is filtered out.
	assert.doesNotMatch(out, /Failed:/);
	// Zero counts are filtered out.
	assert.doesNotMatch(out, /cancelled 0/);
	assert.doesNotMatch(out, /skipped 0/);

	// Node's built-in summary diagnostics are consumed, not echoed verbatim.
	assert.doesNotMatch(out, /\btests \d/);
	assert.match(out, /note from runner/);
});
