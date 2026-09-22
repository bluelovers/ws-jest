import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveReporterOptions, formatSummary } from "./reporter.js";
import crossSpawn from 'cross-spawn';
const require = createRequire(import.meta.url);
/**
 * Locate the `tsx` CLI inside a pnpm store (the `node_modules/.pnpm/tsx@*`
 * directory) by scanning upward from this file. This is the same loader the
 * project already uses for `.ts` reporters (`test:node:reporter`), so it reuses
 * the proven mechanism.
 */
function findPnpmTsxBin() {
    var _a, _b;
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 12; i++) {
        const pnpmDir = join(dir, 'node_modules', '.pnpm');
        if (existsSync(pnpmDir)) {
            for (const name of readdirSync(pnpmDir)) {
                if (!/^tsx@/.test(name)) {
                    continue;
                }
                const pkgPath = join(pnpmDir, name, 'node_modules', 'tsx', 'package.json');
                if (!existsSync(pkgPath)) {
                    continue;
                }
                const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
                const bin = typeof pkg.bin === 'string' ? pkg.bin : ((_b = (_a = pkg.bin) === null || _a === void 0 ? void 0 : _a.tsx) !== null && _b !== void 0 ? _b : 'dist/cli.mjs');
                return fileURLToPath(new URL(bin, pathToFileURL(pkgPath)));
            }
            return null;
        }
        const parent = dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
    }
    return null;
}
/**
 * Resolve the `tsx` CLI entry so `runMaybe` can spawn it to run the tests
 * through the `--test-reporter` channel. Resolution order:
 *
 * 1. a normal `tsx/package.json` resolve from this file,
 * 2. scanning the pnpm store,
 * 3. `null` when tsx is genuinely unavailable.
 *
 * Returning `null` (instead of a bare `'tsx'`) is important: a consumer who
 * only writes `.js`/`.mjs` tests and has no TypeScript toolchain should fall
 * back to `node --test` directly, not fail with "tsx: command not found".
 */
function resolveTsxBin() {
    var _a, _b, _c;
    try {
        const pkgPath = require.resolve('tsx/package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const bin = typeof pkg.bin === 'string' ? pkg.bin : ((_b = (_a = pkg.bin) === null || _a === void 0 ? void 0 : _a.tsx) !== null && _b !== void 0 ? _b : 'dist/cli.mjs');
        return fileURLToPath(new URL(bin, pathToFileURL(pkgPath)));
    }
    catch {
        // ignore and try the pnpm store
    }
    return (_c = findPnpmTsxBin()) !== null && _c !== void 0 ? _c : null;
}
/**
 * Known runner commands accepted by {@link IRunMaybeOptions}. A plain
 * string (a custom command) may also be passed instead of a {@link EnumRunner} member
 * — e.g. `'bun'` or an absolute path to a runner.
 */
export var EnumRunner;
(function (EnumRunner) {
    /** Auto-detect: use `tsx` when resolvable, otherwise `node`. */
    EnumRunner["Auto"] = "auto";
    /** Always `node` + the built `run-collector.js` collector (no `tsx`). */
    EnumRunner["Node"] = "node";
    /** Always `tsx`; if genuinely absent the spawn fails naturally. */
    EnumRunner["Tsx"] = "tsx";
})(EnumRunner || (EnumRunner = {}));
/**
 * Run tests through Node's native test runner (the `node:test` `run()` entry
 * point) and resolve a maybe-aware {@link IMaybeRunSummary}.
 *
 * Because maybe tests are implemented on top of `todo: true`, Node counts them
 * inside its `todo` bucket. This API deducts the maybe quantity from `todo` so
 * the returned `todo` reflects the *real* pending TODOs.
 *
 * Implementation note: in this Node version `run()`'s own returned stream only
 * surfaces summary-level events and does **not** forward per-test
 * `test:pass`/`test:fail` events (which carry the `maybe` tag). The only
 * reliable channel for those is the `--test-reporter` stream, so this function
 * spawns the test runner (`node --test --test-reporter=…`) with a small JSON
 * collector (`run-collector.ts`) and parses its single summary line. The
 * collector logic mirrors {@link isMaybeEvent}.
 *
 * @example
 * ```ts
 * import { runMaybe } from 'node-test-maybe/run';
 *
 * const summary = await runMaybe({ files: ['test/**\/*.node-test.ts'] });
 * if (!summary.ok) process.exitCode = 1;
 * ```
 */
export async function runMaybe(runOptions = {}, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const tsxBin = resolveTsxBin();
    // The collector ships as `run-collector.ts` (loaded by `tsx`) and, once the
    // package is built, as `run-collector.js` (loaded natively by `node`).
    const runCollectorTsUrl = pathToFileURL(fileURLToPath(new URL('./run-collector.ts', import.meta.url))).href;
    const runCollectorJsUrl = pathToFileURL(fileURLToPath(new URL('./run-collector.js', import.meta.url))).href;
    // Decide which runner command to spawn. `runner` may be:
    //   - 'auto' (default): use `tsx` when resolvable, else `node`.
    //   - 'node'          : always `node` + the built `run-collector.js`.
    //   - 'tsx'           : always `tsx`; if it is genuinely absent the spawn
    //                       fails naturally, so we do NOT pre-validate/throw.
    //   - any other string: treated verbatim as the command (e.g. 'bun', an
    //                       absolute path). The built `.js` collector is used,
    //                       which any node-compatible runner can load.
    const runnerMode = (_a = options.runner) !== null && _a !== void 0 ? _a : EnumRunner.Auto;
    let command;
    let tsxCapable;
    if (runnerMode === EnumRunner.Node) {
        command = process.execPath;
        tsxCapable = false;
    }
    else if (runnerMode === EnumRunner.Tsx) {
        // No pre-check: when `tsx` is genuinely absent the spawn fails naturally.
        command = tsxBin !== null && tsxBin !== void 0 ? tsxBin : 'tsx';
        tsxCapable = true;
    }
    else if (runnerMode === EnumRunner.Auto) {
        tsxCapable = tsxBin !== null;
        command = tsxBin !== null && tsxBin !== void 0 ? tsxBin : process.execPath;
    }
    else {
        // Explicit command: treated verbatim. Assume it cannot load `.ts`, so the
        // built `.js` collector is used (any node-compatible runner can load it).
        command = runnerMode;
        tsxCapable = false;
    }
    // Pick the collector by which file is actually present:
    //   - `run-collector.ts` exists (dev, possibly before the build) → use it; it
    //     requires a `tsx`-capable runner.
    //   - only `run-collector.js` exists (published packages ship the build, not
    //     the `.ts` source) → use it; `node` and any node-compatible runner load
    //     it natively.
    const tsCollectorFsPath = fileURLToPath(runCollectorTsUrl);
    const jsCollectorFsPath = fileURLToPath(runCollectorJsUrl);
    const tsCollectorExists = existsSync(tsCollectorFsPath);
    const jsCollectorExists = existsSync(jsCollectorFsPath);
    let collectorPath;
    if (tsxCapable && tsCollectorExists) {
        collectorPath = runCollectorTsUrl;
    }
    else if (jsCollectorExists) {
        collectorPath = runCollectorJsUrl;
    }
    else if (tsCollectorExists) {
        // Only the `.ts` collector exists, but the chosen runner cannot load it.
        throw new Error(`runMaybe: only the TypeScript collector (${tsCollectorFsPath}) is present, `
            + 'but the selected runner cannot load `.ts`. Use runner: "tsx"/"auto" (needs tsx) '
            + 'or build the package so run-collector.js is emitted.');
    }
    else {
        throw new Error(`runMaybe: no test collector found. Looked for ${tsCollectorFsPath} and ${jsCollectorFsPath}. `
            + 'Build the package (e.g. `tsc` / `pnpm run build`) so run-collector.js is emitted.');
    }
    const reporterArgs = [`--test-reporter=${collectorPath}`, '--test'];
    if (Array.isArray(runOptions.files) && runOptions.files.length > 0) {
        reporterArgs.push(...runOptions.files);
    }
    const spawnArgs = [command, ...reporterArgs];
    const [tsxCommand, ...tsxArgs] = spawnArgs;
    // When `runMaybe` is itself invoked from inside a running test runner
    // (e.g. a `node:test` test file), the spawned child inherits the parent's
    // `NODE_TEST_*` worker markers. Node would then refuse to run with
    // "run() is being called recursively within a test file", so we strip those
    // markers from the child environment.
    const childEnv = { ...process.env };
    for (const key of Object.keys(childEnv)) {
        if (key.startsWith('NODE_TEST_')) {
            delete childEnv[key];
        }
    }
    // `crossSpawn` (the async form) returns a `ChildProcess`, not a promise of
    // `{ stdout }`, so we use its synchronous variant which returns the captured
    // output directly. `encoding: 'utf8'` makes `stdout` a string instead of a
    // Buffer. The collector's JSON summary is the last line of the output, which
    // `parseSummary` extracts regardless of any other runner text.
    const result = crossSpawn.sync(tsxCommand, tsxArgs, {
        cwd: (_b = options.cwd) !== null && _b !== void 0 ? _b : process.cwd(),
        env: childEnv,
        encoding: 'utf8',
    });
    if (result.error) {
        throw result.error;
    }
    const stdout = typeof result.stdout === 'string'
        ? result.stdout
        : ((_d = (_c = result.stdout) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '');
    const summary = parseSummary(stdout);
    if (!options.silent) {
        const reporterOptions = resolveReporterOptions((_e = options.reporterOptions) !== null && _e !== void 0 ? _e : {});
        const text = formatSummary({
            total: summary.total,
            passed: summary.passed,
            failed: summary.failed,
            skipped: summary.skipped,
            cancelled: summary.cancelled,
            todo: summary.rawTodo,
        }, summary.maybePassed, summary.maybeFailed, reporterOptions);
        if (text.length > 0) {
            ((_f = options.output) !== null && _f !== void 0 ? _f : process.stdout).write(text);
        }
    }
    return summary;
}
function parseSummary(stdout) {
    const lines = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    // The collector emits a single JSON object as its last non-empty line.
    for (let i = lines.length - 1; i >= 0; i--) {
        try {
            const value = JSON.parse(lines[i]);
            if (value
                && typeof value === 'object'
                && typeof value.total === 'number') {
                return normalize(value);
            }
        }
        catch {
            // not JSON, keep scanning upward
        }
    }
    throw new Error('runMaybe: could not find a JSON summary in the test runner output');
}
function normalize(value) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const total = (_a = value.total) !== null && _a !== void 0 ? _a : 0;
    const passed = (_b = value.passed) !== null && _b !== void 0 ? _b : 0;
    const failed = (_c = value.failed) !== null && _c !== void 0 ? _c : 0;
    const skipped = (_d = value.skipped) !== null && _d !== void 0 ? _d : 0;
    const cancelled = (_e = value.cancelled) !== null && _e !== void 0 ? _e : 0;
    const rawTodo = (_g = (_f = value.rawTodo) !== null && _f !== void 0 ? _f : value.todo) !== null && _g !== void 0 ? _g : 0;
    const maybePassed = (_h = value.maybePassed) !== null && _h !== void 0 ? _h : 0;
    const maybeFailed = (_j = value.maybeFailed) !== null && _j !== void 0 ? _j : 0;
    const maybeTotal = (_k = value.maybeTotal) !== null && _k !== void 0 ? _k : (maybePassed + maybeFailed);
    return {
        total,
        passed,
        failed,
        skipped,
        cancelled,
        rawTodo,
        todo: Math.max(0, rawTodo - maybeTotal),
        maybePassed,
        maybeFailed,
        maybeTotal,
        files: (_l = value.files) !== null && _l !== void 0 ? _l : [],
        ok: (_m = value.ok) !== null && _m !== void 0 ? _m : failed === 0,
    };
}
export default runMaybe;
//# sourceMappingURL=run.js.map