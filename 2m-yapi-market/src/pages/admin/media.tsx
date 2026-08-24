import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './auth-context';

interface MediaItem {
  id: number;
  filename: string;
  storageKey: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  fileSize: number;
  altText: string;
  title: string;
  createdAt: string;
}

export function AdminMediaPage() {
  const { token } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    fetch(`/api/admin/media${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setMedia(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token, search]);

  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Yükleme başarısız');
        }
      }
      setToast({ type: 'success', msg: `${files.length} dosya yüklendi` });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Yükleme başarısız' });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => setToast(null), 3000);
  };

  const updateAlt = async (id: number, altText: string) => {
    await fetch(`/api/admin/media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ altText }),
    });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) {
      setToast({ type: 'error', msg: data.error || 'Silme başarısız' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Medya</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Görsel ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(e) => upload(e.target.files)} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))] disabled:opacity-50">
            {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {media.map((m) => (
          <div key={m.id} className="group border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="aspect-square bg-[hsl(var(--muted))] overflow-hidden">
              <img src={`/api/admin/media/${m.id}`} alt={m.altText || m.filename} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium" title={m.filename}>{m.filename}</p>
              <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{formatSize(m.fileSize)} · {m.mimeType.split('/')[1]}</p>
              <input
                placeholder="Alt metin"
                defaultValue={m.altText}
                onBlur={(e) => updateAlt(m.id, e.target.value)}
                className="mt-2 w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-[10px]"
              />
              <button onClick={() => del(m.id)} className="mt-2 text-[10px] font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Sil</button>
            </div>
          </div>
        ))}
      </div>
      {media.length === 0 && <p className="mt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">Henüz görsel yüklenmemiş.</p>}
    </div>
  );
}
