import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Upload, X, ImageIcon } from 'lucide-react';
import { isBlobUrl, resolveMediaUrl, uploadImageFile } from '../../lib/api';

interface AdminImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  height?: string;
}

/**
 * Single-image upload: select file → auto-upload to Media API → auto-fill URL field.
 * No manual URL paste required.
 */
export function AdminImageUpload({
  label,
  value,
  onChange,
  height = 'h-36',
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, GIF).');
      return;
    }
    setError('');
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const uploaded = await uploadImageFile(file);
      URL.revokeObjectURL(localUrl);
      setPreview(uploaded);
      onChange(uploaded);
    } catch (err) {
      URL.revokeObjectURL(localUrl);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Session expired. Please log in again and retry.');
      } else if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
        setError('Upload timed out. Try a smaller image.');
      } else {
        setError('Upload failed. Please try again.');
      }
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className='w-full'>
      {label ? (
        <label className='block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5'>
          {label}
        </label>
      ) : null}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void processFile(f);
          e.target.value = '';
        }}
      />

      {preview ? (
        <div
          className={`relative group rounded-xl overflow-hidden border border-slate-200 ${height} w-full bg-slate-100`}
        >
          <img
            src={isBlobUrl(preview) ? preview : resolveMediaUrl(preview) || preview}
            alt=''
            className='w-full h-full object-cover'
          />

          {uploading && (
            <div className='absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2'>
              <div className='w-9 h-9 border-[3px] border-white border-t-transparent rounded-full animate-spin' />
              <span className='text-white text-[12px] font-semibold'>
                Uploading…
              </span>
            </div>
          )}

          {!uploading && (
            <>
              <div
                role='button'
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === 'Enter' && inputRef.current?.click()
                }
                className='absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center cursor-pointer'
              >
                <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-white text-slate-800 text-[12.5px] font-semibold px-4 py-2 rounded-lg shadow-md pointer-events-none'>
                  <Upload className='w-3.5 h-3.5' />
                  Change Image
                </span>
              </div>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  if (preview && isBlobUrl(preview))
                    URL.revokeObjectURL(preview);
                  setPreview('');
                  onChange('');
                }}
                className='absolute top-2.5 right-2.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md'
                title='Remove image'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            </>
          )}
        </div>
      ) : (
        <div
          role='button'
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) void processFile(f);
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
            <div className='flex flex-col items-center gap-3'>
              <div className='w-9 h-9 border-[3px] border-[#38BDF8] border-t-transparent rounded-full animate-spin' />
              <p className='text-[12px] text-[#38BDF8] font-semibold'>
                Uploading…
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2.5 px-4 text-center pointer-events-none'>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  dragging ? 'bg-sky-100' : 'bg-slate-100'
                }`}
              >
                {dragging ? (
                  <ImageIcon className='w-6 h-6 text-[#38BDF8]' />
                ) : (
                  <Upload className='w-5 h-5 text-slate-400' />
                )}
              </div>
              <div>
                <p className='text-[13px] font-semibold text-slate-600'>
                  {dragging
                    ? 'Drop to upload'
                    : 'Click to upload or drag & drop'}
                </p>
                <p className='text-[11px] text-slate-400 mt-0.5'>
                  PNG, JPG, WebP, GIF · max 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error ? (
        <p className='text-[11.5px] text-red-500 mt-1.5 font-medium'>{error}</p>
      ) : null}
    </div>
  );
}
