import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

interface NavItem {
  id: number;
  label: string;
  href: string;
  parentId: number | null;
  type: string;
  displayOrder: number;
  published: boolean;
  openInNewTab: boolean;
}

export function AdminNavigationPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<NavItem[]>([]);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [form, setForm] = useState({ label: '', href: '', parentId: '', type: 'header', displayOrder: '0', published: true, openInNewTab: false });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = useCallback(() => {
    fetch('/api/admin/navigation', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const body = { ...form, parentId: form.parentId ? Number(form.parentId) : null };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/navigation/${editing.id}` : '/api/admin/navigation';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Kaydetme başarısız');
      }
      setToast({ type: 'success', msg: editing ? 'Güncellendi' : 'Eklendi' });
      setEditing(null);
      setForm({ label: '', href: '', parentId: '', type: 'header', displayOrder: '0', published: true, openInNewTab: false });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Kaydetme başarısız' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const edit = (n: NavItem) => {
    setEditing(n);
    setForm({ label: n.label, href: n.href, parentId: n.parentId ? String(n.parentId) : '', type: n.type, displayOrder: String(n.displayOrder), published: n.published, openInNewTab: n.openInNewTab });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) {
      setToast({ type: 'error', msg: data.error || 'Silme başarısız' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load();
  };

  const parentItems = items.filter(i => !i.parentId);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Navigasyon</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Etiket</th><th className="px-4 py-3">Yol</th><th className="px-4 py-3">Tür</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{items.sort((a, b) => a.displayOrder - b.displayOrder).map((n) => (
              <tr key={n.id} className="border-b border-[hsl(var(--border))]">
                <td className="px-4 py-3 font-medium">{n.parentId ? '↳ ' : ''}{n.label}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] font-mono text-xs">{n.href}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{n.type}</td>
                <td className="px-4 py-3">{n.published ? '✓' : '—'}</td>
                <td className="px-4 py-3"><button onClick={() => edit(n)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(n.id)} className="text-xs font-bold text-red-500">Sil</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni Ekle'}</h2>
          <div className="mt-4 grid gap-3">
            <input placeholder="Etiket" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Yol (ör: /hizmetler)" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm">
              <option value="header">Üst Menü</option>
              <option value="footer">Alt Menü</option>
            </select>
            <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm">
              <option value="">Yok (üst öğe)</option>
              {parentItems.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input placeholder="Sıra" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayında</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })} /> Yeni sekmede aç</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ label: '', href: '', parentId: '', type: 'header', displayOrder: '0', published: true, openInNewTab: false }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
