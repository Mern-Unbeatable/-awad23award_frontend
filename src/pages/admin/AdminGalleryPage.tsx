import { useState } from 'react';
import { Plus, Edit3, Trash2, ArrowLeft, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link2 } from 'lucide-react';

interface PortfolioProjectItem {
  id: string;
  title: string;
  sub: string;
  tag: string;
  tagStyle: string;
  img: string;
}

const initialProjects: PortfolioProjectItem[] = [
  {
    id: '1',
    title: 'Enterprise Dealflow Platform',
    sub: 'Product Owner • Investment Technology',
    tag: 'Case Study',
    tagStyle: 'bg-white text-black font-semibold',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'CRM Strategy',
    sub: 'Enterprise Consulting',
    tag: 'Project',
    tagStyle: 'bg-[#E0E7FF] text-[#3730A3] font-medium',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'AD Squared',
    sub: 'Founder',
    tag: 'Startup',
    tagStyle: 'bg-[#FCE7F3] text-[#9D174D] font-medium',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Public Speaking',
    sub: 'Speaker & Communicator',
    tag: 'Expertise',
    tagStyle: 'bg-[#FCE7F3] text-[#9D174D] font-medium',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: '75,000 SAR Startup Grant',
    sub: 'Startup Achievement',
    tag: 'Recognition',
    tagStyle: 'bg-[#CFFAFE] text-[#0E7490] font-medium',
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Product Management',
    sub: 'Digital Transformation',
    tag: 'Expertise',
    tagStyle: 'bg-[#DCFCE7] text-[#15803D] font-medium',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  },
];

export function AdminGalleryPage() {
  const [projects, setProjects] = useState<PortfolioProjectItem[]>(initialProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProjectItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [tag, setTag] = useState('Case Study');
  const [img, setImg] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');

  function openCreate() {
    setTitle('');
    setSub('');
    setTag('Case Study');
    setEditingProject(null);
    setIsCreating(true);
  }

  function openEdit(p: PortfolioProjectItem) {
    setTitle(p.title);
    setSub(p.sub);
    setTag(p.tag);
    setImg(p.img);
    setEditingProject(p);
    setIsCreating(true);
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...p, title, sub: sub || p.sub, tag: tag || p.tag, img: img || p.img }
            : p
        )
      );
    } else {
      const newP: PortfolioProjectItem = {
        id: String(Date.now()),
        title,
        sub: sub || 'Enterprise Consulting',
        tag: tag || 'Project',
        tagStyle: 'bg-[#E0E7FF] text-[#3730A3] font-medium',
        img: img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      };
      setProjects([newP, ...projects]);
    }

    setIsCreating(false);
    setEditingProject(null);
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-sans font-bold text-[#111827] tracking-tight">
              {editingProject ? 'Edit Portfolio Entry' : 'Create Portfolio Entry'}
            </h1>
            <p className="text-[14px] text-[#9CA3AF] mt-1 font-sans">
              Configure project overview, architecture breakdown.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-lg px-6 py-2.5 text-[13.5px] font-semibold transition-colors shadow-xs cursor-pointer font-sans"
          >
            New Blog
          </button>
        </div>

        {/* EDITOR CONTAINER CARD MATCHING IMAGE 2 EXACTLY */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100/90 shadow-2xs">
          <label className="text-[14px] font-bold text-[#111827] block mb-3 font-sans">
            Tagline
          </label>

          <div className="rounded-xl overflow-hidden bg-[#F3F4F6]">
            {/* Toolbar Matching Image 2 */}
            <div className="bg-white px-4 py-3 flex items-center gap-3">
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
              Back to Portfolio
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white transition-colors text-[13.5px] font-semibold cursor-pointer font-sans"
            >
              {editingProject ? 'Save Changes' : 'Save Portfolio Entry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER BAR MATCHING SCREENSHOT 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Portfolio</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage your portfolio projects and case studies.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* 3-COLUMN GRID MATCHING SCREENSHOT 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              {/* Image Container with Top-Left Badge */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 aspect-[16/10] mb-4">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] shadow-xs ${p.tagStyle}`}
                >
                  {p.tag}
                </span>
              </div>

              <h3 className="font-serif font-bold text-[18px] text-slate-900 leading-snug mb-1">
                {p.title}
              </h3>

              <p className="text-[13px] text-slate-500 font-normal mb-4">
                {p.sub}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
