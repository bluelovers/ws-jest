/**
 * Tag used to mark a test as a "maybe" test.
 *
 * Machine-readable metadata consumed by reporters / tag filters.
 */
export declare const MAYBE_TAG: "maybe";
/**
 * Human-readable prefix appended to the test name.
 *
 * Portable metadata: even the built-in Node reporter (which only shows
 * the test name) will display the `[maybe]` intent.
 */
export declare const MAYBE_PREFIX: "[maybe] ";
