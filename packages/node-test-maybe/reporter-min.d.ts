/**
 * Minimal reporter preset.
 *
 * Behaviour:
 *
 * - `maybeOnly: true`  – only the `◌ MAYBE` markers for maybe tests are added;
 *   normal `✔`/`✖ FAIL` lines are omitted and every other original message
 *   (stdout/stderr/diagnostics/watch) is passed through unchanged.
 * - zero counts are hidden by default (the intended default), which is the
 *   same as `showZero: false`.
 *
 * Both knobs can still be overridden from the environment (see
 * {@link REPORTER_ENV_KEYS} in `reporter.ts`):
 *
 * ```bash
 * # disable maybe-only and show the full report again
 * NODE_TEST_MAYBE_REPORTER_MAYBE_ONLY=0 node --test --test-reporter=./reporter-min.ts
 * ```
 *
 * The env defaults are supplied as `envDefaults` (not `explicit`) so the env
 * vars keep the highest priority over this preset.
 */
declare const _default: import("node:stream").Transform;
export default _default;
