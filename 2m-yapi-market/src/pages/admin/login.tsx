import { useState } from 'react';
import { useAuth } from './auth-context';

export function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
      <div className="w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold">2M YAPI MARKET</h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Yönetim paneli girişi</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="mt-2 w-full bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))] disabled:opacity-50">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
