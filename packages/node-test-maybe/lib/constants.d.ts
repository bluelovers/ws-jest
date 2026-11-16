/**
 * Tag used to mark a test as a "maybe" test.
 *
 * Machine-readable metadata consumed by reporters / tag filters.
 *
 * Both display variants (`maybe` and `fixme`) share this tag: the `fixme`
 * variant only changes the human-visible display, never the semantics.
 */
export declare const MAYBE_TAG: "maybe";
/**
 * Human-readable prefix appended to the test name.
 *
 * Portable metadata: even the built-in Node reporter (which only shows
 * the test name) will display the `[maybe]` intent.
 */
export declare const MAYBE_PREFIX: "[maybe] ";
/**
 * Human-readable prefix used by the `fixme` display variant.
 *
 * Serves the same purpose as {@link MAYBE_PREFIX} — portable, human-visible
 * metadata — only the visible text differs; the runner semantics stay those
 * of a maybe test.
 */
export declare const FIXME_PREFIX: "[fixme] ";
/**
 * Display variant of the maybe semantics.
 *
 * - `maybe` (default): `[maybe] ` prefix / `◌ MAYBE` marker
 * - `fixme`: `[fixme] ` prefix / `◌ FIXME` marker
 *
 * Execution is identical for both; only the display differs.
 */
export type IMaybeDisplay = 'maybe' | 'fixme';
/**
 * Resolve the human-visible prefix for a display variant.
 *
 * `undefined` falls back to {@link MAYBE_PREFIX}; an unknown string throws so
 * a typo never silently falls back to the default display.
 */
export declare function resolveMaybePrefix(display?: IMaybeDisplay): typeof MAYBE_PREFIX | typeof FIXME_PREFIX;
/**
 * Detect the display variant encoded in a test name's prefix.
 *
 * The display is carried by the name alone, so reporters can recover it from
 * raw test names even when tags are unavailable.
 */
export declare function resolveMaybeDisplay(name: string): IMaybeDisplay;
