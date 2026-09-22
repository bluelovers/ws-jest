import assert from 'node:assert/strict';
import test from 'node:test';

// A plain-JS fixture executed by `runMaybe({ files: [...] })`. It mirrors the
// `maybe` API using the same contract (name prefix + `maybe` tag + `todo: true`)
// so `isMaybeEvent` detects them without pulling in the TS source.

test('normal passing', () => {
	assert.ok(true);
});

test('[maybe] maybe passing', { todo: true, tags: ['maybe'] }, () => {
	assert.ok(true);
});

test('[maybe] maybe failing', { todo: true, tags: ['maybe'] }, () => {
	assert.equal(1, 2);
});

test('real todo', { todo: true }, () => {
	// An expected-incomplete test that is NOT a maybe test.
});
