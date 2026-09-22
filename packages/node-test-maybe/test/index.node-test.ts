import assert from 'node:assert/strict';
import test from '../index.js';
import {
	maybe,
	buildMaybeName,
	buildMaybeTags,
	MAYBE_TAG,
	MAYBE_PREFIX,
} from '../index.js';

test('maybe exports the expected metadata', () => {
	assert.equal(MAYBE_TAG, 'maybe');
	assert.equal(MAYBE_PREFIX, '[maybe] ');
	assert.equal(typeof maybe, 'function');
	assert.equal(typeof test.maybe, 'function');
});

test('buildMaybeName prefixes the human-visible name', () => {
	assert.equal(buildMaybeName('external API'), '[maybe] external API');
});

test('buildMaybeTags preserves user tags and appends maybe', () => {
	assert.deepEqual(buildMaybeTags(['network', 'external']), [
		'network',
		'external',
		'maybe',
	]);
	assert.deepEqual(buildMaybeTags(), ['maybe']);
});

test('maybe(name) requires a test function', () => {
	assert.throws(
		() => maybe('only a name'),
		/requires a test function/,
	);
});

test('maybe(invalidName) requires a string name', () => {
	assert.throws(
		() => maybe(undefined as never),
		/requires a string name/,
	);
});

test('maybe(fn) derives the name from the function', () => {
	let ran = false;

	const sub = maybe(function myCheck() {
		ran = true;
	});

	assert.equal(typeof sub, 'object');
	assert.equal(ran, true);
	assert.equal(buildMaybeName('myCheck'), '[maybe] myCheck');
});

test('maybe(name, fn) executes the callback', () => {
	let ran = false;

	maybe('external API', () => {
		ran = true;
		assert.equal(1, 1);
	});

	assert.equal(ran, true);
});

test('maybe(name, options, fn) forwards node options and adds the maybe tag', () => {
	let ran = false;

	const sub = maybe(
		'network call',
		{
			timeout: 5000,
			tags: ['network', 'external'],
		},
		() => {
			ran = true;
		},
	);

	assert.equal(typeof sub, 'object');
	assert.equal(ran, true);
	assert.deepEqual(buildMaybeTags(['network', 'external']), [
		'network',
		'external',
		'maybe',
	]);
});

test('maybe preserves user tags while owning todo semantics', () => {
	let ran = false;

	const sub = maybe(
		'combined tags',
		{ tags: ['smoke'] },
		() => {
			ran = true;
		},
	);

	assert.equal(typeof sub, 'object');
	assert.equal(ran, true);
	assert.deepEqual(buildMaybeTags(['smoke']), ['smoke', 'maybe']);
});

// Live demonstration: a failing maybe test is executed by Node, detected as a
// real failure, but does NOT break the run (exit code stays 0) because the
// test is marked `todo`. It appears as a TODO failure in the output.
test.maybe('example: expected non-blocking failure', () => {
	assert.equal(1, 2);
});
