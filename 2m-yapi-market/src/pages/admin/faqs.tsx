import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  serviceSlug: string | null;
  displayOrder: number;
  published: boolean;
}

export function AdminFaqsPage() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'genel', serviceSlug: '', displayOrder: '0', published: true });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = useCallback(() => {
    apiFetch('/api/admin/faqs', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const body = { ...form, serviceSlug: form.serviceSlug || null };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/faqs/${editing.id}` : '/api/admin/faqs';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Kaydetme başarısız');
      setToast({ type: 'success', msg: editing ? 'Güncellendi' : 'Eklendi' });
      setEditing(null);
      setForm({ question: '', answer: '', category: 'genel', serviceSlug: '', displayOrder: '0', published: true });
      load();
    } catch {
      setToast({ type: 'error', msg: 'Kaydetme başarısız' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const edit = (f: Faq) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, serviceSlug: f.serviceSlug || '', displayOrder: String(f.displayOrder), published: f.published });
  };

  const del = async (id: number) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await apiFetch(`/api/admin/faqs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const togglePublished = async (f: Faq) => {
    await apiFetch(`/api/admin/faqs/${f.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...f, published: !f.published, serviceSlug: f.serviceSlug || null }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">S.S.S.</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="border border-[hsl(var(--border))]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Soru</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{faqs.sort((a, b) => a.displayOrder - b.displayOrder).map((f) => (
              <tr key={f.id} className="border-b border-[hsl(var(--border))]"><td className="px-4 py-3 font-medium max-w-xs truncate">{f.question}</td><td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{f.category}</td><td className="px-4 py-3"><button onClick={() => togglePublished(f)} className={`text-xs font-bold ${f.published ? 'text-green-600' : 'text-[hsl(var(--muted-foreground))]'}`}>{f.published ? 'Yayında' : 'Taslak'}</button></td><td className="px-4 py-3"><button onClick={() => edit(f)} className="mr-3 text-xs font-bold text-[hsl(var(--primary))]">Düzenle</button><button onClick={() => del(f.id)} className="text-xs font-bold text-red-500">Sil</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border border-[hsl(var(--border))] p-5">
          <h2 className="font-display text-lg font-bold">{editing ? 'Düzenle' : 'Yeni S.S.S.'}</h2>
          <div className="mt-4 grid gap-3">
            <textarea placeholder="Soru" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={2} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <textarea placeholder="Cevap" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm">
              <option value="genel">Genel</option><option value="hizmet">Hizmet</option><option value="fiyat">Fiyat</option><option value="sure">Süre</option><option value="bölge">Bölge</option>
            </select>
            <input placeholder="Hizmet slug (opsiyonel)" value={form.serviceSlug} onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <input placeholder="Sıra" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla</label>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">{editing ? 'Güncelle' : 'Ekle'}</button>
              {editing && <button onClick={() => { setEditing(null); setForm({ question: '', answer: '', category: 'genel', serviceSlug: '', displayOrder: '0', published: true }); }} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
