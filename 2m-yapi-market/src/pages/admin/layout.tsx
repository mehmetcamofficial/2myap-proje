import { Link, useLocation } from 'wouter';
import { useAuth } from './auth-context';

const NAV_ITEMS = [
  { href: '/admin', label: 'Gösterge Paneli' },
  { href: '/admin/services', label: 'Hizmetler' },
  { href: '/admin/applications', label: 'Uygulamalar' },
  { href: '/admin/faqs', label: 'S.S.S.' },
  { href: '/admin/galleries', label: 'Galeriler' },
  { href: '/admin/media', label: 'Medya' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/navigation', label: 'Navigasyon' },
  { href: '/admin/leads', label: 'Talepler' },
  { href: '/admin/settings', label: 'Ayarlar' },
  { href: '/admin/account', label: 'Hesabım' },
] as const;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      <aside className="hidden w-60 shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] md:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-[hsl(var(--border))] px-5 py-5">
            <Link href="/admin" className="font-display text-lg font-bold">2M YAPI MARKET</Link>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Yönetim Paneli</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/admin' ? location === '/admin' : location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`mb-1 block px-3 py-2.5 text-sm font-medium ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[hsl(var(--border))] px-5 py-4">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{user?.name}</p>
            <button onClick={logout} className="mt-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] hover:underline">Çıkış</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="border-b border-[hsl(var(--border))] px-5 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-display text-sm font-bold">2M YAPI MARKET</Link>
            <button onClick={logout} className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">Çıkış</button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/admin' ? location === '/admin' : location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`shrink-0 px-3 py-1.5 text-xs font-bold ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
