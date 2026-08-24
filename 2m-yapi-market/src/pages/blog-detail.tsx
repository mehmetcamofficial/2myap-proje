import { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowRight, ArrowLeft, Clock, MessageCircle, MapPin } from 'lucide-react';
import { ServiceImage } from '@/components/service-image';
import { BUSINESS, CONTACT, whatsappUrl } from '@/data/site';
import { blogArticles, type BlogArticle } from '@/data/blog';
import { PUBLIC_SITE_URL } from '@/App';
import { apiFetchJson } from '@/lib/api';
import type { BlogPost } from '@/lib/cms';

const WA_GENERIC = BUSINESS.whatsappDefaultMessage;

export default function BlogDetailPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';
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
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) return;
    document.title = article.seoTitle || `${article.title} | 2M Yapı Market Proje`;
    let m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', article.seoDesc || article.excerpt);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', article.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', article.seoDesc || article.excerpt);
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', article.image);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `${PUBLIC_SITE_URL}/blog/${article.slug}`);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.seoDesc || article.excerpt,
      image: article.image,
      url: `${PUBLIC_SITE_URL}/blog/${article.slug}`,
      publisher: {
        '@type': 'Organization',
        name: '2M Yapı Market Proje',
      },
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [article]);

  if (!article) {
    return (
      <main className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-32 text-center">
        <p className="font-mono-brand text-[10px] uppercase tracking-[.25em] text-[hsl(var(--muted-foreground))]">404 / YAZI BULUNAMADI</p>
        <h1 className="mt-4 font-display text-5xl">Bu yazı<br /><em>yerinde değil.</em></h1>
        <Link href="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"><ArrowLeft size={14} /> Blog sayfasına dön</Link>
      </main>
    );
  }

  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
  if (related.length < 3) {
    const extra = articles.filter((a) => a.slug !== article.slug && a.category !== article.category).slice(0, 3 - related.length);
    related.push(...extra);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full">
          <ServiceImage
            src={article.image}
            alt={article.imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 md:px-8 md:pb-14">
          <div className="mx-auto max-w-[800px]">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-white/60">
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span className="text-white/30">/</span>
              <span className="text-[hsl(var(--primary))]">{article.category}</span>
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl text-white leading-[.92]">{article.title}</h1>
            <div className="mt-4 flex items-center gap-4 text-[11px] text-white/50">
              <span className="flex items-center gap-1"><Clock size={12} /> {article.readingTime}</span>
              <span className="text-white/30">·</span>
              <span>{article.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="mx-auto max-w-[800px] px-5 py-12 md:px-8 md:py-20">
        <p className="text-lg leading-8 text-[hsl(var(--muted-foreground))] font-medium mb-10">{article.excerpt}</p>

        <div
          className="prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-[-.02em] prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-sm prose-p:leading-7 prose-p:text-[hsl(var(--muted-foreground))] prose-li:text-sm prose-li:leading-7 prose-li:text-[hsl(var(--muted-foreground))] prose-strong:text-[hsl(var(--foreground))] prose-table:text-sm prose-th:text-left prose-th:font-bold prose-th:pb-2 prose-td:py-2 prose-td:border-b prose-td:border-[hsl(var(--border))]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Service CTA */}
        <div className="mt-14 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
          <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] text-[hsl(var(--muted-foreground))]">İhtiyacınız varsa</p>
          <h3 className="mt-3 font-display text-2xl">Profesyonel destek alın.</h3>
          <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde tadilat, çatı, çelik, cephe ve haviz uygulamalarını değerlendirir.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors">Keşif / Teklif Al <ArrowRight size={13} /></Link>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--primary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"><MessageCircle size={13} /> WhatsApp</a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 border border-[hsl(var(--border))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors">{CONTACT.phoneDisplay}</a>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary))]">
          <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
            <h2 className="font-display text-3xl md:text-4xl">Benzer <em>yazılar.</em></h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <article key={a.id}>
                  <Link href={`/blog/${a.slug}`} className="group block border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:border-[hsl(var(--primary)/.5)] transition-colors">
                    <div className="relative overflow-hidden">
                      <ServiceImage src={a.image} alt={a.imageAlt} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <span className="absolute top-3 left-3 font-mono-brand text-[10px] text-white/80 bg-black/30 px-2 py-0.5">{a.category}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
                        <span className="text-[hsl(var(--primary))]">{a.category}</span>
                        <span className="text-[hsl(var(--border))]">·</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {a.readingTime}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg leading-tight group-hover:text-[hsl(var(--primary))] transition-colors">{a.title}</h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
