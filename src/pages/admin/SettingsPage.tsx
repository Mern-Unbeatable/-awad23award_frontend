import { useEffect } from 'react';
import { CalendarClock, Loader2, RefreshCw, Save } from 'lucide-react';
import { useSite } from '../../hooks/SiteContext';
import type { SchedulingPlatform } from '../../types';
import { useSchedulingAdmin } from '../../features/admin/settings/settingsHooks';

const inputClass =
  'w-full px-3 py-2.5 border border-slate-200 rounded-sm text-[14px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 focus:border-[#38BDF8] transition-colors';
const labelClass = 'block text-[13px] font-semibold text-slate-700 mb-1.5';

export const SettingsPage = () => {
  const { applyScheduling } = useSite();
  const {
    form,
    previewUrl,
    isLoading,
    isSaving,
    error,
    saveError,
    saveSuccessMessage,
    loadSettings,
    saveSettings,
    updateForm,
    changePlatform,
    clearMessages,
  } = useSchedulingAdmin();

  useEffect(() => {
    loadSettings().catch(() => undefined);
  }, [loadSettings]);

  const handleSave = async () => {
    clearMessages();
    try {
      const result = await saveSettings();
      applyScheduling(result.settings);
    } catch {
      // saveError is set in the slice
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="p-4 rounded-sm text-[14px] border bg-red-50 text-red-800 border-red-200">
          {error}
        </div>
        <button
          type="button"
          onClick={() => void loadSettings()}
          className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-slate-700 border border-slate-200 rounded-sm hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const message =
    saveSuccessMessage
      ? { type: 'success' as const, text: saveSuccessMessage }
      : saveError
        ? { type: 'error' as const, text: saveError }
        : null;

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
            onClick={() => updateForm({ isEnabled: !form.isEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              form.isEnabled ? 'bg-[#38BDF8]' : 'bg-slate-300'
            }`}
            aria-pressed={form.isEnabled}
            aria-label="Toggle scheduling"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className={labelClass}>Booking Platform</label>
          <select
            value={form.platform}
            onChange={(e) => changePlatform(e.target.value as SchedulingPlatform)}
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
          {form.platform === 'calendly' && (
            <div>
              <label className={labelClass}>Calendly URL</label>
              <input
                type="url"
                value={form.calendlyUrl || ''}
                onChange={(e) => updateForm({ calendlyUrl: e.target.value })}
                placeholder="https://calendly.com/your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">Your Calendly booking page URL</p>
            </div>
          )}

          {form.platform === 'calcom' && (
            <div>
              <label className={labelClass}>Cal.com Username</label>
              <input
                type="text"
                value={form.calComUsername || ''}
                onChange={(e) => updateForm({ calComUsername: e.target.value })}
                placeholder="your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">
                e.g. &quot;john&quot; for cal.com/john
              </p>
            </div>
          )}

          {form.platform === 'savvycal' && (
            <div>
              <label className={labelClass}>SavvyCal Username</label>
              <input
                type="text"
                value={form.savvyCalUsername || ''}
                onChange={(e) => updateForm({ savvyCalUsername: e.target.value })}
                placeholder="your-username"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">
                e.g. &quot;john&quot; for savvycal.com/john
              </p>
            </div>
          )}

          {form.platform === 'acuity' && (
            <div>
              <label className={labelClass}>Acuity User ID</label>
              <input
                type="text"
                value={form.acuityUserId || ''}
                onChange={(e) => updateForm({ acuityUserId: e.target.value })}
                placeholder="your-user-id"
                className={inputClass}
              />
              <p className="mt-1.5 text-[12px] text-slate-500">Your Acuity Scheduling user ID</p>
            </div>
          )}

          {form.platform === 'custom' && (
            <div>
              <label className={labelClass}>Custom Booking Link</label>
              <input
                type="url"
                value={form.customLink || ''}
                onChange={(e) => updateForm({ customLink: e.target.value })}
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
              value={form.buttonText}
              onChange={(e) => updateForm({ buttonText: e.target.value })}
              placeholder="Book Now"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Button Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.buttonColor || '#2563eb'}
                onChange={(e) => updateForm({ buttonColor: e.target.value })}
                className="w-11 h-11 p-1 border border-slate-200 rounded-sm cursor-pointer bg-white"
              />
              <input
                type="text"
                value={form.buttonColor || ''}
                onChange={(e) => updateForm({ buttonColor: e.target.value })}
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
                <span className="font-semibold text-slate-900 capitalize">{form.platform}</span>
              </p>
              <p>
                Status:{' '}
                <span
                  className={
                    form.isEnabled ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'
                  }
                >
                  {form.isEnabled ? 'Active' : 'Disabled'}
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
                  backgroundColor: form.buttonColor || '#2563eb',
                  opacity: form.isEnabled ? 1 : 0.5,
                  cursor: form.isEnabled ? 'pointer' : 'not-allowed',
                }}
                disabled={!form.isEnabled || !previewUrl}
                onClick={() => {
                  if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                {form.buttonText || 'Book Now'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#38BDF8] hover:bg-[#20B0F0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-sm transition-colors cursor-pointer"
        >
          {isSaving ? (
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
