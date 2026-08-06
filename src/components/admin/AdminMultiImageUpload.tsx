import { useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import axios from 'axios';
import { extractUploadedUrl, isBlobUrl, resolveMediaUrl, adminApi } from '../../lib/api';

interface AdminMultiImageUploadProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

/** Multi-image upload with drag-and-drop, previews, and parallel uploads. */
export function AdminMultiImageUpload({
  label,
  values,
  onChange,
  max = 8,
}: AdminMultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [draggingAdd, setDraggingAdd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList) {
    const remaining = max - values.length;
    if (remaining <= 0) return;
    const fileArray = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    if (!fileArray.length) return;

    setError('');
    setUploading(true);

    const baseValues = values;
    const localUrls = fileArray.map((f) => URL.createObjectURL(f));
    onChange([...baseValues, ...localUrls]);

    const results = await Promise.allSettled(
      fileArray.map((file) => adminApi.uploadMedia(file)),
    );

    const serverUrls: string[] = [];
    let hadError = false;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const url = extractUploadedUrl(result.value);
        if (url) serverUrls.push(url);
        else hadError = true;
      } else {
        hadError = true;
      }
    }

    localUrls.forEach((url) => URL.revokeObjectURL(url));
    onChange([...baseValues, ...serverUrls]);
    if (hadError) setError('Some images could not be uploaded. Please try again.');
    setUploading(false);
  }

  function removeImage(idx: number) {
    const url = values[idx];
    if (url && isBlobUrl(url)) URL.revokeObjectURL(url);
    onChange(values.filter((_, i) => i !== idx));
  }

  const canAdd = values.length < max;

  return (
    <div className="w-full">
      {label ? (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
          <span className="ml-2 text-slate-400 font-normal normal-case">
            ({values.length}/{max})
          </span>
        </label>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void processFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative group h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
          >
            <img src={resolveMediaUrl(url)} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
            {isBlobUrl(url) && uploading && (
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              disabled={uploading && isBlobUrl(url)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
              title="Remove"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {canAdd && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !uploading && inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDraggingAdd(true);
            }}
            onDragLeave={() => setDraggingAdd(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingAdd(false);
              if (e.dataTransfer.files.length) void processFiles(e.dataTransfer.files);
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

      {error ? <p className="text-[11.5px] text-red-500 mt-2 font-medium">{error}</p> : null}
    </div>
  );
}
