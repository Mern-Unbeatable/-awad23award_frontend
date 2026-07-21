import { useCallback, useEffect, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { closeCalendlyPopup, loadCalendlyAssets, openCalendlyPopup, resolveCalendlyUrl } from '../lib/calendly';

export function useCalendly() {
  const { settings } = useSite();
  const url = useMemo(() => resolveCalendlyUrl(settings.calendlyUrl || ''), [settings.calendlyUrl]);
  const isConfigured = Boolean(url);

  useEffect(() => {
    if (!url) return;
    void loadCalendlyAssets();
    return () => {
      closeCalendlyPopup();
    };
  }, [url]);

  const openCalendar = useCallback(async () => {
    if (!url) return false;
    return openCalendlyPopup(url);
  }, [url]);

  return { url, isConfigured, openCalendar };
}
