import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

interface App {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  serviceSlug: string | null;
  primaryImage: string;
  primaryImageAlt: string;
  displayOrder: number;
  published: boolean;
  seoTitle: string;
  metaDescription: string;
}

export function AdminApplicationsPage() {
  const { token } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [editing, setEditing] = useState<App | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', shortDescription: '', longDescription: '', serviceSlug: '', primaryImage: '', primaryImageAlt: '', displayOrder: '0', published: true, seoTitle: '', metaDescription: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = useCallback(() => {
    apiFetch('/api/admin/applications', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setApps(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const body = { ...form, serviceSlug: form.serviceSlug || null };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/applications/${editing.id}` : '/api/admin/applications';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Kaydetme başarısız');
      setToast({ type: 'success', msg: editing ? 'Güncellendi' : 'Eklendi' });
      setEditing(null);
      setForm({ title: '', slug: '', shortDescription: '', longDescription: '', serviceSlug: '', primaryImage: '', primaryImageAlt: '', displayOrder: '0', published: true, seoTitle: '', metaDescription: '' });
      load();
    } catch {
      setToast({ type: 'error', msg: 'Kaydetme başarısız' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const edit = (a: App) => {
    setEditing(a);
    setForm({ title: a.title, slug: a.slug, shortDescription: a.shortDescription, longDescription: a.longDescription, serviceSlug: a.serviceSlug || '', primaryImage: a.primaryImage, primaryImageAlt: a.primaryImageAlt, displayOrder: String(a.displayOrder), published: a.published, seoTitle: a.seoTitle, metaDescription: a.metaDescription });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await apiFetch(`/api/admin/applications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Uygulamalar</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Başlık</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{apps.sort((a, b) => a.displayOrder - b.displayOrder).map((a) => (
              <tr key={a.id} className="border-b border-[hsl(var(--border))]"><td className="px-4 py-3 font-medium">{a.title}</td><td className="px-4 py-3">{a.published ? '✓' : '—'}</td><td className="px-4 py-3"><button onClick={() => edit(a)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(a.id)} className="text-xs font-bold text-red-500">Sil</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni Uygulama'}</h2>
          <div className="mt-4 grid gap-3">
            <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="Kısa açıklama" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="Uzun açıklama" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={4} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Hizmet slug" value={form.serviceSlug} onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Kapak görseli URL" value={form.primaryImage} onChange={(e) => setForm({ ...form, primaryImage: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Görsel alt metni" value={form.primaryImageAlt} onChange={(e) => setForm({ ...form, primaryImageAlt: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Sıra" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="SEO Başlık" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Meta açıklama" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ title: '', slug: '', shortDescription: '', longDescription: '', serviceSlug: '', primaryImage: '', primaryImageAlt: '', displayOrder: '0', published: true, seoTitle: '', metaDescription: '' }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
