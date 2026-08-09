import { useState, useEffect } from 'react';
import { CalendarClock, Loader2, Save } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { useSite } from '../../context/SiteContext';
import { isAxiosError } from 'axios';
import type { SchedulingPlatform, SchedulingSettings } from '../../types';

type SchedulingFormState = Omit<SchedulingSettings, 'id' | 'bookingUrl'>;

const DEFAULT_SETTINGS: SchedulingFormState = {
  platform: 'calendly',
  isEnabled: false,
  buttonText: 'Book Now',
  buttonColor: '#2563eb',
};

function mapSchedulingToForm(data: SchedulingSettings): SchedulingFormState {
  return {
    platform: data.platform,
    isEnabled: data.isEnabled,
    calendlyUrl: data.calendlyUrl,
    calComUsername: data.calComUsername,
    savvyCalUsername: data.savvyCalUsername,
    acuityUserId: data.acuityUserId,
    customLink: data.customLink,
    buttonText: data.buttonText || DEFAULT_SETTINGS.buttonText,
    buttonColor: data.buttonColor || DEFAULT_SETTINGS.buttonColor,
  };
}

function buildSchedulingPayload(settings: SchedulingFormState): Omit<SchedulingSettings, 'id' | 'bookingUrl'> {
  return {
    platform: settings.platform,
    isEnabled: settings.isEnabled,
    buttonText: settings.buttonText.trim(),
    buttonColor: settings.buttonColor?.trim() || null,
    calendlyUrl: settings.platform === 'calendly' ? settings.calendlyUrl?.trim() : undefined,
    calComUsername: settings.platform === 'calcom' ? settings.calComUsername?.trim() : undefined,
    savvyCalUsername: settings.platform === 'savvycal' ? settings.savvyCalUsername?.trim() : undefined,
    acuityUserId: settings.platform === 'acuity' ? settings.acuityUserId?.trim() : undefined,
    customLink: settings.platform === 'custom' ? settings.customLink?.trim() : undefined,
  };
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-200 rounded-sm text-[14px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 focus:border-[#38BDF8] transition-colors';
const labelClass = 'block text-[13px] font-semibold text-slate-700 mb-1.5';

export const AdminSettingsPage = () => {
  const { refresh } = useSite();
  const [settings, setSettings] = useState<SchedulingFormState>(DEFAULT_SETTINGS);
  const [bookingUrl, setBookingUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    void fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadError(null);
      const { data } = await adminApi.getSchedulingSettings();
      setSettings(mapSchedulingToForm(data));
      setBookingUrl(data.bookingUrl || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoadError(
        isAxiosError(error) && error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : 'Failed to load scheduling settings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const payload = buildSchedulingPayload(settings);
    const resolvedUrl = settings.isEnabled ? getSchedulingUrl(settings) || '' : '';

    if (settings.isEnabled) {
      const validationError = validateSchedulingInput(settings, resolvedUrl);
      if (validationError) {
        setMessage({ type: 'error', text: validationError });
        return;
      }
    }

    try {
      setSaving(true);
      setMessage(null);

      const { data } = await adminApi.updateSchedulingSettings(payload);
      setSettings(mapSchedulingToForm(data));
      setBookingUrl(data.bookingUrl || '');
      await refresh();

      setMessage({
        type: 'success',
        text: 'Scheduling settings saved successfully.',
      });
    } catch (error) {
      const text =
        isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Failed to save settings. Please try again.';
      setMessage({ type: 'error', text });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlatformChange = (platform: SchedulingPlatform) => {
    setSettings({
      ...settings,
      platform,
      calendlyUrl: undefined,
      calComUsername: undefined,
      savvyCalUsername: undefined,
      acuityUserId: undefined,
      customLink: undefined,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="p-4 rounded-sm bg-red-50 text-red-800 border border-red-200 text-[14px]">
          {loadError}
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void fetchSettings();
          }}
          className="mt-4 px-4 py-2.5 bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold rounded-sm transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const previewUrl = settings.isEnabled ? getSchedulingUrl(settings) || bookingUrl : '';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">
          Scheduling Settings
        </h1>
        <p className="text-[14px] text-slate-500 mt-1">
          Configure your booking platform, link, and button preferences for the public site.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-sm text-[14px] border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-sm border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">Enable Scheduling</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Turn booking functionality on or off across the site
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              settings.isEnabled ? 'bg-[#38BDF8]' : 'bg-slate-300'
            }`}
            aria-pressed={settings.isEnabled}
            aria-label="Toggle scheduling"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className={labelClass}>Booking Platform</label>
          <select
            value={settings.platform}
            onChange={(e) => handlePlatformChange(e.target.value as SchedulingPlatform)}
            className={inputClass}
          >
            <option value="calendly">Calendly</option>
            <option value="calcom">Cal.com</option>
            <option value="savvycal">SavvyCal</option>
            <option value="acuity">Acuity Scheduling</option>
            <option value="custom">Custom Link</option>
          </select>
        </div>

        <div className="space-y-4">
          {settings.platform === 'calendly' && (
            <div>
              <label className={labelClass}>Calendly URL</label>
              <input
                type="url"
                value={settings.calendlyUrl || ''}
                onChange={(e) => setSettings({ ...settings, calendlyUrl: e.target.value })}
                placeholder="https://calendly.com/your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">Your Calendly booking page URL</p>
            </div>
          )}

          {settings.platform === 'calcom' && (
            <div>
              <label className={labelClass}>Cal.com Username</label>
              <input
                type="text"
                value={settings.calComUsername || ''}
                onChange={(e) => setSettings({ ...settings, calComUsername: e.target.value })}
                placeholder="your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">
                e.g. &quot;john&quot; for cal.com/john
              </p>
            </div>
          )}

          {settings.platform === 'savvycal' && (
            <div>
              <label className={labelClass}>SavvyCal Username</label>
              <input
                type="text"
                value={settings.savvyCalUsername || ''}
                onChange={(e) => setSettings({ ...settings, savvyCalUsername: e.target.value })}
                placeholder="your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">
                e.g. &quot;john&quot; for savvycal.com/john
              </p>
            </div>
          )}

          {settings.platform === 'acuity' && (
            <div>
              <label className={labelClass}>Acuity User ID</label>
              <input
                type="text"
                value={settings.acuityUserId || ''}
                onChange={(e) => setSettings({ ...settings, acuityUserId: e.target.value })}
                placeholder="your-user-id"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">Your Acuity Scheduling user ID</p>
            </div>
          )}

          {settings.platform === 'custom' && (
            <div>
              <label className={labelClass}>Custom Booking Link</label>
              <input
                type="url"
                value={settings.customLink || ''}
                onChange={(e) => setSettings({ ...settings, customLink: e.target.value })}
                placeholder="https://example.com/book-appointment"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">Any http(s) booking page URL</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Button Customization</h2>

          <div>
            <label className={labelClass}>Button Text</label>
            <input
              type="text"
              value={settings.buttonText}
              onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
              placeholder="Book Now"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Button Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.buttonColor || '#2563eb'}
                onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                className="w-11 h-11 p-1 border border-slate-200 rounded-sm cursor-pointer bg-white"
              />
              <input
                type="text"
                value={settings.buttonColor || ''}
                onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                placeholder="#2563eb"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-[15px] font-semibold text-slate-900 mb-4">Preview</h2>
          <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-600">
              <p>
                Platform:{' '}
                <span className="font-semibold text-slate-900 capitalize">{settings.platform}</span>
              </p>
              <p>
                Status:{' '}
                <span
                  className={
                    settings.isEnabled ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'
                  }
                >
                  {settings.isEnabled ? 'Active' : 'Disabled'}
                </span>
              </p>
            </div>
            {previewUrl && (
              <p className="text-[12px] text-slate-500 break-all">
                Booking URL: <span className="text-slate-700">{previewUrl}</span>
              </p>
            )}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-slate-500 text-[13px]">
                <CalendarClock className="w-4 h-4 shrink-0" />
                <span>Live booking button</span>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-white text-[13px] font-semibold rounded-sm transition-opacity"
                style={{
                  backgroundColor: settings.buttonColor || '#2563eb',
                  opacity: settings.isEnabled ? 1 : 0.5,
                  cursor: settings.isEnabled ? 'pointer' : 'not-allowed',
                }}
                disabled={!settings.isEnabled || !previewUrl}
                onClick={() => {
                  if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                {settings.buttonText || 'Book Now'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#38BDF8] hover:bg-[#20B0F0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-sm transition-colors cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

function getSchedulingUrl(settings: SchedulingFormState): string | null {
  if (!settings.isEnabled) return null;

  switch (settings.platform) {
    case 'calendly':
      return settings.calendlyUrl?.trim() || null;
    case 'calcom':
      return settings.calComUsername
        ? `https://cal.com/${settings.calComUsername.trim()}`
        : null;
    case 'savvycal':
      return settings.savvyCalUsername
        ? `https://savvycal.com/${settings.savvyCalUsername.trim()}`
        : null;
    case 'acuity':
      return settings.acuityUserId
        ? `https://acuityscheduling.com/schedule.php?owner=${settings.acuityUserId.trim()}`
        : null;
    case 'custom':
      return settings.customLink?.trim() || null;
    default:
      return null;
  }
}

function validateSchedulingInput(settings: SchedulingFormState, bookingUrl: string): string | null {
  if (!bookingUrl) {
    switch (settings.platform) {
      case 'calendly':
        return 'Please enter your Calendly URL.';
      case 'calcom':
        return 'Please enter your Cal.com username.';
      case 'savvycal':
        return 'Please enter your SavvyCal username.';
      case 'acuity':
        return 'Please enter your Acuity user ID.';
      case 'custom':
        return 'Please enter a custom booking link.';
      default:
        return 'Please complete the booking configuration.';
    }
  }

  if (settings.platform === 'calendly' || settings.platform === 'custom') {
    try {
      const parsed = new URL(bookingUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
    } catch {
      return 'Please enter a valid URL.';
    }
  }

  return null;
}
