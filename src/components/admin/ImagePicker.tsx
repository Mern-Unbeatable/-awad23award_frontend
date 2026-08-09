import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { adminApi, extractUploadedUrl } from '../../lib/api';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  altEn?: string;
  altAr?: string;
}

interface ImagePickerProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
}

export function ImagePicker({ label = 'Image', value, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);

  const loadLibrary = useCallback(async () => {
    try {
      const { data } = await adminApi.getMedia();
      setLibrary((data as MediaItem[]).filter((m) => m.type === 'image'));
    } catch {
      setLibrary([]);
    }
  }, []);

  useEffect(() => {
    if (showLibrary) void loadLibrary();
  }, [showLibrary, loadLibrary]);

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await adminApi.uploadMedia(file);
      const url = extractUploadedUrl(response);
      if (!url) throw new Error('No URL returned');
      onChange(url);
    } catch {
      setError('Upload failed. Try a smaller image, paste a URL, or check R2 storage settings.');
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  async function applyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setBusy(true);
    setError('');
    try {
      const response = await adminApi.addMediaUrl(trimmed, 'image');
      const url = extractUploadedUrl(response) ?? trimmed;
      onChange(url);
      setUrlInput('');
    } catch {
      onChange(trimmed);
      setUrlInput('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs tracking-widest uppercase text-[var(--admin-muted,#888)]">{label}</p>

      <div
        className={`image-picker ${dragOver ? 'is-dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {value ? (
          <div className="image-picker-preview mb-3">
            <img src={value} alt="Selected" />
          </div>
        ) : (
          <button
            type="button"
            className="w-full py-10 text-center text-sm text-[#8b95a8] cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            Drag & drop an image here, or click to browse
          </button>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-accent !py-2 !px-3 !text-[0.65rem]"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Uploading…' : 'Upload from device'}
          </button>
          <button
            type="button"
            className="btn btn-outline !py-2 !px-3 !text-[0.65rem]"
            onClick={() => setShowLibrary((v) => !v)}
          >
            {showLibrary ? 'Hide gallery' : 'Select from gallery'}
          </button>
          {value && (
            <>
              <button
                type="button"
                className="btn btn-outline !py-2 !px-3 !text-[0.65rem]"
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </button>
              <button
                type="button"
                className="btn btn-outline !py-2 !px-3 !text-[0.65rem] !border-red-400/40 !text-red-300"
                onClick={() => onChange(null)}
              >
                Remove
              </button>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadFile(file);
            e.target.value = '';
          }}
        />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-[#12161f] border border-[#2a3344] rounded-lg px-3 py-2 text-sm"
          placeholder="Paste image URL…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button type="button" className="btn btn-outline !py-2 !px-3 !text-[0.65rem]" onClick={applyUrl}>
          Use URL
        </button>
      </div>

      {error && <p className="text-red-300 text-xs">{error}</p>}

      {showLibrary && (
        <div className="admin-card p-3">
          <p className="text-xs uppercase tracking-widest text-[#8b95a8] mb-3">Media gallery</p>
          {library.length === 0 ? (
            <p className="text-sm text-[#8b95a8]">No images in library yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-auto">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`aspect-square overflow-hidden rounded-lg border cursor-pointer ${
                    value === item.url ? 'border-accent' : 'border-transparent hover:border-[#445]'
                  }`}
                  onClick={() => {
                    onChange(item.url);
                    setShowLibrary(false);
                  }}
                >
                  <img src={item.url} alt={item.altEn || 'Media'} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
