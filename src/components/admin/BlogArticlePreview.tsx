import { Sparkles, Clock, Calendar } from 'lucide-react';
import profileImg from '../../assets/award.png';

interface BlogArticlePreviewProps {
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  coverImage: string;
  bodyHtml: string;
  publishedLabel: string;
}

/** Pixel-matches the public JournalPostPage so the admin sees exactly what ships. */
export function BlogArticlePreview({
  title,
  subtitle,
  category,
  readTime,
  coverImage,
  bodyHtml,
  publishedLabel,
}: BlogArticlePreviewProps) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="px-5 sm:px-10 md:px-14 py-9 sm:py-12 max-w-3xl mx-auto">
        {/* Category & read time */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13.5px]">
            <Sparkles className="w-4 h-4" />
            {category || 'Uncategorized'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500 text-[12.5px] bg-slate-100 px-3 py-0.5 rounded-full font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {readTime || '5 min read'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[32px] sm:text-[44px] md:text-[50px] font-serif font-bold text-[#0F2E25] tracking-tight leading-[1.12] mb-4">
          {title || 'Untitled article'}
        </h1>

        {/* Subtitle */}
        {subtitle ? (
          <p className="text-[17px] md:text-[18.5px] text-[#52606D] font-normal leading-relaxed mb-8">
            {subtitle}
          </p>
        ) : (
          <div className="mb-8" />
        )}

        {/* Author meta bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-gray-200/90 mb-10">
          <div className="flex items-center gap-3.5">
            <img src={profileImg} alt="Ahmed Ibrahim" className="w-11 h-11 rounded-full object-cover shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14.5px] text-foreground">Ahmed Ibrahim</span>
                <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  Author
                </span>
              </div>
              <span className="text-[12.5px] text-slate-500 block mt-0.5 font-normal">
                Senior AI Strategy Consultant & Enterprise Advisor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Published {publishedLabel}</span>
          </div>
        </div>

        {/* Cover */}
        {coverImage ? (
          <div className="rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-100">
            <img src={coverImage} alt={title} className="w-full h-auto max-h-125 object-cover" />
          </div>
        ) : null}

        {/* Body */}
        {bodyHtml ? (
          <div
            className="blog-editor-content text-[#374151]"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="text-slate-400 italic">Start writing to see the article body here…</p>
        )}
      </div>
    </article>
  );
}
