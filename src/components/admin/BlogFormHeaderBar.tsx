import { ArrowLeft, PenLine, Eye } from 'lucide-react';

interface BlogFormHeaderBarProps {
  title: string;
  isEditing: boolean;
  mode: 'write' | 'preview';
  onBack: () => void;
  onModeChange: (mode: 'write' | 'preview') => void;
  onSave: () => void;
}

export function BlogFormHeaderBar({
  title,
  isEditing,
  mode,
  onBack,
  onModeChange,
  onSave,
}: BlogFormHeaderBarProps) {
  const segIdle =
    'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer min-h-9';
  const segActive =
    'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold bg-slate-900 text-white shadow-sm transition-colors cursor-pointer min-h-9';

  return (
    <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Back to blogs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isEditing ? 'Editing article' : 'New article'}
            </p>
            <p className="text-[15px] sm:text-[15.5px] font-bold text-slate-900 truncate">
              {title.trim() || 'Untitled article'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
          <div className="inline-flex flex-1 sm:flex-none items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onModeChange('write')}
              className={`flex-1 sm:flex-none ${mode === 'write' ? segActive : segIdle}`}
            >
              <PenLine className="w-3.5 h-3.5" />
              Write
            </button>
            <button
              type="button"
              onClick={() => onModeChange('preview')}
              className={`flex-1 sm:flex-none ${mode === 'preview' ? segActive : segIdle}`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-5 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            {isEditing ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
