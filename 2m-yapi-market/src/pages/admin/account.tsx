import { useState } from 'react';
import { useAuth } from './auth-context';

export function AdminAccountPage() {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      setToast({ type: 'error', msg: 'Tüm alanları doldurun' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (newPassword.length < 8) {
      setToast({ type: 'error', msg: 'Yeni şifre en az 8 karakter olmalıdır' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', msg: 'Yeni şifreler eşleşmiyor' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şifre güncellenemedi');
      setToast({ type: 'success', msg: 'Şifre güncellendi' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Şifre güncellenemedi' });
    }
    setLoading(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Hesabım</h1>
      {toast && <div className={`mt-4 px-4 py-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>}

      <div className="mt-6 max-w-md">
        <div className="border border-[hsl(var(--border))] p-6">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Kullanıcı: <strong>{user?.email}</strong></p>
        </div>

        <div className="mt-6 border border-[hsl(var(--border))] p-6">
          <h2 className="font-display text-lg font-bold">Şifre Değiştir</h2>
          <div className="mt-4 grid gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Mevcut Şifre</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Yeni Şifre</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Yeni Şifre (Tekrar)</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm" />
            </div>
            <button onClick={changePassword} disabled={loading} className="mt-2 bg-[hsl(var(--primary))] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))] disabled:opacity-50">
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
