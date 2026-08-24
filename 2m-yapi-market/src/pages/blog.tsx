import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { ServiceImage } from '@/components/service-image';
import { BUSINESS, CONTACT, whatsappUrl } from '@/data/site';
import { blogArticles, BLOG_CATEGORIES, type BlogArticle, type BlogCategory } from '@/data/blog';
import { apiFetchJson } from '@/lib/api';
import type { BlogPost } from '@/lib/cms';

const WA_GENERIC = BUSINESS.whatsappDefaultMessage;

function BlogMeta() {
  useEffect(() => {
    document.title = 'Yapı, Tadilat ve Uygulama Rehberi | 2M Yapı Market Proje';
    let m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Yapı uygulamaları, tadilat, yalıtım, çatı sistemleri, çelik yapılar ve proje süreçleri hakkında sahada işinize yarayacak bilgiler.');
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Yapı, Tadilat ve Uygulama Rehberi | 2M Yapı Market Proje',
      url: `${window.location.origin}/blog`,
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}

export default function BlogPage() {
  const [filter, setFilter] = useState<BlogCategory | 'Tümü'>('Tümü');
  const [cmsArticles, setCmsArticles] = useState<BlogArticle[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetchJson<BlogPost[]>('/api/public/blog');
        if (cancelled || !data || data.length === 0) return;
        const mapped: BlogArticle[] = data.map((p) => ({
          id: String(p.id),
          slug: p.slug,
          title: p.title,
          category: (p as any).category || 'Tadilat',
          excerpt: p.excerpt,
          content: p.content,
          image: p.image,
          imageAlt: p.imageAlt || p.title,
          readingTime: `${Math.max(3, Math.ceil(p.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} dk`,
          seoTitle: p.seoTitle || '',
          seoDesc: p.seoDesc || '',
        }));
        setCmsArticles(mapped);
      } catch {
        // use hardcoded
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const articles = cmsArticles || blogArticles;
  const filtered = filter === 'Tümü' ? articles : articles.filter((a) => a.category === filter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <BlogMeta />

      {/* Hero */}
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <p className="eyebrow">BİLGİ & REHBER</p>
          <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Yapı, Tadilat<br />ve <em>Uygulama Rehberi.</em></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">
            Yapı uygulamaları, tadilat, yalıtım, çatı sistemleri, çelik yapılar
            ve proje süreçleri hakkında sahada işinize yarayacak bilgiler.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-[1240px] px-5 py-4 md:px-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori filtresi">
            <button
              type="button"
              onClick={() => setFilter('Tümü')}
              className={`border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === 'Tümü' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'}`}
            >
              Tümü
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === cat ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <main className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-16">
        {/* Featured Article */}
        {featured && (
          <article className="mb-10">
            <Link href={`/blog/${featured.slug}`} className="group grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="relative overflow-hidden">
                <ServiceImage
                  src={featured.image}
                  alt={featured.imageAlt}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 font-mono-brand text-xs text-white/80 bg-black/30 px-2 py-1">{featured.category}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">
                  <span className="text-[hsl(var(--primary))]">{featured.category}</span>
                  <span className="text-[hsl(var(--border))]">|</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {featured.readingTime}</span>
                </div>
                <h2 className="mt-3 font-display text-3xl md:text-5xl leading-[.92] group-hover:text-[hsl(var(--primary))] transition-colors">{featured.title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">{featured.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Devamını oku <ArrowRight size={12} /></span>
              </div>
            </Link>
          </article>
        )}

        {/* Rest of articles */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <article key={article.id}>
                <Link href={`/blog/${article.slug}`} className="group block border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:border-[hsl(var(--primary)/.5)] transition-colors">
                  <div className="relative overflow-hidden">
                    <ServiceImage
                      src={article.image}
                      alt={article.imageAlt}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 font-mono-brand text-[10px] text-white/80 bg-black/30 px-2 py-0.5">{article.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
                      <span className="text-[hsl(var(--primary))]">{article.category}</span>
                      <span className="text-[hsl(var(--border))]">·</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {article.readingTime}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight group-hover:text-[hsl(var(--primary))] transition-colors">{article.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[hsl(var(--muted-foreground))] line-clamp-2">{article.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Devamını oku <ArrowRight size={11} /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-sm text-[hsl(var(--muted-foreground))]">Bu kategoride henüz yazı bulunmuyor.</p>
        )}
      </main>

      {/* Bottom CTA */}
      <section className="bg-[hsl(var(--primary))] text-center text-[hsl(var(--primary-foreground))] px-5 py-16 md:py-24">
        <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-60">Başlayalım</p>
        <h2 className="mt-5 font-display text-4xl leading-[.92] md:text-6xl">Projenizi<br /><em>birlikte değerlendirelim.</em></h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-80">Yapılacak işi ve bulunduğunuz bölgeyi paylaşın. İhtiyacı değerlendirip size uygun uygulama sürecini konuşalım.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[hsl(var(--foreground))] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--background))] hover:bg-[hsl(var(--foreground)/.9)] transition-colors">Keşif / Teklif Al <ArrowRight size={14} /></Link>
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--primary-foreground)/.3)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] hover:bg-[hsl(var(--primary-foreground)/.1)] transition-colors"><MessageCircle size={14} /> WhatsApp</a>
        </div>
      </section>
    </>
  );
}
