import { type FormEvent, useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { ImagePicker } from '../../components/admin/ImagePicker';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import type { Post } from '../../types';

const empty: Partial<Post> = {
  slug: '',
  titleEn: '',
  titleAr: '',
  excerptEn: '',
  excerptAr: '',
  bodyEn: '',
  bodyAr: '',
  coverImage: '',
  categoryEn: 'Business',
  categoryAr: 'أعمال',
  seoTitleEn: '',
  seoTitleAr: '',
  seoDescriptionEn: '',
  seoDescriptionAr: '',
  status: 'draft',
};

export function AdminPostsPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [form, setForm] = useState<Partial<Post>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data } = await adminApi.getPosts();
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setMsg('API offline.'));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingId) await adminApi.updatePost(editingId, form);
      else await adminApi.createPost(form);
      setForm(empty);
      setEditingId(null);
      setMsg('Saved.');
      await load();
    } catch {
      setMsg('Save failed.');
    }
  }

  function edit(p: Post) {
    setEditingId(p.id);
    setForm(p);
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    await adminApi.deletePost(id);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Journal / Blog</h1>
      {msg && <p className="text-accent text-sm mb-4">{msg}</p>}
      <div className="grid xl:grid-cols-[1fr_1.3fr] gap-8">
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="border border-[#333] p-4 flex justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{p.titleEn}</p>
                <p className="text-[#777] text-xs">
                  {p.status} · /{p.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-accent text-sm" onClick={() => edit(p)}>
                  Edit
                </button>
                <button type="button" className="text-red-300 text-sm" onClick={() => remove(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border border-[#333] p-5 space-y-4">
          <p className="font-display font-semibold">{editingId ? 'Edit post' : 'New post'}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="field">
              <label>Slug</label>
              <input
                required
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Status</label>
              <select
                value={form.status || 'draft'}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <ImagePicker
            label="Cover image"
            value={form.coverImage || null}
            onChange={(url) => setForm({ ...form, coverImage: url || '' })}
          />
          <div className="grid md:grid-cols-2 gap-5">
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
                <label>Category</label>
                <input
                  value={form.categoryEn || ''}
                  onChange={(e) => setForm({ ...form, categoryEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerptEn || ''}
                  onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                />
              </div>
              <RichTextEditor
                label="Body"
                value={form.bodyEn || ''}
                onChange={(html) => setForm({ ...form, bodyEn: html })}
                placeholder="Write the article… use P, headings, lists, and links"
              />
              <div className="field">
                <label>SEO title</label>
                <input
                  value={form.seoTitleEn || ''}
                  onChange={(e) => setForm({ ...form, seoTitleEn: e.target.value })}
                />
              </div>
              <div className="field">
                <label>SEO description</label>
                <textarea
                  rows={2}
                  value={form.seoDescriptionEn || ''}
                  onChange={(e) => setForm({ ...form, seoDescriptionEn: e.target.value })}
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
                <label>التصنيف</label>
                <input
                  value={form.categoryAr || ''}
                  onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>مقتطف</label>
                <textarea
                  rows={2}
                  value={form.excerptAr || ''}
                  onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
                />
              </div>
              <RichTextEditor
                label="المحتوى"
                value={form.bodyAr || ''}
                onChange={(html) => setForm({ ...form, bodyAr: html })}
                placeholder="اكتب المقال… فقرات، عناوين، قوائم وروابط"
                dir="rtl"
              />
              <div className="field">
                <label>عنوان SEO</label>
                <input
                  value={form.seoTitleAr || ''}
                  onChange={(e) => setForm({ ...form, seoTitleAr: e.target.value })}
                />
              </div>
              <div className="field">
                <label>وصف SEO</label>
                <textarea
                  rows={2}
                  value={form.seoDescriptionAr || ''}
                  onChange={(e) => setForm({ ...form, seoDescriptionAr: e.target.value })}
                />
              </div>
            </div>
          </div>
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
