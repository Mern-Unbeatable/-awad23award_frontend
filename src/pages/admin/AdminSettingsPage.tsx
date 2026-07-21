import { type FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi, publicApi } from '../../lib/api';
import { ImagePicker } from '../../components/admin/ImagePicker';
import type { SiteSettings } from '../../types';
import { fallbackSettings } from '../../data/fallback';

export function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<SiteSettings>>(fallbackSettings);
  const [msg, setMsg] = useState('');
  const [calendlyConnected, setCalendlyConnected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    publicApi.getSettings().then((s) => setForm(s));
    adminApi
      .getCalendlyStatus()
      .then((r) => setCalendlyConnected(r.data.connected))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const status = searchParams.get('calendly');
    if (!status) return;
    if (status === 'connected') {
      setMsg('Calendly connected. Your scheduling link was updated.');
      publicApi.getSettings().then((s) => setForm(s));
      setCalendlyConnected(true);
    } else if (status === 'error') {
      setMsg('Calendly connection failed. Check redirect URI in Calendly app settings.');
    } else if (status === 'expired') {
      setMsg('Calendly session expired. Please try connecting again.');
    }
    searchParams.delete('calendly');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  async function connectCalendly() {
    try {
      const { data } = await adminApi.getCalendlyAuthUrl();
      window.location.href = data.url;
    } catch {
      setMsg('Could not start Calendly OAuth. Check server env vars.');
    }
  }

  async function syncCalendly() {
    try {
      const { data } = await adminApi.syncCalendly();
      setForm((f) => ({ ...f, calendlyUrl: data.calendlyUrl, calendlyConnectedAt: data.calendlyConnectedAt }));
      setCalendlyConnected(true);
      setMsg('Calendly link synced.');
    } catch {
      setCalendlyConnected(false);
      setMsg('Calendly session expired. Click Connect Calendly again (redirect URI must match exactly).');
    }
  }

  async function disconnectCalendly() {
    try {
      await adminApi.disconnectCalendly();
      setCalendlyConnected(false);
      setMsg('Calendly disconnected. You can still use a manual URL below.');
    } catch {
      setMsg('Could not disconnect Calendly.');
    }
  }

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await adminApi.updateSettings(form);
      setMsg('Settings saved.');
    } catch {
      setMsg('Failed to save. Check API connection.');
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>
      <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="field">
            <label>Brand name</label>
            <input value={form.brandName || ''} onChange={(e) => set('brandName', e.target.value)} />
          </div>
          <div className="field">
            <label>Contact email</label>
            <input value={form.contactEmail || ''} onChange={(e) => set('contactEmail', e.target.value)} />
          </div>
          <div className="field md:col-span-2 border border-[#333] p-4 space-y-3">
            <label>Calendly integration</label>
            <p className="text-[#888] text-sm">
              Connect once with OAuth. Your real scheduling link auto-fills on Contact and booking buttons.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-accent" onClick={connectCalendly}>
                {calendlyConnected ? 'Reconnect Calendly' : 'Connect Calendly'}
              </button>
              {calendlyConnected && (
                <>
                  <button type="button" className="btn btn-outline" onClick={syncCalendly}>
                    Sync link
                  </button>
                  <button type="button" className="btn btn-outline" onClick={disconnectCalendly}>
                    Disconnect
                  </button>
                </>
              )}
            </div>
            {calendlyConnected && (
              <p className="text-accent text-xs">Connected — scheduling URL is managed by Calendly.</p>
            )}
            <p className="text-[#888] text-xs font-mono break-all">
              In Calendly Developer → Redirect URI, use exactly:{' '}
              <span className="text-accent">http://localhost:5000/api/calendly/callback</span>
              {' '}(local) or your live API URL + /api/calendly/callback
            </p>
          </div>
          <div className="field md:col-span-2">
            <label>Calendly URL (manual override)</label>
            <input
              value={form.calendlyUrl || ''}
              onChange={(e) => set('calendlyUrl', e.target.value)}
              placeholder="https://calendly.com/your-link"
            />
          </div>
          <div className="md:col-span-2">
            <ImagePicker
              label="Logo"
              value={form.logoUrl || null}
              onChange={(url) => set('logoUrl', url)}
            />
          </div>
          <div className="md:col-span-2">
            <ImagePicker
              label="About image"
              value={form.aboutImageUrl || null}
              onChange={(url) => set('aboutImageUrl', url)}
            />
          </div>
          <div className="field">
            <label>Showreel embed URL</label>
            <input value={form.showreelUrl || ''} onChange={(e) => set('showreelUrl', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <ImagePicker
              label="Showreel poster"
              value={form.showreelPoster || null}
              onChange={(url) => set('showreelPoster', url)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 border border-[#333] p-5">
          <div className="space-y-3">
            <p className="text-accent text-xs tracking-widest uppercase">English</p>
            <div className="field">
              <label>Tagline EN</label>
              <input value={form.taglineEn || ''} onChange={(e) => set('taglineEn', e.target.value)} />
            </div>
            <div className="field">
              <label>SEO title EN</label>
              <input value={form.seoTitleEn || ''} onChange={(e) => set('seoTitleEn', e.target.value)} />
            </div>
            <div className="field">
              <label>SEO description EN</label>
              <textarea
                rows={3}
                value={form.seoDescriptionEn || ''}
                onChange={(e) => set('seoDescriptionEn', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3" dir="rtl">
            <p className="text-accent text-xs tracking-widest uppercase">العربية</p>
            <div className="field">
              <label>الشعار</label>
              <input value={form.taglineAr || ''} onChange={(e) => set('taglineAr', e.target.value)} />
            </div>
            <div className="field">
              <label>عنوان SEO</label>
              <input value={form.seoTitleAr || ''} onChange={(e) => set('seoTitleAr', e.target.value)} />
            </div>
            <div className="field">
              <label>وصف SEO</label>
              <textarea
                rows={3}
                value={form.seoDescriptionAr || ''}
                onChange={(e) => set('seoDescriptionAr', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="field">
            <label>Instagram</label>
            <input
              value={form.socialInstagram || ''}
              onChange={(e) => set('socialInstagram', e.target.value)}
            />
          </div>
          <div className="field">
            <label>LinkedIn</label>
            <input
              value={form.socialLinkedin || ''}
              onChange={(e) => set('socialLinkedin', e.target.value)}
            />
          </div>
          <div className="field">
            <label>YouTube</label>
            <input
              value={form.socialYoutube || ''}
              onChange={(e) => set('socialYoutube', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Twitter / X</label>
            <input
              value={form.socialTwitter || ''}
              onChange={(e) => set('socialTwitter', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-accent">
          Save settings
        </button>
        {msg && <p className="text-sm text-accent">{msg}</p>}
      </form>
    </div>
  );
}
