import { type FormEvent, useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { confirmDelete } from '../../lib/swal';
import { ImagePicker } from '../../components/admin/ImagePicker';
import type { Service } from '../../types';

const empty: Partial<Service> = {
  slug: '',
  titleEn: '',
  titleAr: '',
  subtitleEn: '1-ON-1 MENTORING',
  subtitleAr: 'إرشاد فردي',
  excerptEn: '',
  excerptAr: '',
  bodyEn: '',
  bodyAr: '',
  featuresEn: [],
  featuresAr: [],
  imageUrl: '',
  order: 0,
  published: true,
};

export function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data } = await adminApi.getServices();
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setMsg('API offline — services unavailable.'));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        featuresEn:
          typeof form.featuresEn === 'string'
            ? String(form.featuresEn).split('\n').filter(Boolean)
            : form.featuresEn || [],
        featuresAr:
          typeof form.featuresAr === 'string'
            ? String(form.featuresAr).split('\n').filter(Boolean)
            : form.featuresAr || [],
      };
      if (editingId) await adminApi.updateService(editingId, payload);
      else await adminApi.createService(payload);
      setForm(empty);
      setEditingId(null);
      setMsg('Saved.');
      await load();
    } catch {
      setMsg('Save failed.');
    }
  }

  function edit(s: Service) {
    setEditingId(s.id);
    setForm({
      ...s,
      featuresEn: s.featuresEn as unknown as string[],
      featuresAr: s.featuresAr as unknown as string[],
    });
  }

  async function remove(id: string) {
    const confirmed = await confirmDelete('Delete Service?', 'Are you sure you want to delete this service?');
    if (!confirmed) return;
    await adminApi.deleteService(id);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Services</h1>
      {msg && <p className="text-accent text-sm mb-4">{msg}</p>}

      <div className="grid xl:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="border border-[#333] p-4 flex justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{s.titleEn}</p>
                <p className="text-[#777] text-xs">/{s.slug}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-accent text-sm" onClick={() => edit(s)}>
                  Edit
                </button>
                <button type="button" className="text-red-300 text-sm" onClick={() => remove(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border border-[#333] p-5 space-y-4">
          <p className="font-display font-semibold">{editingId ? 'Edit service' : 'New service'}</p>
          <div className="field">
            <label>Slug</label>
            <input
              required
              value={form.slug || ''}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs text-accent uppercase tracking-widest">English</p>
              <div className="field">
                <label>Title</label>
                <input
                  required
                  value={form.titleEn || ''}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Subtitle</label>
                <input
                  value={form.subtitleEn || ''}
                  onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Excerpt</label>
                <textarea
                  rows={3}
                  value={form.excerptEn || ''}
                  onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Body</label>
                <textarea
                  rows={4}
                  value={form.bodyEn || ''}
                  onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Features (one per line)</label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(form.featuresEn)
                      ? form.featuresEn.join('\n')
                      : (form.featuresEn as unknown as string) || ''
                  }
                  onChange={(e) =>
                    setForm({ ...form, featuresEn: e.target.value.split('\n') as unknown as string[] })
                  }
                />
              </div>
            </div>
            <div className="space-y-3" dir="rtl">
              <p className="text-xs text-accent uppercase tracking-widest">العربية</p>
              <div className="field">
                <label>العنوان</label>
                <input
                  required
                  value={form.titleAr || ''}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>عنوان فرعي</label>
                <input
                  value={form.subtitleAr || ''}
                  onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>مقتطف</label>
                <textarea
                  rows={3}
                  value={form.excerptAr || ''}
                  onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>النص</label>
                <textarea
                  rows={4}
                  value={form.bodyAr || ''}
                  onChange={(e) => setForm({ ...form, bodyAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>الميزات (سطر لكل ميزة)</label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(form.featuresAr)
                      ? form.featuresAr.join('\n')
                      : (form.featuresAr as unknown as string) || ''
                  }
                  onChange={(e) =>
                    setForm({ ...form, featuresAr: e.target.value.split('\n') as unknown as string[] })
                  }
                />
              </div>
            </div>
          </div>
          <ImagePicker
            label="Service image"
            value={form.imageUrl || null}
            onChange={(url) => setForm({ ...form, imageUrl: url || '' })}
          />
          <div className="flex gap-3">
            <button type="submit" className="btn btn-accent">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
