import { Link, useLocation } from 'wouter';
import { useAuth } from './auth-context';
import { LogOut } from 'lucide-react';

const NAV_ITEMS: readonly { href: string; label: string; exact?: boolean }[] = [
  { href: '/admin', label: 'Gösterge Paneli', exact: true },
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
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === href : location.startsWith(href) && location !== '/admin';

  const displayName = user?.name || user?.email || 'Kullanıcı';

  return (
    <div className="flex min-h-[100dvh] bg-[hsl(var(--background))]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] md:flex md:flex-col md:sticky md:top-0 md:h-screen">
        <div className="shrink-0 border-b border-[hsl(var(--border))] px-5 py-5">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight">2M YAPI MARKET</Link>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-0.5 block rounded-sm px-3 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-[hsl(var(--border))] px-5 py-4">
          <p className="truncate text-xs font-medium text-[hsl(var(--foreground))]" title={user?.email || ''}>{displayName}</p>
          {user?.email && user?.name && <p className="mt-0.5 truncate text-[11px] text-[hsl(var(--muted-foreground))]" title={user.email}>{user.email}</p>}
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-sm border border-[hsl(var(--border))] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))]"
          >
            <LogOut size={13} />
            Çıkış
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="shrink-0 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-display text-sm font-bold">2M YAPI MARKET</Link>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{displayName}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"
              >
                <LogOut size={13} />
                Çıkış
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-sm px-3 py-1.5 text-[11px] font-bold transition-colors ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
