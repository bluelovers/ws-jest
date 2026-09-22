// Plain-JavaScript example: run `runMaybe` without TypeScript and without tsx.
//
// Run it with plain `node` (no tsx required in your toolchain):
//
//   node test/example/run-maybe-js.mjs
//
// In a published project you would write:
//
//   import { runMaybe } from 'node-test-maybe';
//
// Here it imports the built package source directly so the example runs from
// the working tree without a build step.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { runMaybe, RunnerEnum } from '../../index.js';

const here = dirname(fileURLToPath(import.meta.url));
const __root = join(here, '..', '..');

const fixture = join(__root, 'test', 'fixtures', '*.mjs');

// A pure-`.js`/`.mjs` project should force `RunnerEnum.Node` so `runMaybe` never
// picks up an ambient `tsx` that may be installed in the environment — the tests
// then run through Node's native runner, identical to production.
const options = { silent: true, runner: RunnerEnum.Node };

// 1) Silent run: `runMaybe` returns a maybe-aware summary object.
const summary = await runMaybe({ files: [fixture] }, options);

console.log('=== runMaybe summary (silent: true) ===');
console.log(JSON.stringify(summary, null, 2));

// 2) Verbose run: `runMaybe` prints the compact human-readable report.
console.log('\n=== runMaybe report (silent: false) ===');
await runMaybe({ files: [fixture] }, { ...options, silent: false });

if (!summary.ok)
{
	process.exitCode = 1;
}
