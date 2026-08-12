import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import {
  useNavigate,
  useParams,
  useMatch,
  useOutletContext,
} from 'react-router-dom';
import { Edit3, Trash2, ImageIcon } from 'lucide-react';
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar';
import { AdminImageUpload } from '../../components/admin/AdminImageUpload';
import { BlogEditor } from '../../components/admin/BlogEditor';
import { BlogArticlePreview } from '../../components/admin/BlogArticlePreview';
import { BlogFormHeaderBar } from '../../components/admin/BlogFormHeaderBar';
import { usePagination } from '../../hooks/usePagination';
import { isBlobUrl, resolveMediaUrl } from '../../lib/api';
import {
  blogFormToPostPayload,
  type BlogPostItem,
} from '../../lib/blogMappers';
import { confirmDelete } from '../../lib/swal';
import {
  ADMIN_ROUTES,
  ADMIN_BLOG_NEW,
  adminBlogEditPath,
} from '../../Router/adminRoutes';
import type { AdminLayoutContextValue } from '../../components/layout/admin/adminLayoutContext';
import { useBlogAdmin } from '../../features/admin/blog/blogHooks';

function plainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(html: string) {
  const text = plainTextFromHtml(html);
  return text ? text.split(' ').length : 0;
}

function estimateReadTime(html: string) {
  const words = countWords(html);
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const BLOGS_PAGE_SIZE = 8;
const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isNewPage = Boolean(useMatch({ path: '/admin/blogs/new', end: true }));
  const isEditPage = Boolean(
    useMatch({ path: '/admin/blogs/:postId/edit', end: true }),
  );
  const isFormMode = isNewPage || isEditPage;

  const {
    posts: blogs,
    isLoading,
    error: loadError,
    isSaving,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
  } = useBlogAdmin();

  useEffect(() => {
    loadPosts().catch(() => undefined);
  }, [loadPosts]);

  const saving = isSaving;

  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [saveError, setSaveError] = useState('');

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } =
    usePagination(blogs, BLOGS_PAGE_SIZE);

  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [body, setBody] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [category, setCategory] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [readTimeTouched, setReadTimeTouched] = useState(false);
  const [img, setImg] = useState('');
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [contentLocale, setContentLocale] = useState<'en' | 'ar'>('en');

  const activeBody = contentLocale === 'ar' ? bodyAr : body;
  const wordCount = useMemo(() => countWords(activeBody), [activeBody]);
  const autoReadTime = useMemo(
    () => estimateReadTime(body || bodyAr),
    [body, bodyAr],
  );
  const effectiveReadTime = readTimeTouched ? readTime : autoReadTime;
  const publishedLabel = useMemo(() => todayLabel(), []);

  const { setHeaderExtension } = useOutletContext<AdminLayoutContextValue>();

  useEffect(() => {
    if (isNewPage) {
      setTitle('');
      setTitleAr('');
      setSubtitle('');
      setSubtitleAr('');
      setExcerpt('');
      setExcerptAr('');
      setBody('');
      setBodyAr('');
      setCategory('AI Strategy & Digital Transformation');
      setCategoryAr('');
      setReadTime('5 min read');
      setReadTimeTouched(false);
      setImg('');
      setEditingBlog(null);
      setSaveError('');
      setMode('write');
      setFormStep(1);
      setContentLocale('en');
      return;
    }
    if (isEditPage && postId && !isLoading) {
      const blog = blogs.find((b) => b.id === postId);
      if (blog) {
        setTitle(blog.title);
        setTitleAr(blog.titleAr || '');
        setSubtitle(blog.subtitle || '');
        setSubtitleAr(blog.subtitleAr || '');
        setExcerpt(blog.excerpt);
        setExcerptAr(blog.excerptAr || '');
        setBody(blog.body || `<p>${blog.excerpt}</p>`);
        setBodyAr(blog.bodyAr || '');
        setCategory(blog.category || 'Insights');
        setCategoryAr(blog.categoryAr || '');
        setReadTime(blog.readTime);
        setReadTimeTouched(true);
        setImg(blog.img);
        setEditingBlog(blog);
        setSaveError('');
        setMode('write');
        setFormStep(1);
        setContentLocale('en');
      } else if (!loadError) {
        navigate(ADMIN_ROUTES.blogs, { replace: true });
      }
    }
  }, [isNewPage, isEditPage, postId, blogs, isLoading, loadError, navigate]);

  function openCreate() {
    navigate(ADMIN_BLOG_NEW);
  }

  function openEdit(b: BlogPostItem) {
    navigate(adminBlogEditPath(b.id));
  }

  function closeForm() {
    navigate(ADMIN_ROUTES.blogs);
  }

  async function handleDelete(id: string) {
    const confirmed = await confirmDelete(
      'Delete Blog Post?',
      'Are you sure you want to delete this blog post?',
    );
    if (!confirmed) return;

    try {
      await deletePost(id);
    } catch (err) {
      console.error('Failed to delete blog post:', err);
    }
  }

  function goToArabicStep() {
    if (!title.trim()) {
      setSaveError(
        'Add a title — it becomes the headline on the public article page.',
      );
      return;
    }
    if (!body.trim()) {
      setSaveError('Add article content before continuing.');
      return;
    }
    if (img && isBlobUrl(img)) {
      setSaveError(
        'Cover image is still uploading. Please wait and try again.',
      );
      return;
    }
    setSaveError('');
    setFormStep(2);
    setContentLocale('ar');
  }

  function goToEnglishStep() {
    setSaveError('');
    setFormStep(1);
    setContentLocale('en');
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (formStep === 1) {
      goToArabicStep();
      return;
    }
    if (!title.trim()) {
      setSaveError(
        'Add a title — it becomes the headline on the public article page.',
      );
      setFormStep(1);
      return;
    }
    if (!body.trim()) {
      setSaveError('Add article content before publishing.');
      setFormStep(1);
      return;
    }
    if (img && isBlobUrl(img)) {
      setSaveError(
        'Cover image is still uploading. Please wait and try again.',
      );
      return;
    }
    setSaveError('');

    try {
      const payload = blogFormToPostPayload({
        title,
        titleAr,
        subtitle,
        subtitleAr,
        excerpt,
        excerptAr,
        body,
        bodyAr,
        category,
        categoryAr,
        readTime,
        readTimeTouched,
        autoReadTime,
        img,
        author: editingBlog?.author,
        status: editingBlog?.status,
      });

      if (editingBlog) {
        await updatePost(editingBlog.id, payload);
      } else {
        await createPost(payload);
      }
      navigate(ADMIN_ROUTES.blogs);
    } catch (err) {
      console.error('Failed to save blog post:', err);
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save blog post.',
      );
    }
  }

  const closeFormRef = useRef(closeForm);
  closeFormRef.current = closeForm;

  useLayoutEffect(() => {
    if (!isFormMode) {
      setHeaderExtension(null);
      return;
    }
    setHeaderExtension(
      <BlogFormHeaderBar
        title={formStep === 2 ? titleAr || title : title}
        isEditing={Boolean(editingBlog)}
        mode={mode}
        formStep={formStep}
        onBack={() => closeFormRef.current()}
        onModeChange={setMode}
      />,
    );
  }, [
    isFormMode,
    title,
    titleAr,
    mode,
    editingBlog,
    formStep,
    setHeaderExtension,
  ]);

  useEffect(() => {
    return () => setHeaderExtension(null);
  }, [setHeaderExtension]);

  if (isFormMode) {
    const labelCls =
      'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2';
    const fieldCls =
      'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15 transition';
    const previewCover =
      img && !isBlobUrl(img) ? resolveMediaUrl(img) || img : PLACEHOLDER_COVER;

    return (
      <div className='pb-6'>
        {saveError ? (
          <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700'>
            {saveError}
          </div>
        ) : null}

        {mode === 'preview' ? (
          <div className='max-w-3xl mx-auto'>
            <div className='mb-4 flex justify-center gap-2'>
              <button
                type='button'
                onClick={() => setContentLocale('en')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer ${
                  contentLocale === 'en'
                    ? 'bg-[#38BDF8] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                English
              </button>
              <button
                type='button'
                onClick={() => setContentLocale('ar')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer ${
                  contentLocale === 'ar'
                    ? 'bg-[#38BDF8] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                العربية
              </button>
            </div>
            <BlogArticlePreview
              title={contentLocale === 'ar' ? titleAr || title : title}
              subtitle={
                contentLocale === 'ar' ? subtitleAr || subtitle : subtitle
              }
              category={
                contentLocale === 'ar' ? categoryAr || category : category
              }
              readTime={effectiveReadTime}
              coverImage={previewCover}
              bodyHtml={contentLocale === 'ar' ? bodyAr || body : body}
              publishedLabel={publishedLabel}
            />
            <p className='mt-4 text-center text-[12px] text-slate-400 tabular-nums'>
              {wordCount} words · {effectiveReadTime}
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => void handleSave(e)}
            className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start'
          >
            <div className='min-w-0 space-y-4'>
              {formStep === 1 ? (
                <div className='rounded-xl border border-slate-200 bg-white p-5 sm:p-7'>
                  <div className='mb-4'>
                    <span className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>
                      Step 1 — English content
                    </span>
                  </div>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Article title'
                    className='w-full bg-transparent border-0 p-0 text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight placeholder:text-slate-300 focus:outline-none focus:ring-0'
                  />
                  <input
                    type='text'
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder='Add a subtitle (optional)'
                    className='mt-2 w-full bg-transparent border-0 p-0 text-[15.5px] text-slate-500 placeholder:text-slate-300 focus:outline-none focus:ring-0'
                  />

                  <div className='my-5 h-px bg-slate-100' />

                  <div className='flex items-center justify-between mb-2.5 gap-3'>
                    <span className={labelCls + ' mb-0'}>Content</span>
                    <span className='text-[11.5px] text-slate-400 tabular-nums shrink-0'>
                      {countWords(body)} words · {estimateReadTime(body)}
                    </span>
                  </div>
                  <BlogEditor value={body} onChange={setBody} />
                </div>
              ) : (
                <div
                  dir='rtl'
                  className='rounded-xl border border-slate-200 bg-white p-5 sm:p-7'
                >
                  <div className='mb-4 flex items-center justify-between gap-3'>
                    <span className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>
                      Step 2 — Arabic content
                    </span>
                    <span className='text-[11px] text-slate-400'>RTL</span>
                  </div>
                  <input
                    type='text'
                    dir='rtl'
                    lang='ar'
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder='عنوان المقال'
                    className='w-full bg-transparent border-0 p-0 text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight placeholder:text-slate-300 focus:outline-none focus:ring-0 text-right'
                  />
                  <input
                    type='text'
                    dir='rtl'
                    lang='ar'
                    value={subtitleAr}
                    onChange={(e) => setSubtitleAr(e.target.value)}
                    placeholder='أضف عنوانًا فرعيًا (اختياري)'
                    className='mt-2 w-full bg-transparent border-0 p-0 text-[15.5px] text-slate-500 placeholder:text-slate-300 focus:outline-none focus:ring-0 text-right'
                  />

                  <div className='my-5 h-px bg-slate-100' />

                  <div className='flex items-center justify-between mb-2.5 gap-3'>
                    <span className={labelCls + ' mb-0'}>Content</span>
                    <span className='text-[11.5px] text-slate-400 tabular-nums shrink-0'>
                      {countWords(bodyAr)} words · {estimateReadTime(bodyAr)}
                    </span>
                  </div>
                  <BlogEditor
                    value={bodyAr}
                    onChange={setBodyAr}
                    dir='rtl'
                    placeholder='اكتب محتوى المقال كما سيظهر للقراء…'
                  />
                </div>
              )}
            </div>

            <aside className='space-y-5 lg:sticky lg:top-6'>
              <div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3'>
                <div className='flex items-center gap-2 flex-1'>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                      formStep === 1
                        ? 'bg-[#38BDF8] text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    1
                  </span>
                  <span
                    className={`text-[13px] font-semibold ${
                      formStep === 1 ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    English
                  </span>
                  <span className='mx-1 h-px flex-1 bg-slate-200' />
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                      formStep === 2
                        ? 'bg-[#38BDF8] text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    2
                  </span>
                  <span
                    className={`text-[13px] font-semibold ${
                      formStep === 2 ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Arabic
                  </span>
                </div>
              </div>

              {formStep === 1 ? (
                <>
                  <div className='rounded-xl border border-slate-200 bg-white p-5'>
                    <AdminImageUpload
                      label='Cover image'
                      value={img}
                      onChange={setImg}
                      height='aspect-[16/10] min-h-36'
                    />
                  </div>

                  <div className='rounded-xl border border-slate-200 bg-white p-5 space-y-4'>
                    <div>
                      <label className={labelCls}>Category</label>
                      <input
                        type='text'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder='e.g. AI Strategy'
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Read time</label>
                      <input
                        type='text'
                        value={readTimeTouched ? readTime : autoReadTime}
                        onChange={(e) => {
                          setReadTimeTouched(true);
                          setReadTime(e.target.value);
                        }}
                        placeholder='5 min read'
                        className={fieldCls}
                      />
                      <p className='mt-1.5 text-[11.5px] text-slate-400'>
                        Auto-calculated — edit to override.
                      </p>
                    </div>
                  </div>

                  <div className='rounded-xl border border-slate-200 bg-white p-5'>
                    <label className={labelCls}>Card excerpt</label>
                    <textarea
                      rows={3}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder='Short teaser for list & homepage cards. Leave blank to auto-generate.'
                      className={`${fieldCls} resize-y min-h-21`}
                    />
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={closeForm}
                      disabled={saving}
                      className='flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={goToArabicStep}
                      disabled={saving}
                      className='flex-1 px-4 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60'
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div dir='rtl' className='rounded-xl border border-slate-200 bg-white p-5 space-y-4'>
                    <div>
                      <label className={`${labelCls} text-right`}>Category (AR)</label>
                      <input
                        type='text'
                        dir='rtl'
                        lang='ar'
                        value={categoryAr}
                        onChange={(e) => setCategoryAr(e.target.value)}
                        placeholder='مثال: استراتيجية الذكاء الاصطناعي'
                        className={`${fieldCls} text-right`}
                      />
                    </div>
                    <div>
                      <label className={`${labelCls} text-right`}>Card excerpt (AR)</label>
                      <textarea
                        rows={3}
                        dir='rtl'
                        lang='ar'
                        value={excerptAr}
                        onChange={(e) => setExcerptAr(e.target.value)}
                        placeholder='مقتطف قصير لبطاقات القائمة والصفحة الرئيسية.'
                        className={`${fieldCls} resize-y min-h-21 text-right`}
                      />
                    </div>
                  </div>

                  <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12.5px] text-slate-600 leading-relaxed'>
                    English content is saved in memory. Publishing will submit
                    both English and Arabic fields together.
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={goToEnglishStep}
                      disabled={saving}
                      className='flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60'
                    >
                      Back
                    </button>
                    <button
                      type='submit'
                      disabled={saving}
                      className='flex-1 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60'
                    >
                      {saving ? 'Saving…' : editingBlog ? 'Save' : 'Publish'}
                    </button>
                  </div>
                </>
              )}
            </aside>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-[34px] font-sans font-extrabold text-slate-900 tracking-tight'>
            Blogs
          </h1>
          <p className='text-[14px] text-slate-400 mt-1 font-sans'>
            Manage all blog posts from one place.
          </p>
        </div>

        <button
          type='button'
          onClick={openCreate}
          className='bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-sm px-6 py-2.5 text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto cursor-pointer font-sans'
        >
          New Blog
        </button>
      </div>

      {loadError && (
        <div className='p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-[14px]'>
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='bg-white rounded-xl p-4 border border-slate-200 animate-pulse'
            >
              <div className='bg-slate-100 rounded-xl aspect-video mb-4' />
              <div className='h-4 bg-slate-100 rounded mb-2 w-3/4' />
              <div className='h-3 bg-slate-100 rounded w-1/2 mb-4' />
              <div className='h-9 bg-slate-100 rounded' />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className='py-16 text-center text-slate-400 text-[14px]'>
          {loadError
            ? 'Could not load blog posts.'
            : 'No blog posts yet. Create your first article.'}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {paginatedItems.map((b) => (
            <div
              key={b.id}
              className='bg-white rounded-sm p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow'
            >
              <div>
                <div className='aspect-16/10 overflow-hidden rounded-sm bg-slate-100 mb-4'>
                  {b.img && !isBlobUrl(b.img) ? (
                    <img
                      src={resolveMediaUrl(b.img) || b.img}
                      alt={b.title}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_COVER;
                      }}
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <ImageIcon className='w-8 h-8 text-slate-300' />
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2 mb-2'>
                  {b.status === 'draft' && (
                    <span className='text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-700'>
                      Draft
                    </span>
                  )}
                </div>

                <h3 className='font-serif font-bold text-[18px] text-slate-900 mb-2.5 min-h-12 line-clamp-2'>
                  {b.title}
                </h3>

                <p className='text-[14px] text-slate-500 line-clamp-3 mb-4 font-sans font-normal min-h-13.5'>
                  {b.excerpt}
                </p>
              </div>

              <div>
                <div className='text-[11px] font-medium text-slate-400 mb-3 flex items-center gap-2 font-sans'>
                  <span>{b.readTime}</span>
                  <span>—</span>
                  <span>{b.author}</span>
                </div>

                <div className='flex items-center gap-2 pt-2 border-t border-slate-100'>
                  <button
                    type='button'
                    onClick={() => openEdit(b)}
                    className='flex-1 inline-flex items-center justify-center gap-1.5 bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans'
                  >
                    <Edit3 className='w-3.5 h-3.5' />
                    <span>Edit</span>
                  </button>

                  <button
                    type='button'
                    onClick={() => void handleDelete(b.id)}
                    className='flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && blogs.length > 0 && (
        <AdminPaginationBar
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel='posts'
        />
      )}
    </div>
  );
}
