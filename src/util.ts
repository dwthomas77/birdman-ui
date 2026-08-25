import type { FetchJsonType } from "./types";

// Minimal fetch wrapper that always requests JSON and applies sensible defaults
export async function fetchJson<T = FetchJsonType>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    const err = new Error(
      `Request failed: ${res.status} ${res.statusText}${bodyText ? ` - ${bodyText}` : ''}`,
    );
    throw err;
  }

  if (res.status === 204) {
    // No Content
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
}

export default fetchJson;

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
