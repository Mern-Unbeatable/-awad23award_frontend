/** Bilingual public paths (English + Arabic `/ar` prefix). */
export function publicPaths(path: string): string[] {
  if (path === '/') return ['/', '/ar'];
  return [path, `/ar${path}`];
}
