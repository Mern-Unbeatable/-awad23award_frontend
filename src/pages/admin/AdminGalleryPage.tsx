import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';
import { Plus, ChevronRight, Upload, X, ImageIcon } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { AdminContentCard } from '../../components/admin/AdminContentCard';
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar';
import { usePagination } from '../../hooks/usePagination';
import {
  ADMIN_ROUTES,
  ADMIN_PORTFOLIO_NEW,
  adminPortfolioEditPath,
} from './adminRoutes';
import type {
  GalleryItem,
  ChallengeItem,
  ApproachCard,
  LeadershipCard,
  SolutionCard,
  OutcomeItem,
  SkillCard,
} from '../../types';



function ImageUpload({
  label,
  value,
  onChange,
  height = 'h-36',
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  height?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(value); }, [value]);

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, GIF).');
      return;
    }
    setError('');
    // Show local preview immediately — no waiting for upload
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const { data } = await adminApi.uploadMedia(file);
      const uploaded: string = data?.url ?? localUrl;
      setPreview(uploaded);
      onChange(uploaded);
    } catch {
      setError('Upload failed. Please try again.');
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
          e.target.value = '';
        }}
      />

      {preview ? (
        /* ── Preview state ── */
        <div className={`relative group rounded-xl overflow-hidden border border-slate-200 ${height} w-full bg-slate-100`}>
          <img src={preview} alt="" className="w-full h-full object-cover" />

          {uploading && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2">
              <div className="w-9 h-9 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-[12px] font-semibold">Uploading…</span>
            </div>
          )}

          {!uploading && (
            <>
              {/* Hover overlay — click anywhere to change */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-white text-slate-800 text-[12.5px] font-semibold px-4 py-2 rounded-lg shadow-md pointer-events-none">
                  <Upload className="w-3.5 h-3.5" />
                  Change Image
                </span>
              </div>
              {/* Remove button — top-right */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(''); onChange(''); }}
                className="absolute top-2.5 right-2.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ) : (
        /* ── Empty / dropzone state ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) processFile(f);
          }}
          className={`w-full ${height} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 select-none ${
            uploading
              ? 'border-[#38BDF8] bg-sky-50/60 cursor-wait'
              : dragging
              ? 'border-[#38BDF8] bg-sky-50 scale-[1.005]'
              : 'border-slate-200 bg-slate-50 hover:border-[#38BDF8] hover:bg-sky-50/30 cursor-pointer'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-[3px] border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
              <p className="text-[12px] text-[#38BDF8] font-semibold">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 px-4 text-center pointer-events-none">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-sky-100' : 'bg-slate-100'}`}>
                {dragging
                  ? <ImageIcon className="w-6 h-6 text-[#38BDF8]" />
                  : <Upload className="w-5 h-5 text-slate-400" />
                }
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">
                  {dragging ? 'Drop to upload' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP, GIF · max 10 MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}



function MultiImageUpload({
  label,
  values,
  onChange,
  max = 8,
}: {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [draggingAdd, setDraggingAdd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList) {
    const remaining = max - values.length;
    if (remaining <= 0) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, remaining);
    if (!fileArray.length) return;

    setError('');
    setUploading(true);

    // Show local previews immediately while uploading in parallel
    const localUrls = fileArray.map((f) => URL.createObjectURL(f));
    onChange([...values, ...localUrls]);

    const results = await Promise.allSettled(
      fileArray.map((file) => adminApi.uploadMedia(file))
    );

    const serverUrls = results.map((r, idx) =>
      r.status === 'fulfilled' ? (r.value.data?.url ?? localUrls[idx]) : localUrls[idx]
    );

    const hadError = results.some((r) => r.status === 'rejected');
    if (hadError) setError('Some images could not be uploaded.');

    // Replace local blob URLs with server URLs
    onChange([...values, ...serverUrls]);
    setUploading(false);
  }

  function removeImage(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const canAdd = values.length < max;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
          <span className="ml-2 text-slate-400 font-normal normal-case">({values.length}/{max})</span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) processFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {values.map((url, idx) => (
          <div key={idx} className="relative group h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 pointer-events-none rounded-xl" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm"
              title="Remove"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {canAdd && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !uploading && inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDraggingAdd(true); }}
            onDragLeave={() => setDraggingAdd(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingAdd(false);
              if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
            }}
            className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none ${
              uploading
                ? 'border-[#38BDF8] bg-sky-50 cursor-wait'
                : draggingAdd
                ? 'border-[#38BDF8] bg-sky-50'
                : 'border-slate-200 bg-slate-50 hover:border-[#38BDF8] hover:bg-sky-50/30 cursor-pointer'
            }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className={`w-4 h-4 ${draggingAdd ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                <span className="text-[9px] font-semibold text-slate-400">
                  {draggingAdd ? 'Drop' : 'Add'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-[11.5px] text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
}



interface PortfolioForm {
  titleEn: string; titleAr: string;
  slug: string; tag: string; published: boolean;
  excerptEn: string; excerptAr: string;
  heroImageUrl: string; client: string; role: string; duration: string;
  screenshots: string[];
  challengeHeadingEn: string; challengeHeadingAr: string;
  challengeBodyEn: string; challengeBodyAr: string;
  challengeItems: ChallengeItem[];
  challengeImageUrl: string; challengeCaption: string; challengeBadgeLabel: string;
  approachBodyEn: string; approachBodyAr: string;
  approachCards: ApproachCard[];
  approachInsight: string;
  leadershipBodyEn: string; leadershipBodyAr: string;
  leadershipCards: LeadershipCard[];
  leadershipBannerStat: string;
  solutionBodyEn: string; solutionBodyAr: string;
  solutionCards: SolutionCard[];
  solutionArchImageUrl: string; solutionArchTitle: string; solutionArchBody: string;
  outcomeItems: OutcomeItem[];
  recognitionImageUrl: string; recognitionLabel: string;
  skillCards: SkillCard[];
}

const EMPTY_FORM: PortfolioForm = {
  titleEn: '', titleAr: '', slug: '', tag: 'Case Study', published: false,
  excerptEn: '', excerptAr: '',
  heroImageUrl: '', client: '', role: '', duration: '',
  screenshots: [],
  challengeHeadingEn: 'The Challenge', challengeHeadingAr: '',
  challengeBodyEn: '', challengeBodyAr: '',
  challengeItems: [{ iconName: 'AlertTriangle', title: '', body: '' }],
  challengeImageUrl: '', challengeCaption: '', challengeBadgeLabel: 'CRITICAL',
  approachBodyEn: '', approachBodyAr: '',
  approachCards: [{ title: '', bullets: [''] }],
  approachInsight: '',
  leadershipBodyEn: '', leadershipBodyAr: '',
  leadershipCards: [{ iconName: 'Users', title: '', body: '' }],
  leadershipBannerStat: '',
  solutionBodyEn: '', solutionBodyAr: '',
  solutionCards: [{ color: 'green', tag: '', title: '', body: '' }],
  solutionArchImageUrl: '', solutionArchTitle: '', solutionArchBody: '',
  outcomeItems: [{ color: 'emerald', text: '' }],
  recognitionImageUrl: '', recognitionLabel: '',
  skillCards: [{ num: '1', category: '', title: '', body: '' }],
};

function formFromItem(item: GalleryItem): PortfolioForm {
  return {
    titleEn: item.titleEn, titleAr: item.titleAr,
    slug: item.slug, tag: item.tag || 'Case Study', published: item.published,
    excerptEn: item.excerptEn, excerptAr: item.excerptAr,
    heroImageUrl: item.heroImageUrl || '', client: item.client || '',
    role: item.role || '', duration: item.duration || '',
    screenshots: item.screenshots || [],
    challengeHeadingEn: item.challengeHeadingEn || 'The Challenge',
    challengeHeadingAr: item.challengeHeadingAr || '',
    challengeBodyEn: item.challengeBodyEn || '', challengeBodyAr: item.challengeBodyAr || '',
    challengeItems: item.challengeItems?.length ? item.challengeItems : EMPTY_FORM.challengeItems,
    challengeImageUrl: item.challengeImageUrl || '',
    challengeCaption: item.challengeCaption || '',
    challengeBadgeLabel: item.challengeBadgeLabel || 'CRITICAL',
    approachBodyEn: item.approachBodyEn || '', approachBodyAr: item.approachBodyAr || '',
    approachCards: item.approachCards?.length ? item.approachCards : EMPTY_FORM.approachCards,
    approachInsight: item.approachInsight || '',
    leadershipBodyEn: item.leadershipBodyEn || '', leadershipBodyAr: item.leadershipBodyAr || '',
    leadershipCards: item.leadershipCards?.length ? item.leadershipCards : EMPTY_FORM.leadershipCards,
    leadershipBannerStat: item.leadershipBannerStat || '',
    solutionBodyEn: item.solutionBodyEn || '', solutionBodyAr: item.solutionBodyAr || '',
    solutionCards: item.solutionCards?.length ? item.solutionCards : EMPTY_FORM.solutionCards,
    solutionArchImageUrl: item.solutionArchImageUrl || '',
    solutionArchTitle: item.solutionArchTitle || '',
    solutionArchBody: item.solutionArchBody || '',
    outcomeItems: item.outcomeItems?.length ? item.outcomeItems : EMPTY_FORM.outcomeItems,
    recognitionImageUrl: item.recognitionImageUrl || '',
    recognitionLabel: item.recognitionLabel || '',
    skillCards: item.skillCards?.length ? item.skillCards : EMPTY_FORM.skillCards,
  };
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-all';
const textareaCls = `${inputCls} resize-none`;



const TABS = ['Overview', 'Challenge', 'Approach', 'Leadership', 'Solution', 'Outcome', 'Skills'];

const PORTFOLIO_PAGE_SIZE = 4;



export function AdminGalleryPage() {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const isNewPage = Boolean(useMatch({ path: '/admin/portfolio/new', end: true }));
  const isEditPage = Boolean(useMatch({ path: '/admin/portfolio/:itemId/edit', end: true }));
  const isFormMode = isNewPage || isEditPage;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<PortfolioForm>(EMPTY_FORM);
  const [error, setError] = useState('');

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } = usePagination(
    items,
    PORTFOLIO_PAGE_SIZE,
  );

  useEffect(() => {
    adminApi.getGallery()
      .then((res) => setItems(res.data as GalleryItem[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isNewPage) {
      setForm(EMPTY_FORM);
      setEditingId(null);
      setActiveTab(0);
      setError('');
      return;
    }
    if (isEditPage && itemId && !loading) {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        setForm(formFromItem(item));
        setEditingId(item.id);
        setActiveTab(0);
        setError('');
      } else {
        navigate(ADMIN_ROUTES.portfolio, { replace: true });
      }
    }
  }, [isNewPage, isEditPage, itemId, items, loading, navigate]);

  function closeForm() {
    navigate(ADMIN_ROUTES.portfolio);
  }

  function setField<K extends keyof PortfolioForm>(key: K, value: PortfolioForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openCreate() {
    navigate(ADMIN_PORTFOLIO_NEW);
  }

  function openEdit(item: GalleryItem) {
    navigate(adminPortfolioEditPath(item.id));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this portfolio item?')) return;
    await adminApi.deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleSave() {
    if (!form.titleEn.trim() || !form.slug.trim()) {
      setError('Title (EN) and Slug are required.');
      setActiveTab(0);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = form as Partial<GalleryItem>;
      if (editingId) {
        await adminApi.updatePortfolioItem(editingId, payload);
        setItems((prev) => prev.map((i) => i.id === editingId ? { ...i, ...form } : i));
      } else {
        const res = await adminApi.createPortfolioItem(payload);
        setItems((prev) => [res.data as GalleryItem, ...prev]);
      }
      navigate(ADMIN_ROUTES.portfolio);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }



  function addItem<T>(key: keyof PortfolioForm, blank: T) {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] as T[]), blank] }));
  }

  function removeItem(key: keyof PortfolioForm, idx: number) {
    setForm((prev) => ({ ...prev, [key]: (prev[key] as unknown[]).filter((_, i) => i !== idx) }));
  }

  function updateItem<T>(key: keyof PortfolioForm, idx: number, patch: Partial<T>) {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as T[]).map((item, i) => i === idx ? { ...item, ...patch } : item),
    }));
  }



  function renderOverview() {
    return (
      <div className="space-y-6">
        {/* Titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title (EN)">
            <input className={inputCls} value={form.titleEn} onChange={(e) => setField('titleEn', e.target.value)} placeholder="AD Squared" />
          </Field>
          <Field label="Title (AR)">
            <input className={inputCls} dir="rtl" value={form.titleAr} onChange={(e) => setField('titleAr', e.target.value)} placeholder="اد سكوار" />
          </Field>
        </div>

        {/* Slug & Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug (URL path)">
            <input className={inputCls} value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="ad-squared" />
          </Field>
          <Field label="Tag Label">
            <input className={inputCls} value={form.tag} onChange={(e) => setField('tag', e.target.value)} placeholder="Case Study / Startup / Project" />
          </Field>
        </div>

        {/* Excerpts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Excerpt (EN)">
            <textarea className={textareaCls} rows={3} value={form.excerptEn} onChange={(e) => setField('excerptEn', e.target.value)} placeholder="Short description shown in hero…" />
          </Field>
          <Field label="Excerpt (AR)">
            <textarea className={textareaCls} rows={3} dir="rtl" value={form.excerptAr} onChange={(e) => setField('excerptAr', e.target.value)} placeholder="وصف قصير…" />
          </Field>
        </div>

        {/* Hero Image Upload */}
        <ImageUpload
          label="Hero / Cover Image"
          value={form.heroImageUrl}
          onChange={(url) => setField('heroImageUrl', url)}
        />

        {/* Client / Role / Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Client">
            <input className={inputCls} value={form.client} onChange={(e) => setField('client', e.target.value)} placeholder="REDF" />
          </Field>
          <Field label="Role">
            <input className={inputCls} value={form.role} onChange={(e) => setField('role', e.target.value)} placeholder="CRM Consultant" />
          </Field>
          <Field label="Duration">
            <input className={inputCls} value={form.duration} onChange={(e) => setField('duration', e.target.value)} placeholder="6-Month Engagement" />
          </Field>
        </div>

        {/* Screenshots — multi-upload */}
        <MultiImageUpload
          label="Project Screenshots"
          values={form.screenshots}
          onChange={(urls) => setField('screenshots', urls)}
          max={8}
        />

        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={form.published}
            onClick={() => setField('published', !form.published)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
              form.published ? 'bg-[#38BDF8]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                form.published ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-[13px] font-medium text-slate-700">
            {form.published ? 'Published — visible on site' : 'Draft — hidden from site'}
          </span>
        </div>
      </div>
    );
  }

  function renderChallenge() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Heading (EN)">
            <input className={inputCls} value={form.challengeHeadingEn} onChange={(e) => setField('challengeHeadingEn', e.target.value)} placeholder="The Challenge" />
          </Field>
          <Field label="Section Heading (AR)">
            <input className={inputCls} dir="rtl" value={form.challengeHeadingAr} onChange={(e) => setField('challengeHeadingAr', e.target.value)} placeholder="التحدي" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea className={textareaCls} rows={3} value={form.challengeBodyEn} onChange={(e) => setField('challengeBodyEn', e.target.value)} />
          </Field>
          <Field label="Section Body (AR)">
            <textarea className={textareaCls} rows={3} dir="rtl" value={form.challengeBodyAr} onChange={(e) => setField('challengeBodyAr', e.target.value)} />
          </Field>
        </div>

        <Field label="Badge Label">
          <input className={inputCls} value={form.challengeBadgeLabel} onChange={(e) => setField('challengeBadgeLabel', e.target.value)} placeholder="CRITICAL" />
        </Field>

        {/* Challenge items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Challenge Items (max 5)</label>
            {form.challengeItems.length < 5 && (
              <button type="button"
                onClick={() => addItem('challengeItems', { iconName: 'AlertTriangle', title: '', body: '' })}
                className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            )}
          </div>
          <div className="space-y-3">
            {form.challengeItems.map((ci, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                  <button type="button" onClick={() => removeItem('challengeItems', idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
                </div>
                <input className={inputCls} placeholder="Icon name (Users, AlertTriangle, FileText, Code2, BookOpen)" value={ci.iconName}
                  onChange={(e) => updateItem<ChallengeItem>('challengeItems', idx, { iconName: e.target.value })} />
                <input className={inputCls} placeholder="Title" value={ci.title}
                  onChange={(e) => updateItem<ChallengeItem>('challengeItems', idx, { title: e.target.value })} />
                <textarea className={textareaCls} rows={2} placeholder="Body text" value={ci.body}
                  onChange={(e) => updateItem<ChallengeItem>('challengeItems', idx, { body: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        {/* Challenge image upload */}
        <ImageUpload
          label="Right Column Image"
          value={form.challengeImageUrl}
          onChange={(url) => setField('challengeImageUrl', url)}
        />

        <Field label="Right Column Caption">
          <textarea className={textareaCls} rows={2} value={form.challengeCaption} onChange={(e) => setField('challengeCaption', e.target.value)} />
        </Field>
      </div>
    );
  }

  function renderApproach() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Intro (EN)">
            <textarea className={textareaCls} rows={3} value={form.approachBodyEn} onChange={(e) => setField('approachBodyEn', e.target.value)} placeholder="To rebuild the missing knowledge, I:" />
          </Field>
          <Field label="Section Intro (AR)">
            <textarea className={textareaCls} rows={3} dir="rtl" value={form.approachBodyAr} onChange={(e) => setField('approachBodyAr', e.target.value)} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Approach Cards (max 4)</label>
            {form.approachCards.length < 4 && (
              <button type="button" onClick={() => addItem('approachCards', { title: '', bullets: [''] })}
                className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <div className="space-y-4">
            {form.approachCards.map((card, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                  <button type="button" onClick={() => removeItem('approachCards', idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
                </div>
                <input className={inputCls} placeholder="Card Title (e.g. Technical Archaeology)" value={card.title}
                  onChange={(e) => updateItem<ApproachCard>('approachCards', idx, { title: e.target.value })} />
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">Bullet Points (one per line)</label>
                  <textarea className={textareaCls} rows={4}
                    value={card.bullets.join('\n')}
                    onChange={(e) => updateItem<ApproachCard>('approachCards', idx, { bullets: e.target.value.split('\n') })}
                    placeholder="Each line becomes a bullet point" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Field label="Key Architectural Insight">
          <textarea className={textareaCls} rows={3} value={form.approachInsight} onChange={(e) => setField('approachInsight', e.target.value)} placeholder="During this phase, I gained…" />
        </Field>
      </div>
    );
  }

  function renderLeadership() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea className={textareaCls} rows={3} value={form.leadershipBodyEn} onChange={(e) => setField('leadershipBodyEn', e.target.value)} />
          </Field>
          <Field label="Section Body (AR)">
            <textarea className={textareaCls} rows={3} dir="rtl" value={form.leadershipBodyAr} onChange={(e) => setField('leadershipBodyAr', e.target.value)} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leadership Cards (max 4)</label>
            {form.leadershipCards.length < 4 && (
              <button type="button" onClick={() => addItem('leadershipCards', { iconName: 'Users', title: '', body: '' })}
                className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <div className="space-y-3">
            {form.leadershipCards.map((card, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                  <button type="button" onClick={() => removeItem('leadershipCards', idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
                </div>
                <input className={inputCls} placeholder="Icon (Users, Cpu, GitBranch, ShieldCheck)" value={card.iconName}
                  onChange={(e) => updateItem<LeadershipCard>('leadershipCards', idx, { iconName: e.target.value })} />
                <input className={inputCls} placeholder="Title" value={card.title}
                  onChange={(e) => updateItem<LeadershipCard>('leadershipCards', idx, { title: e.target.value })} />
                <textarea className={textareaCls} rows={2} placeholder="Body text" value={card.body}
                  onChange={(e) => updateItem<LeadershipCard>('leadershipCards', idx, { body: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        <Field label="Banner Stat (e.g. 100% On Schedule)">
          <input className={inputCls} value={form.leadershipBannerStat} onChange={(e) => setField('leadershipBannerStat', e.target.value)} />
        </Field>
      </div>
    );
  }

  function renderSolution() {
    const colorOptions: SolutionCard['color'][] = ['green', 'blue', 'orange', 'purple'];
    const colorStyles: Record<SolutionCard['color'], string> = {
      green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue:   'bg-sky-50 text-sky-700 border-sky-200',
      orange: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea className={textareaCls} rows={3} value={form.solutionBodyEn} onChange={(e) => setField('solutionBodyEn', e.target.value)} />
          </Field>
          <Field label="Section Body (AR)">
            <textarea className={textareaCls} rows={3} dir="rtl" value={form.solutionBodyAr} onChange={(e) => setField('solutionBodyAr', e.target.value)} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Feature Cards (max 4)</label>
            {form.solutionCards.length < 4 && (
              <button type="button" onClick={() => addItem('solutionCards', { color: 'green', tag: '', title: '', body: '' })}
                className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <div className="space-y-3">
            {form.solutionCards.map((card, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button key={c} type="button"
                        onClick={() => updateItem<SolutionCard>('solutionCards', idx, { color: c })}
                        className={`px-3 py-1 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all capitalize ${
                          card.color === c ? `ring-2 ring-[#38BDF8] ${colorStyles[c]}` : `border-slate-200 bg-white text-slate-500 hover:${colorStyles[c]}`
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => removeItem('solutionCards', idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer self-start sm:self-auto">Remove</button>
                </div>
                <input className={inputCls} placeholder="Badge tag (e.g. Financial Sync)" value={card.tag}
                  onChange={(e) => updateItem<SolutionCard>('solutionCards', idx, { tag: e.target.value })} />
                <input className={inputCls} placeholder="Card Title" value={card.title}
                  onChange={(e) => updateItem<SolutionCard>('solutionCards', idx, { title: e.target.value })} />
                <textarea className={textareaCls} rows={2} placeholder="Card Body" value={card.body}
                  onChange={(e) => updateItem<SolutionCard>('solutionCards', idx, { body: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Architecture Section</p>
          <div className="space-y-4">
            {/* Architecture diagram image upload */}
            <ImageUpload
              label="Architecture Diagram Image"
              value={form.solutionArchImageUrl}
              onChange={(url) => setField('solutionArchImageUrl', url)}
            />
            <Field label="Architecture Title">
              <input className={inputCls} value={form.solutionArchTitle} onChange={(e) => setField('solutionArchTitle', e.target.value)} />
            </Field>
            <Field label="Architecture Body">
              <textarea className={textareaCls} rows={3} value={form.solutionArchBody} onChange={(e) => setField('solutionArchBody', e.target.value)} />
            </Field>
          </div>
        </div>
      </div>
    );
  }

  function renderOutcome() {
    const colorOptions: OutcomeItem['color'][] = ['emerald', 'purple', 'amber'];
    const colorStyles: Record<OutcomeItem['color'], string> = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      purple:  'bg-purple-50 text-purple-700 border-purple-200',
      amber:   'bg-amber-50 text-amber-700 border-amber-200',
    };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outcome Items (max 3)</label>
            {form.outcomeItems.length < 3 && (
              <button type="button" onClick={() => addItem('outcomeItems', { color: 'emerald', text: '' })}
                className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            )}
          </div>
          <div className="space-y-3">
            {form.outcomeItems.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button key={c} type="button"
                        onClick={() => updateItem<OutcomeItem>('outcomeItems', idx, { color: c })}
                        className={`px-3 py-1 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all capitalize ${
                          item.color === c ? `ring-2 ring-[#38BDF8] ${colorStyles[c]}` : 'border-slate-200 bg-white text-slate-500'
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => removeItem('outcomeItems', idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
                </div>
                <textarea className={textareaCls} rows={3} placeholder="Outcome paragraph" value={item.text}
                  onChange={(e) => updateItem<OutcomeItem>('outcomeItems', idx, { text: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        {/* Recognition image upload */}
        <ImageUpload
          label="Recognition / Award Image"
          value={form.recognitionImageUrl}
          onChange={(url) => setField('recognitionImageUrl', url)}
        />

        <Field label="Recognition Label">
          <input className={inputCls} value={form.recognitionLabel} onChange={(e) => setField('recognitionLabel', e.target.value)} placeholder="Formal Letter of Recognition" />
        </Field>
      </div>
    );
  }

  function renderSkills() {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skill Cards (max 7)</label>
          {form.skillCards.length < 7 && (
            <button type="button"
              onClick={() => addItem('skillCards', { num: String(form.skillCards.length + 1), category: '', title: '', body: '' })}
              className="text-[12px] font-semibold text-[#38BDF8] hover:text-[#20B0F0] flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          )}
        </div>
        <div className="space-y-3">
          {form.skillCards.map((sk, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Skill #{idx + 1}</span>
                <button type="button" onClick={() => removeItem('skillCards', idx)}
                  className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Number" value={sk.num}
                  onChange={(e) => updateItem<SkillCard>('skillCards', idx, { num: e.target.value })} />
                <input className={inputCls} placeholder="Category (e.g. CORE DOMAIN)" value={sk.category}
                  onChange={(e) => updateItem<SkillCard>('skillCards', idx, { category: e.target.value })} />
              </div>
              <input className={inputCls} placeholder="Skill Title" value={sk.title}
                onChange={(e) => updateItem<SkillCard>('skillCards', idx, { title: e.target.value })} />
              <textarea className={textareaCls} rows={2} placeholder="Description" value={sk.body}
                onChange={(e) => updateItem<SkillCard>('skillCards', idx, { body: e.target.value })} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderTab() {
    switch (activeTab) {
      case 0: return renderOverview();
      case 1: return renderChallenge();
      case 2: return renderApproach();
      case 3: return renderLeadership();
      case 4: return renderSolution();
      case 5: return renderOutcome();
      case 6: return renderSkills();
      default: return null;
    }
  }

 

  if (isFormMode) {
    return (
      <div className="space-y-5 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
              {editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}
            </h1>
            <p className="text-[13px] text-slate-400 mt-0.5">Fill out each section to build the full case study page.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60">
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          {/* ── Tab Bar ── */}
          <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide">
            {TABS.map((tab, idx) => (
              <button key={tab} type="button" onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 px-3 sm:px-5 py-3 sm:py-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 shrink-0 ${
                  activeTab === idx
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-sky-50/60'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}>
                <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  activeTab === idx ? 'bg-[#38BDF8] text-white' : 'bg-slate-100 text-slate-500'
                }`}>{idx + 1}</span>
                <span className="hidden sm:inline text-[13px]">{tab}</span>
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="p-4 sm:p-6">
            {renderTab()}
          </div>

          {/* ── Tab Navigation Footer ── */}
          <div className="px-4 sm:px-6 pb-5 pt-4 flex items-center justify-between border-t border-slate-50">
            <button type="button" onClick={() => setActiveTab((t) => Math.max(0, t - 1))}
              disabled={activeTab === 0}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              ← Previous
            </button>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {activeTab + 1} of {TABS.length} — {TABS[activeTab]}
            </span>
            {activeTab < TABS.length - 1 ? (
              <button type="button" onClick={() => setActiveTab((t) => t + 1)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-60">
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Item'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">Portfolio</h1>
          <p className="text-[13.5px] text-slate-500 mt-0.5">Manage portfolio projects and case studies.</p>
        </div>
        <button type="button" onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-sm px-5 py-2.5 text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto cursor-pointer font-sans">
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
              <div className="bg-slate-100 rounded-xl aspect-video mb-4" />
              <div className="h-4 bg-slate-100 rounded mb-2 w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-9 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 sm:p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-semibold mb-1">No portfolio items yet</p>
          <p className="text-slate-400 text-[13px] mb-5">Create your first case study to get started.</p>
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#38BDF8] text-white rounded-sm px-5 py-2.5 text-[13.5px] font-semibold cursor-pointer hover:bg-[#20B0F0] transition-colors font-sans">
            <Plus className="w-4 h-4" /> Create First Item
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedItems.map((item) => {
              const cover = item.heroImageUrl || item.media?.url;
              return (
                <AdminContentCard
                  key={item.id}
                  title={item.titleEn || 'Untitled'}
                  description={item.excerptEn}
                  imageUrl={cover}
                  imageAlt={item.titleEn || 'Portfolio item'}
                  imageAspectClass="aspect-video"
                  imageFallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  }
                  imageOverlay={
                    <>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-slate-800 shadow-xs">
                        {item.tag || 'Portfolio'}
                      </span>
                      {!item.published && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-300">
                          Draft
                        </span>
                      )}
                    </>
                  }
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              );
            })}
          </div>

          <AdminPaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="portfolio items"
          />
        </div>
      )}
    </div>
  );
}
