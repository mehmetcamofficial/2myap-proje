import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';

export function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ services: 0, leads: 0, blog: 0 });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/admin/services', { headers }).then((r) => r.json()),
      fetch('/api/admin/leads', { headers }).then((r) => r.json()),
      fetch('/api/admin/blog', { headers }).then((r) => r.json()),
    ]).then(([services, leads, blog]) => {
      setStats({ services: Array.isArray(services) ? services.length : 0, leads: Array.isArray(leads) ? leads.length : 0, blog: Array.isArray(blog) ? blog.length : 0 });
    }).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Gösterge Paneli</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Hizmetler', value: stats.services, href: '/admin/services' },
          { label: 'Talepler', value: stats.leads, href: '/admin/leads' },
          { label: 'Blog Yazıları', value: stats.blog, href: '/admin/blog' },
        ].map((s) => (
          <a key={s.label} href={s.href} className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{s.label}</p>
            <p className="mt-2 font-display text-4xl">{s.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
