import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  createdAt: string;
}

export function AdminBlogPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ slug: '', title: '', excerpt: '', content: '', image: '', published: false });

  const load = useCallback(() => {
    apiFetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
    await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setEditing(null);
    setForm({ slug: '', title: '', excerpt: '', content: '', image: '', published: false });
    load();
  };

  const edit = (p: BlogPost) => {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, image: p.image, published: p.published });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await apiFetch(`/api/admin/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Blog</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Başlık</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{posts.map((p) => (
              <tr key={p.id} className="border-b border-[hsl(var(--border))]"><td className="px-4 py-3 font-medium">{p.title}</td><td className="px-4 py-3">{p.published ? 'Yayında' : 'Taslak'}</td><td className="px-4 py-3"><button onClick={() => edit(p)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(p.id)} className="text-xs font-bold text-red-500">Sil</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni Yazı'}</h2>
          <div className="mt-4 grid gap-3">
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="Özet" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="İçerik" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Görsel URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ slug: '', title: '', excerpt: '', content: '', image: '', published: false }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
