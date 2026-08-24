import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  published: boolean;
  displayOrder: number;
}

export function AdminGalleriesPage() {
  const { token } = useAuth();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', coverImage: '', displayOrder: '0', published: true });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = useCallback(() => {
    apiFetch('/api/admin/galleries', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setGalleries(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/galleries/${editing.id}` : '/api/admin/galleries';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Kaydetme başarısız');
      setToast({ type: 'success', msg: editing ? 'Güncellendi' : 'Eklendi' });
      setEditing(null);
      setForm({ title: '', slug: '', description: '', coverImage: '', displayOrder: '0', published: true });
      load();
    } catch {
      setToast({ type: 'error', msg: 'Kaydetme başarısız' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const edit = (g: GalleryItem) => {
    setEditing(g);
    setForm({ title: g.title, slug: g.slug, description: g.description, coverImage: g.coverImage, displayOrder: String(g.displayOrder), published: g.published });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz? Bu işlem tüm galeri görsellerini de silecektir.')) return;
    await apiFetch(`/api/admin/galleries/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Galeriler</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Başlık</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{galleries.sort((a, b) => a.displayOrder - b.displayOrder).map((g) => (
              <tr key={g.id} className="border-b border-[hsl(var(--border))]"><td className="px-4 py-3 font-medium">{g.title}</td><td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{g.slug}</td><td className="px-4 py-3">{g.published ? '✓' : '—'}</td><td className="px-4 py-3"><button onClick={() => edit(g)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(g.id)} className="text-xs font-bold text-red-500">Sil</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni Galeri'}</h2>
          <div className="mt-4 grid gap-3">
            <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Kapak görseli URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Sıra" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ title: '', slug: '', description: '', coverImage: '', displayOrder: '0', published: true }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
