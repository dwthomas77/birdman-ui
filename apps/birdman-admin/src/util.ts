/**
 * Combines multiple lists of class names into a single space-separated string.
 * - Accepts strings with multiple classes separated by spaces.
 * - Ignores falsy values (null, undefined, empty strings).
 * - Removes duplicate class names.
 * - Trims extra spaces.
 *
 * @param classLists - Multiple strings or arrays of strings containing class names.
 * @returns A single string with unique class names separated by a single space.
 */
export function combineClassNames(...classLists: Array<string | undefined | null>): string {
    const classSet = new Set<string>();

    for (const list of classLists) {
        if (typeof list === "string" && list.trim()) {
            // Split by whitespace and filter out empty strings
            list
                .trim()
                .split(/\s+/)
                .forEach(cls => classSet.add(cls));
        }
    }

    return Array.from(classSet).join(" ");
}
