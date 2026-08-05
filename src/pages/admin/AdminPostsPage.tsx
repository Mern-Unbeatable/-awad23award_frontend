import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import { useNavigate, useParams, useMatch, useOutletContext } from 'react-router-dom';
import { Edit3, Trash2 } from 'lucide-react';
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar';
import { AdminImageUpload } from '../../components/admin/AdminImageUpload';
import { BlogEditor } from '../../components/admin/BlogEditor';
import { BlogArticlePreview } from '../../components/admin/BlogArticlePreview';
import { BlogFormHeaderBar } from '../../components/admin/BlogFormHeaderBar';
import { usePagination } from '../../hooks/usePagination';
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
const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';

interface BlogPostItem {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  author: string;
  img: string;
}

const initialBlogs: BlogPostItem[] = [
  {
    id: '1',
    title: 'Building Smarter Businesses with AI Strategy',
    subtitle:
      'How Artificial Intelligence Is Helping Businesses Work Smarter, Faster, and More Efficiently',
    excerpt:
      'Discover practical ways AI can streamline operations, improve decision-making, and create long-term business value.',
    body: '<h2>Why AI Strategy Matters</h2><p>Many organisations invest in AI tools without a clear roadmap, often leading to unnecessary costs and limited results.</p><p>A successful AI strategy starts by identifying areas where technology can solve real business challenges.</p>',
    category: 'AI Strategy & Digital Transformation',
    readTime: '5 min read',
    author: 'Ahmed Ibrahim',
    img: DEFAULT_COVER,
  },
  {
    id: '2',
    title: 'The Future of Business Automation',
    subtitle: 'How intelligent systems reshape workflows without adding complexity',
    excerpt:
      'See how intelligent automation is reshaping workflows, increasing productivity, and improving customer experiences.',
    body: '<p>See how intelligent automation is reshaping workflows, increasing productivity, and improving customer experiences.</p>',
    category: 'Automation',
    readTime: '10 min read',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    title: 'Leading Through Change and Innovation',
    subtitle: 'Leadership patterns that keep teams focused during transformation',
    excerpt:
      'Explore leadership strategies that help businesses embrace technology while staying focused on sustainable growth.',
    body: '<p>Explore leadership strategies that help businesses embrace technology while staying focused on sustainable growth.</p>',
    category: 'Leadership',
    readTime: '10 min read',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '4',
    title: 'Digital Transformation That Actually Works',
    subtitle: 'Modernize processes without expensive, unused technology',
    excerpt:
      'Learn how organizations can modernize processes without unnecessary complexity or expensive technology investments.',
    body: '<p>Learn how organizations can modernize processes without unnecessary complexity or expensive technology investments.</p>',
    category: 'Digital Transformation',
    readTime: '10 min read',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '5',
    title: 'Scaling Teams Without Losing Velocity',
    subtitle: 'Practical frameworks for growing product and engineering teams',
    excerpt:
      'Practical frameworks for growing engineering and product teams while keeping delivery predictable.',
    body: '<p>Practical frameworks for growing engineering and product teams while keeping delivery predictable.</p>',
    category: 'Teams & Delivery',
    readTime: '8 min read',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '6',
    title: 'From Strategy Decks to Shipped Products',
    subtitle: 'Closing the gap between executive vision and real systems',
    excerpt:
      'How to close the gap between executive vision and the systems your teams actually build.',
    body: '<p>How to close the gap between executive vision and the systems your teams actually build.</p>',
    category: 'Product Strategy',
    readTime: '12 min read',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
];

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AdminPostsPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isNewPage = Boolean(useMatch({ path: '/admin/blogs/new', end: true }));
  const isEditPage = Boolean(useMatch({ path: '/admin/blogs/:postId/edit', end: true }));
  const isFormMode = isNewPage || isEditPage;

  const [blogs, setBlogs] = useState<BlogPostItem[]>(initialBlogs);
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
    if (isEditPage && postId) {
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
      } else {
        navigate(ADMIN_ROUTES.blogs, { replace: true });
      }
    }
  }, [isNewPage, isEditPage, postId, blogs, navigate]);

  function openCreate() {
    navigate(ADMIN_BLOG_NEW);
  }

  function openEdit(b: BlogPostItem) {
    navigate(adminBlogEditPath(b.id));
  }

  function closeForm() {
    navigate(ADMIN_ROUTES.blogs);
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  }

  function handleSave(e?: React.FormEvent) {
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

    const nextExcerpt =
      excerpt.trim() ||
      subtitle.trim() ||
      body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
      title;

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      excerpt: nextExcerpt,
      body,
      category: category.trim() || 'Insights',
      readTime: (readTimeTouched ? readTime.trim() : autoReadTime) || '5 min read',
      img: img || DEFAULT_COVER,
    };

    if (editingBlog) {
      setBlogs(blogs.map((b) => (b.id === editingBlog.id ? { ...b, ...payload } : b)));
    } else {
      setBlogs([
        {
          id: String(Date.now()),
          author: 'Ahmed Ibrahim',
          ...payload,
        },
        ...blogs,
      ]);
    }

    navigate(ADMIN_ROUTES.blogs);
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
              coverImage={img || DEFAULT_COVER}
              bodyHtml={body}
              publishedLabel={publishedLabel}
            />
            <p className="mt-4 text-center text-[12px] text-slate-400 tabular-nums">
              {wordCount} words · {effectiveReadTime}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
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
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors text-[13px] font-semibold cursor-pointer"
                >
                  {editingBlog ? 'Save' : 'Publish'}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {paginatedItems.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-sm p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <div className="aspect-16/10 overflow-hidden rounded-sm bg-slate-100 mb-4">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
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
                  onClick={() => handleDelete(b.id)}
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

      <AdminPaginationBar
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        itemLabel="posts"
      />
    </div>
  );
}
