/**
 * Resolves an asset path. In the normal build this is the path itself; the
 * single-file build embeds every asset and provides a table of data URLs.
 */
export function asset(path: string): string {
  const table = (globalThis as unknown as { __TLS_ASSETS?: Record<string, string> }).__TLS_ASSETS;
  return table?.[path] ?? path;
}
