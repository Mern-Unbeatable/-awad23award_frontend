import { useState } from 'react';
import { Edit3, Trash2, Type, Bold, Underline, AlignLeft, AlignCenter, AlignRight, Link2 } from 'lucide-react';

interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  img: string;
}

const initialBlogs: BlogPostItem[] = [
  {
    id: '1',
    title: 'Building Smarter Businesses with AI Strategy',
    excerpt: 'Discover practical ways AI can streamline operations, improve decision-making, and create long-term business value.',
    readTime: '10 Minutes',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'The Future of Business Automation',
    excerpt: 'See how intelligent automation is reshaping workflows, increasing productivity, and improving customer experiences.',
    readTime: '10 Minutes',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Leading Through Change and Innovation',
    excerpt: 'Explore leadership strategies that help businesses embrace technology while staying focused on sustainable growth.',
    readTime: '10 Minutes',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Digital Transformation That Actually Works',
    excerpt: 'Learn how organizations can modernize processes without unnecessary complexity or expensive technology investments.',
    readTime: '10 Minutes',
    author: 'Ahmed Ibrahim',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
];

export function AdminPostsPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>(initialBlogs);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [img, setImg] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80');

  function openCreate() {
    setTitle('');
    setExcerpt('');
    setEditingBlog(null);
    setIsCreating(true);
  }

  function openEdit(b: BlogPostItem) {
    setTitle(b.title);
    setExcerpt(b.excerpt);
    setImg(b.img);
    setEditingBlog(b);
    setIsCreating(true);
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBlog) {
      setBlogs(
        blogs.map((b) =>
          b.id === editingBlog.id
            ? { ...b, title, excerpt: excerpt || title, img: img || b.img }
            : b
        )
      );
    } else {
      const newB: BlogPostItem = {
        id: String(Date.now()),
        title,
        excerpt: excerpt || 'Discover practical insights and strategies for modern business technology.',
        readTime: '10 Minutes',
        author: 'Ahmed Ibrahim',
        img: img || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      };
      setBlogs([newB, ...blogs]);
    }

    setIsCreating(false);
    setEditingBlog(null);
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#111827] tracking-tight">
            {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1 font-sans">
            Fill in the details to publish or save as draft.
          </p>
        </div>

        {/* EDITOR CONTAINER CARD MATCHING IMAGE 2 EXACTLY */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100/90 shadow-2xs">
          <label className="text-[14px] font-bold text-[#111827] block mb-3 font-sans">
            Tagline
          </label>

          <div className="rounded-xl overflow-hidden bg-[#F3F4F6]">
            {/* Toolbar Matching Image 2 */}
            <div className="bg-white px-3 sm:px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 bg-[#181C20] text-white rounded-md px-3 py-1 text-[12px] font-bold cursor-pointer">
                <Type className="w-3.5 h-3.5" />
                <span>H1 ⌄</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#181C20] text-white rounded-md px-3 py-1 text-[12px] font-bold cursor-pointer">
                <span>16px ⌄</span>
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button type="button" className="p-1 text-[#111827] font-bold text-[14px] hover:text-slate-600">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 text-[#111827] hover:text-slate-600">
                <Underline className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button type="button" className="p-1 text-slate-400 hover:text-slate-600">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 text-slate-400 hover:text-slate-600">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 text-slate-400 hover:text-slate-600">
                <AlignRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button type="button" className="p-1 text-slate-400 hover:text-slate-600">
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* Writing Canvas Area */}
            <textarea
              rows={10}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write title"
              className="w-full p-6 bg-[#F3F4F6] text-[14px] text-slate-800 focus:outline-none resize-none placeholder:text-[#9CA3AF] font-sans font-normal border-none"
            />
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[13.5px] font-semibold cursor-pointer font-sans"
            >
              Back to Blogs
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white transition-colors text-[13.5px] font-semibold cursor-pointer font-sans"
            >
              {editingBlog ? 'Save Changes' : 'Publish Blog Post'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BAR MATCHING SCREENSHOT 1 */}
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

      {/* 4-COLUMN GRID MATCHING SCREENSHOT 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-sm p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <div className="aspect-16/10 overflow-hidden rounded-sm bg-slate-100 mb-4">
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
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
    </div>
  );
}
