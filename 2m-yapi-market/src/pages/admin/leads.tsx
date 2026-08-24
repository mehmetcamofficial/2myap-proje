import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

interface Lead {
  id: number;
  name: string;
  phone: string;
  service: string;
  area: string;
  description: string;
  contactMethod: string;
  status: string;
  notes: string;
  createdAt: string;
}

export function AdminLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  const load = useCallback(() => {
    fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setLeads(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Talepler</h1>
      <div className="mt-6 overflow-x-auto border border-[hsl(var(--border))]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><th className="px-4 py-3">Ad</th><th className="px-4 py-3">Telefon</th><th className="px-4 py-3">Hizmet</th><th className="px-4 py-3">Bölge</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3">Tarih</th></tr></thead>
          <tbody>{leads.map((l) => (
            <tr key={l.id} className="border-b border-[hsl(var(--border))]">
              <td className="px-4 py-3 font-medium">{l.name}</td>
              <td className="px-4 py-3">{l.phone}</td>
              <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{l.service}</td>
              <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{l.area}</td>
              <td className="px-4 py-3">
                <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs">
                  <option value="new">Yeni</option><option value="contacted">İletişimde</option><option value="completed">Tamamlandı</option><option value="cancelled">İptal</option>
                </select>
              </td>
              <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">{new Date(l.createdAt).toLocaleDateString('tr-TR')}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
