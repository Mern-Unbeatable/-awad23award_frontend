import { lazy, type ComponentType } from 'react';

/** Lazy-load a named page export without converting pages to default exports. */
export function lazyNamed<M extends Record<string, unknown>>(
  importer: () => Promise<M>,
  exportName: keyof M,
) {
  return lazy(async () => {
    const mod = await importer();
    return { default: mod[exportName] as ComponentType };
  });
}

export function RouteFallback() {
  return (
    <div className='min-h-[40vh] flex items-center justify-center bg-white'>
      <div
        className='h-8 w-8 rounded-full border-2 border-[#36BFFB] border-t-transparent animate-spin'
        aria-label='Loading'
      />
    </div>
  );
}
