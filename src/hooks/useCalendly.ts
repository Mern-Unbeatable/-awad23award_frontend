import { useCallback, useEffect, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import {
  closeCalendlyPopup,
  loadCalendlyAssets,
  openCalendlyPopup,
  resolveCalendlyUrl,
  resolveExternalBookingUrl,
} from '../lib/calendly';

export function useCalendly() {
  const { settings } = useSite();
  const calendlyPopupUrl = useMemo(
    () => resolveCalendlyUrl(settings.calendlyUrl || ''),
    [settings.calendlyUrl]
  );
  const externalUrl = useMemo(
    () => resolveExternalBookingUrl(settings.calendlyUrl || ''),
    [settings.calendlyUrl]
  );
  const isConfigured = Boolean(calendlyPopupUrl || externalUrl);

  useEffect(() => {
    if (!calendlyPopupUrl) return;
    void loadCalendlyAssets();
    return () => {
      closeCalendlyPopup();
    };
  }, [calendlyPopupUrl]);

  const openCalendar = useCallback(async () => {
    if (calendlyPopupUrl) return openCalendlyPopup(calendlyPopupUrl);
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      return true;
    }
    return false;
  }, [calendlyPopupUrl, externalUrl]);

  return { url: calendlyPopupUrl || externalUrl, isConfigured, openCalendar };
}
