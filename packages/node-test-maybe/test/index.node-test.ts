import assert from 'node:assert/strict';
import test from '../index.js';
import {
	maybe,
	fixme,
	buildMaybeName,
	buildMaybeTags,
	MAYBE_TAG,
	MAYBE_PREFIX,
	FIXME_PREFIX,
} from '../index.js';
import { TestContext } from 'node:test';

test('buildMaybeName prefixes the human-visible name', () => {
	assert.equal(buildMaybeName('external API'), '[maybe] external API');
	assert.equal(buildMaybeName('external API', 'maybe'), '[maybe] external API');
});

test('buildMaybeName supports the fixme display variant', () => {
	assert.equal(buildMaybeName('external API', 'fixme'), '[fixme] external API');
});

test('buildMaybeTags preserves user tags and appends maybe', (t: TestContext) => {
	t.assert.deepEqual(buildMaybeTags(['network', 'external']), [
		'network',
		'external',
		'maybe',
	]);
	t.assert.deepEqual(buildMaybeTags(), ['maybe']);
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

test('maybe(name, { display }) registers the matching display name', () => {
	let ran = false;
	let seen = '';

	const sub = maybe('flaky endpoint', { display: 'fixme' }, (t) => {
		ran = true;
		seen = t.name;
	});

	assert.equal(typeof sub, 'object');
	assert.equal(ran, true);
	// Only the visible name changes; execution still goes through `todo: true`.
	assert.equal(seen, '[fixme] flaky endpoint');
});

test('maybe rejects an unknown display variant', () => {
	assert.throws(
		() => maybe('bad display', { display: 'fimxe' as never }, () => {}),
		/Unknown maybe display variant/,
	);
});

test('fixme(name, fn) executes with the fixme display', () => {
	let ran = false;
	let seen = '';

	fixme('unstable service', (t) => {
		ran = true;
		seen = t.name;
	});

	assert.equal(ran, true);
	assert.equal(seen, '[fixme] unstable service');
});

test('fixme(name, options, fn) owns the display value', () => {
	let seen = '';

	fixme('forced fixme', { display: 'maybe', timeout: 5000 }, (t) => {
		seen = t.name;
	});

	assert.equal(seen, '[fixme] forced fixme');
});

test('fixme(name) requires a test function', () => {
	assert.throws(
		() => fixme('only a name'),
		/requires a test function/,
	);
});

test('fixme(invalidName) requires a string name', () => {
	assert.throws(
		() => fixme(undefined as never),
		/requires a string name/,
	);
});

// Live demonstration: a failing maybe test is executed by Node, detected as a
// real failure, but does NOT break the run (exit code stays 0) because the
// test is marked `todo`. It appears as a TODO failure in the output.
test.maybe('example: expected non-blocking failure', () => {
	assert.equal(1, 2);
});

// Live demonstration: the fixme display variant behaves exactly like maybe —
// the failure is executed, reported as TODO, and never breaks the run; only
// the display differs (`[fixme] ` prefix).
test.fixme('example: expected non-blocking fixme failure', () => {
	assert.equal(1, 2);
});
