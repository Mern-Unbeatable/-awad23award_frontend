import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import { useNavigate, useParams, useMatch, useOutletContext } from 'react-router-dom';
import { Edit3, Trash2, Loader2, ImageIcon } from 'lucide-react';
import { isAxiosError } from 'axios';
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar';
import { AdminImageUpload } from '../../components/admin/AdminImageUpload';
import { BlogEditor } from '../../components/admin/BlogEditor';
import { BlogArticlePreview } from '../../components/admin/BlogArticlePreview';
import { BlogFormHeaderBar } from '../../components/admin/BlogFormHeaderBar';
import { usePagination } from '../../hooks/usePagination';
import { adminApi } from '../../lib/api';
import { blogFormToPostPayload, postToBlogItem, type BlogPostItem } from '../../lib/blogMappers';
import { confirmDelete } from '../../lib/swal';
import {
  ADMIN_ROUTES,
  ADMIN_BLOG_NEW,
  adminBlogEditPath,
} from './adminRoutes';
import type { AdminLayoutContextValue } from './adminLayoutContext';

function plainTextFromHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(html: string) {
  const text = plainTextFromHtml(html);
  return text ? text.split(' ').length : 0;
}

function estimateReadTime(html: string) {
  const words = countWords(html);
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const BLOGS_PAGE_SIZE = 4;
const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (message) return String(message);
    if (!error.response) return 'Unable to reach the server. Check that the API is running.';
  }
  return fallback;
}

export function AdminPostsPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isNewPage = Boolean(useMatch({ path: '/admin/blogs/new', end: true }));
  const isEditPage = Boolean(useMatch({ path: '/admin/blogs/:postId/edit', end: true }));
  const isFormMode = isNewPage || isEditPage;

  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } = usePagination(
    blogs,
    BLOGS_PAGE_SIZE,
  );

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [readTimeTouched, setReadTimeTouched] = useState(false);
  const [img, setImg] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const wordCount = useMemo(() => countWords(body), [body]);
  const autoReadTime = useMemo(() => estimateReadTime(body), [body]);
  const effectiveReadTime = readTimeTouched ? readTime : autoReadTime;
  const publishedLabel = useMemo(() => todayLabel(), []);

  const { setHeaderExtension } = useOutletContext<AdminLayoutContextValue>();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(null);
    adminApi
      .listPostsAdmin()
      .then((posts) => {
        if (isMounted) setBlogs(posts.map(postToBlogItem));
      })
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
        if (isMounted) {
          setBlogs([]);
          setLoadError(getApiErrorMessage(err, 'Failed to load blog posts.'));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isNewPage) {
      setTitle('');
      setSubtitle('');
      setExcerpt('');
      setBody('');
      setCategory('AI Strategy & Digital Transformation');
      setReadTime('5 min read');
      setReadTimeTouched(false);
      setImg('');
      setEditingBlog(null);
      setError('');
      setMode('write');
      return;
    }
    if (isEditPage && postId && !loading) {
      const blog = blogs.find((b) => b.id === postId);
      if (blog) {
        setTitle(blog.title);
        setSubtitle(blog.subtitle || '');
        setExcerpt(blog.excerpt);
        setBody(blog.body || `<p>${blog.excerpt}</p>`);
        setCategory(blog.category || 'Insights');
        setReadTime(blog.readTime);
        setReadTimeTouched(true);
        setImg(blog.img);
        setEditingBlog(blog);
        setError('');
        setMode('write');
      } else if (!loadError) {
        navigate(ADMIN_ROUTES.blogs, { replace: true });
      }
    }
  }, [isNewPage, isEditPage, postId, blogs, loading, loadError, navigate]);

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
      await adminApi.deletePost(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to delete blog post:', err);
      setLoadError(getApiErrorMessage(err, 'Failed to delete blog post.'));
    }
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim()) {
      setError('Add a title — it becomes the headline on the public article page.');
      return;
    }
    if (!body.trim()) {
      setError('Add article content before publishing.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const payload = blogFormToPostPayload({
        title,
        subtitle,
        excerpt,
        body,
        category,
        readTime,
        readTimeTouched,
        autoReadTime,
        img,
        author: editingBlog?.author,
        status: editingBlog?.status,
      });

      if (editingBlog) {
        const updated = await adminApi.updatePost(editingBlog.id, payload);
        const item = postToBlogItem(updated);
        setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? item : b)));
      } else {
        const created = await adminApi.createPost(payload);
        const item = postToBlogItem(created);
        setBlogs((prev) => [item, ...prev]);
      }
      navigate(ADMIN_ROUTES.blogs);
    } catch (err) {
      console.error('Failed to save blog post:', err);
      setError(getApiErrorMessage(err, 'Failed to save blog post.'));
    } finally {
      setSaving(false);
    }
  }

  const closeFormRef = useRef(closeForm);
  const handleSaveRef = useRef(handleSave);
  closeFormRef.current = closeForm;
  handleSaveRef.current = handleSave;

  useLayoutEffect(() => {
    if (!isFormMode) {
      setHeaderExtension(null);
      return;
    }
    setHeaderExtension(
      <BlogFormHeaderBar
        title={title}
        isEditing={Boolean(editingBlog)}
        mode={mode}
        onBack={() => closeFormRef.current()}
        onModeChange={setMode}
        onSave={() => handleSaveRef.current()}
      />,
    );
  }, [isFormMode, title, mode, editingBlog, setHeaderExtension]);

  useEffect(() => {
    return () => setHeaderExtension(null);
  }, [setHeaderExtension]);

  if (isFormMode) {
    const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2';
    const fieldCls =
      'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15 transition';
    const previewCover = img || PLACEHOLDER_COVER;

    return (
      <div className="pb-6">
        {error ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {mode === 'preview' ? (
          <div className="max-w-3xl mx-auto">
            <BlogArticlePreview
              title={title}
              subtitle={subtitle}
              category={category}
              readTime={effectiveReadTime}
              coverImage={previewCover}
              bodyHtml={body}
              publishedLabel={publishedLabel}
            />
            <p className="mt-4 text-center text-[12px] text-slate-400 tabular-nums">
              {wordCount} words · {effectiveReadTime}
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => void handleSave(e)}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start"
          >
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title"
                className="w-full bg-transparent border-0 p-0 text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight placeholder:text-slate-300 focus:outline-none focus:ring-0"
              />
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a subtitle (optional)"
                className="mt-2 w-full bg-transparent border-0 p-0 text-[15.5px] text-slate-500 placeholder:text-slate-300 focus:outline-none focus:ring-0"
              />

              <div className="my-5 h-px bg-slate-100" />

              <div className="flex items-center justify-between mb-2.5 gap-3">
                <span className={labelCls + ' mb-0'}>Content</span>
                <span className="text-[11.5px] text-slate-400 tabular-nums shrink-0">
                  {wordCount} words · {effectiveReadTime}
                </span>
              </div>
              <BlogEditor value={body} onChange={setBody} />
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <AdminImageUpload
                  label="Cover image"
                  value={img}
                  onChange={setImg}
                  height="aspect-[16/10] min-h-36"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. AI Strategy"
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Read time</label>
                  <input
                    type="text"
                    value={readTimeTouched ? readTime : autoReadTime}
                    onChange={(e) => {
                      setReadTimeTouched(true);
                      setReadTime(e.target.value);
                    }}
                    placeholder="5 min read"
                    className={fieldCls}
                  />
                  <p className="mt-1.5 text-[11.5px] text-slate-400">Auto-calculated — edit to override.</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <label className={labelCls}>Card excerpt</label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short teaser for list & homepage cards. Leave blank to auto-generate."
                  className={`${fieldCls} resize-y min-h-21`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors text-[13px] font-semibold cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingBlog ? 'Save' : 'Publish'}
                </button>
              </div>
            </aside>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-sans font-extrabold text-slate-900 tracking-tight">Blogs</h1>
          <p className="text-[14px] text-slate-400 mt-1 font-sans">
            Manage all blog posts from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-sm px-6 py-2.5 text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto cursor-pointer font-sans"
        >
          New Blog
        </button>
      </div>

      {loadError && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-[14px]">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-[#38BDF8]" />
          <span className="text-[14px]">Loading blog posts…</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-[14px]">
          {loadError ? 'Could not load blog posts.' : 'No blog posts yet. Create your first article.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedItems.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-sm p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden rounded-sm bg-slate-100 mb-4">
                  {b.img ? (
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {b.status === 'draft' && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-[18px] text-slate-900 mb-2.5 min-h-12 line-clamp-2">
                  {b.title}
                </h3>

                <p className="text-[14px] text-slate-500 line-clamp-3 mb-4 font-sans font-normal min-h-13.5">
                  {b.excerpt}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-400 mb-3 flex items-center gap-2 font-sans">
                  <span>{b.readTime}</span>
                  <span>—</span>
                  <span>{b.author}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(b.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <AdminPaginationBar
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="posts"
        />
      )}
    </div>
  );
}
