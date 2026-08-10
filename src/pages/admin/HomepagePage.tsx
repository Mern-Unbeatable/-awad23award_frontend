import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { ImagePicker } from '../../components/admin/ImagePicker';
import type { HomeSection } from '../../types';

export function HomepagePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .getSections()
      .then((r) => setSections(r.data))
      .catch(() => setMsg('Could not load sections from API.'));
  }, []);

  function update(id: string, patch: Partial<HomeSection>) {
    setSections((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save(section: HomeSection) {
    try {
      await adminApi.updateSection(section.key, section);
      setMsg(`Saved “${section.key}”.`);
    } catch {
      setMsg('Save failed.');
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Homepage content</h1>
      <p className="text-[#888] mb-8">Edit English and Arabic side by side for each section.</p>
      {msg && <p className="text-accent text-sm mb-4">{msg}</p>}
      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.id} className="border border-[#333] bg-[#161618] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-accent uppercase tracking-widest text-xs">
                {s.key}
              </p>
              <button type="button" className="btn btn-accent !py-2 !px-3 !text-[0.65rem]" onClick={() => save(s)}>
                Save
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <p className="text-xs text-[#777] uppercase tracking-widest">English</p>
                <div className="field">
                  <label>Subtitle</label>
                  <input value={s.subtitleEn} onChange={(e) => update(s.id, { subtitleEn: e.target.value })} />
                </div>
                <div className="field">
                  <label>Title</label>
                  <textarea rows={2} value={s.titleEn} onChange={(e) => update(s.id, { titleEn: e.target.value })} />
                </div>
                <div className="field">
                  <label>Body</label>
                  <textarea rows={4} value={s.bodyEn} onChange={(e) => update(s.id, { bodyEn: e.target.value })} />
                </div>
                <div className="field">
                  <label>CTA label</label>
                  <input value={s.ctaLabelEn} onChange={(e) => update(s.id, { ctaLabelEn: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3" dir="rtl">
                <p className="text-xs text-[#777] uppercase tracking-widest">العربية</p>
                <div className="field">
                  <label>العنوان الفرعي</label>
                  <input value={s.subtitleAr} onChange={(e) => update(s.id, { subtitleAr: e.target.value })} />
                </div>
                <div className="field">
                  <label>العنوان</label>
                  <textarea rows={2} value={s.titleAr} onChange={(e) => update(s.id, { titleAr: e.target.value })} />
                </div>
                <div className="field">
                  <label>النص</label>
                  <textarea rows={4} value={s.bodyAr} onChange={(e) => update(s.id, { bodyAr: e.target.value })} />
                </div>
                <div className="field">
                  <label>نص الزر</label>
                  <input value={s.ctaLabelAr} onChange={(e) => update(s.id, { ctaLabelAr: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="field">
                <label>CTA link</label>
                <input value={s.ctaLink} onChange={(e) => update(s.id, { ctaLink: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <ImagePicker
                label="Section image"
                value={s.imageUrl || null}
                onChange={(url) => update(s.id, { imageUrl: url })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
