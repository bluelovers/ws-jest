import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';
import test from 'node:test';

import { runMaybe } from '../run.ts';
import type { MaybeRunSummary } from '../run.ts';

const fixture = fileURLToPath(new URL('./fixtures/sample.mjs', import.meta.url));

function captureWritable(): { stream: Writable; get(): string }
{
	let buffer = '';

	const stream = new Writable({
		write(chunk, _encoding, callback)
		{
			buffer += chunk.toString();
			callback();
		},
	});

	return {
		stream,
		get: () => buffer,
	};
}

test('runMaybe collects a maybe-aware summary and deducts maybe from todo', async () => {
	const summary = await runMaybe({ files: [fixture] }, { silent: true });

	// 1 normal pass + 2 maybe + 1 real todo -> total 4.
	assert.equal(summary.total, 4);
	// The normal pass is the only non-maybe pass; maybe passes are counted as
	// `todo` by Node, not `passed`.
	assert.equal(summary.passed, 1);
	// No hard failures: the failing maybe test is non-blocking.
	assert.equal(summary.failed, 0);

	// Two maybe tests (one pass, one fail).
	assert.equal(summary.maybePassed, 1);
	assert.equal(summary.maybeFailed, 1);
	assert.equal(summary.maybeTotal, 2);

	// Raw `todo` from Node is 3 (both maybe + the real todo). After deducting
	// the 2 maybe results, the real TODO count is 1.
	assert.equal(summary.rawTodo, 3);
	assert.equal(summary.todo, 1);

	// A failing maybe does not break the run.
	assert.equal(summary.ok, true);
	assert.ok(Array.isArray(summary.files));
	assert.equal(summary.files.length, 1);
});

test('runMaybe prints a compact report when not silent', async () => {
	const sink = captureWritable();

	await runMaybe({ files: [fixture] }, { silent: false, output: sink.stream });

	const out = sink.get();

	// The Maybe breakdown reflects the two maybe tests.
	assert.match(out, /Maybe:\s+2 \(passed: 1, failed: 1\)/);
	// Real todo (1) is shown after the deduction; zero counts stay hidden by
	// default, so `Failed: 0` must NOT appear.
	assert.match(out, /TODO:\s+1/);
	assert.doesNotMatch(out, /Failed:\s+0/);
});
