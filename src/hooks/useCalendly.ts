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
  const { settings, scheduling } = useSite();

  const bookingRaw = useMemo(() => {
    if (!scheduling.isEnabled) return '';
    return scheduling.bookingUrl || settings.calendlyUrl || '';
  }, [scheduling.isEnabled, scheduling.bookingUrl, settings.calendlyUrl]);

  const calendlyPopupUrl = useMemo(() => resolveCalendlyUrl(bookingRaw), [bookingRaw]);
  const externalUrl = useMemo(() => resolveExternalBookingUrl(bookingRaw), [bookingRaw]);
  const isConfigured = scheduling.isEnabled && Boolean(calendlyPopupUrl || externalUrl);

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

  return {
    url: calendlyPopupUrl || externalUrl,
    isConfigured,
    openCalendar,
    scheduling,
  };
}
