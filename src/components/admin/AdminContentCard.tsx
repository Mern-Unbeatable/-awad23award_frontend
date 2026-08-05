import type { ReactNode } from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export interface AdminContentCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt: string;
  imageAspectClass?: string;
  imageOverlay?: ReactNode;
  imageFallback?: ReactNode;
  meta?: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

/** Portfolio list card — matches admin blog card styling (rounded-sm). */
export function AdminContentCard({
  title,
  description,
  imageUrl,
  imageAlt,
  imageAspectClass = 'aspect-16/10',
  imageOverlay,
  imageFallback,
  meta,
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}: AdminContentCardProps) {
  return (
    <article className="bg-white rounded-sm p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
      <div>
        <div
          className={`relative ${imageAspectClass} overflow-hidden rounded-sm bg-slate-100 mb-4`}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
          ) : (
            imageFallback
          )}
          {imageOverlay}
        </div>

        <h3 className="font-serif font-bold text-[18px] text-slate-900 mb-2.5 min-h-12 line-clamp-2">
          {title}
        </h3>

        {description ? (
          <p className="text-[14px] text-slate-500 line-clamp-3 mb-4 font-sans font-normal min-h-13.5">
            {description}
          </p>
        ) : null}
      </div>

      <div>
        {meta}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editLabel}</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold py-2 rounded-sm transition-colors cursor-pointer font-sans"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleteLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
