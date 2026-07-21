import { type FormEvent, useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { ImagePicker } from '../../components/admin/ImagePicker';
import type { GalleryItem } from '../../types';

export function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await adminApi.getGallery();
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setMsg('API offline.'));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      setMsg('Add an image first (upload, URL, or gallery).');
      return;
    }
    setBusy(true);
    try {
      const { data: media } = await adminApi.addMediaUrl(imageUrl, 'image');
      await adminApi.createGalleryItem({
        mediaId: media.id,
        titleEn,
        titleAr,
      });
      setImageUrl(null);
      setTitleEn('');
      setTitleAr('');
      setMsg('Added to gallery.');
      await load();
    } catch {
      setMsg('Could not add item. Check API / Cloudinary.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Remove gallery item?')) return;
    await adminApi.deleteGalleryItem(id);
    await load();
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <p className="text-xs tracking-[0.18em] uppercase text-[#8b95a8] mb-2">Media</p>
        <h1 className="font-display text-3xl font-bold">Gallery</h1>
      </div>
      {msg && <p className="text-accent text-sm">{msg}</p>}

      <form onSubmit={onSubmit} className="admin-card p-5 md:p-6 space-y-5">
        <ImagePicker label="Add photo or video cover" value={imageUrl} onChange={setImageUrl} />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="field">
            <label>Title EN</label>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
          <div className="field" dir="rtl">
            <label>العنوان</label>
            <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-accent" disabled={busy}>
          {busy ? 'Saving…' : 'Add to gallery'}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="admin-card overflow-hidden">
            <img src={item.media.url} alt={item.titleEn} className="aspect-video object-cover w-full" />
            <div className="p-3 flex justify-between gap-2 items-center">
              <p className="text-sm truncate">{item.titleEn || 'Untitled'}</p>
              <button
                type="button"
                className="text-red-300 text-xs cursor-pointer"
                onClick={() => remove(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
