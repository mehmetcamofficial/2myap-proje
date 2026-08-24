import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { Link } from 'wouter';
import { apiFetch } from '@/lib/api';

export function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ services: 0, leads: 0, blog: 0, faqs: 0, applications: 0, galleries: 0, media: 0, newLeads: 0 });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      apiFetch('/api/admin/services', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/leads', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/blog', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/faqs', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/applications', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/galleries', { headers }).then((r) => r.json()),
      apiFetch('/api/admin/media', { headers }).then((r) => r.json()),
    ]).then(([services, leads, blog, faqs, applications, galleries, media]) => {
      const leadArr = Array.isArray(leads) ? leads : [];
      setStats({
        services: Array.isArray(services) ? services.length : 0,
        leads: leadArr.length,
        blog: Array.isArray(blog) ? blog.length : 0,
        faqs: Array.isArray(faqs) ? faqs.length : 0,
        applications: Array.isArray(applications) ? applications.length : 0,
        galleries: Array.isArray(galleries) ? galleries.length : 0,
        media: Array.isArray(media) ? media.length : 0,
        newLeads: leadArr.filter((l: any) => l.status === 'new').length,
      });
    }).catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Hizmetler', value: stats.services, href: '/admin/services' },
    { label: 'Uygulamalar', value: stats.applications, href: '/admin/applications' },
    { label: 'S.S.S.', value: stats.faqs, href: '/admin/faqs' },
    { label: 'Galeriler', value: stats.galleries, href: '/admin/galleries' },
    { label: 'Blog Yazıları', value: stats.blog, href: '/admin/blog' },
    { label: 'Medya', value: stats.media, href: '/admin/media' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Gösterge Paneli</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/leads" className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Talepler</p>
          <p className="mt-2 font-display text-4xl">{stats.leads}</p>
          {stats.newLeads > 0 && <p className="mt-1 text-xs font-bold text-[hsl(var(--primary))]">{stats.newLeads} yeni</p>}
        </Link>
        <Link href="/admin/services" className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Hizmetler</p>
          <p className="mt-2 font-display text-4xl">{stats.services}</p>
        </Link>
        <Link href="/admin/applications" className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Uygulamalar</p>
          <p className="mt-2 font-display text-4xl">{stats.applications}</p>
        </Link>
        <Link href="/admin/faqs" className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">S.S.S.</p>
          <p className="mt-2 font-display text-4xl">{stats.faqs}</p>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((s) => (
          <Link key={s.label} href={s.href} className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{s.label}</p>
            <p className="mt-2 font-display text-4xl">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
