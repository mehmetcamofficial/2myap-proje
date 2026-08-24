import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

export function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  const load = useCallback(() => {
    apiFetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
          setSettings(map);
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    for (const [key, value] of Object.entries(settings)) {
      await apiFetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value }),
      });
    }
    setDirty(false);
  };

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const fields = [
    { key: 'whatsapp_message', label: 'Varsayılan WhatsApp Mesajı', multiline: true },
    { key: 'hero_headline', label: 'Hero Başlık' },
    { key: 'hero_sub', label: 'Hero Alt Başlık' },
    { key: 'business_phone', label: 'Telefon Numarası' },
    { key: 'business_whatsapp', label: 'WhatsApp Numarası' },
    { key: 'business_address', label: 'Adres' },
    { key: 'business_maps_embed', label: 'Google Maps Embed URL' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Ayarlar</h1>
      <div className="mt-6 max-w-2xl">
        {fields.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{f.label}</label>
            {f.multiline ? (
              <textarea value={settings[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} rows={3} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            ) : (
              <input value={settings[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            )}
          </div>
        ))}
        <button onClick={save} disabled={!dirty} className="mt-4 bg-[hsl(var(--primary))] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))] disabled:opacity-50">
          Kaydet
        </button>
      </div>
    </div>
  );
}
