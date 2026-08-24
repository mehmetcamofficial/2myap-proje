import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

interface Service {
  id: number;
  slug: string;
  name: string;
  category: string;
  short: string;
  image: string;
  enabled: boolean;
  sortOrder: string;
}

export function AdminServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ slug: '', name: '', category: 'interior', short: '', image: '', enabled: true, sortOrder: '0' });

  const load = useCallback(() => {
    fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setEditing(null);
    setForm({ slug: '', name: '', category: 'interior', short: '', image: '', enabled: true, sortOrder: '0' });
    load();
  };

  const edit = (s: Service) => {
    setEditing(s);
    setForm({ slug: s.slug, name: s.name, category: s.category, short: s.short, image: s.image, enabled: s.enabled, sortOrder: s.sortOrder });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Hizmetler</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Ad</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{services.map((s) => (
              <tr key={s.id} className="border-b border-[hsl(var(--border))]"><td className="px-4 py-3 font-medium">{s.name}</td><td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{s.category}</td><td className="px-4 py-3">{s.enabled ? '✓' : '—'}</td><td className="px-4 py-3"><button onClick={() => edit(s)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(s.id)} className="text-xs font-bold text-red-500">Sil</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni Ekle'}</h2>
          <div className="mt-4 grid gap-3">
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Ad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm">
              <option value="interior">İç Mekan</option><option value="exterior">Dış Mekan</option><option value="structural">Yapısal</option><option value="technical">Teknik</option><option value="outdoor">Açık Alan</option>
            </select>
            <input placeholder="Kısa açıklama" value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Görsel URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Sıra" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Aktif</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ slug: '', name: '', category: 'interior', short: '', image: '', enabled: true, sortOrder: '0' }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
