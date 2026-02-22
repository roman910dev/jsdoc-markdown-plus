/**
 * # Documentation matters
 *
 * Code explains *how*.
 * Documentation explains **why**.
 *
 * This block exists to show that documentation should be:
 *
 * - Readable
 * - Visually distinct
 * - Treated as context, not logic
 *
 * ```ts
 * normalizeUserInput(raw)
 * ```
 *
 * When documentation stands out:
 *
 * - Files are easier to scan
 * - Intent is clearer
 * - AI tools reason better
 *
 * > Documentation is signal, not noise.
 */
export function normalizeUserInput(input: string): string {
	return input.trim().toLowerCase()
}
