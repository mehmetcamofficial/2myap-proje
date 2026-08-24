import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, MessageCircle, X, MapPin } from 'lucide-react';
import { ServiceImage } from '@/components/service-image';
import { BUSINESS, CONTACT, whatsappUrl } from '@/data/site';
import { galleryProjects, GALLERY_CATEGORIES, type GalleryProject, type GalleryCategory } from '@/data/gallery';
import { apiFetchJson } from '@/lib/api';
import type { Gallery } from '@/lib/cms';

const WA_GENERIC = BUSINESS.whatsappDefaultMessage;

function GalleryMeta() {
  useEffect(() => {
    document.title = 'Projeler & Uygulamalar | 2M Yapı Market Proje | Kuşadası & Ege Bölgesi';
    let m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Kuşadası ve Ege Bölgesi\'nde gerçekleştirdiğimiz yapı, tadilat, çatı, cephe, çelik, havuz ve uygulama çalışmalarından seçilmiş proje görüntüleri.');
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Projeler & Uygulamalar | 2M Yapı Market Proje',
      description: 'Kuşadası ve Ege Bölgesi\'nde gerçekleştirilmiş proje görüntüleri.',
      url: `${window.location.origin}/galeri`,
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}

function Lightbox({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  project: GalleryProject;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Kapat"
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={28} />
        </button>
        <button
          onClick={onPrev}
          aria-label="Önceki"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 text-white/50 hover:text-white transition-colors hidden md:block"
        >
          <span className="text-3xl font-display">&lsaquo;</span>
        </button>
        <button
          onClick={onNext}
          aria-label="Sonraki"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4 text-white/50 hover:text-white transition-colors hidden md:block"
        >
          <span className="text-3xl font-display">&rsaquo;</span>
        </button>
        <ServiceImage
          src={project.image}
          alt={project.imageAlt}
          className="w-full max-h-[75vh] object-contain"
        />
        <div className="mt-4 text-white">
          <div className="flex items-center gap-3">
            <span className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-white/50">{project.category}</span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1 text-[11px] text-white/50"><MapPin size={11} /> {project.location}</span>
          </div>
          <h3 className="mt-2 font-display text-2xl md:text-3xl">{project.title}</h3>
          <p className="mt-2 text-sm text-white/70 max-w-lg">{project.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function GaleriPage() {
  const [filter, setFilter] = useState<GalleryCategory | 'Tümü'>('Tümü');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cmsProjects, setCmsProjects] = useState<GalleryProject[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetchJson<Gallery[]>('/api/public/galleries');
        if (cancelled || !data || data.length === 0) return;
        const mapped: GalleryProject[] = data.map((g) => ({
          id: String(g.id),
          title: g.title,
          slug: g.slug,
          category: (g.category as GalleryCategory) || 'Tadilat & Renovasyon',
          location: g.location || '',
          description: g.description,
          image: g.coverImage,
          imageAlt: g.title,
          size: (g.size as 'large' | 'medium' | 'portrait') || 'medium',
        }));
        setCmsProjects(mapped);
      } catch {
        // use hardcoded
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const projects = cmsProjects || galleryProjects;
  const filtered = filter === 'Tümü' ? projects : projects.filter((p) => p.category === filter);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() => setLightboxIndex((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const nextLightbox = useCallback(() => setLightboxIndex((i) => i !== null ? (i + 1) % filtered.length : null), [filtered.length]);

  return (
    <>
      <GalleryMeta />

      {/* Hero */}
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <p className="eyebrow">PROJELER & UYGULAMALAR</p>
          <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Uygulamalarımızdan<br /><em>seçkiler.</em></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">
            Kuşadası ve Ege Bölgesi'nde gerçekleştirdiğimiz yapı, tadilat,
            çatı, cephe, çelik, havuz ve uygulama çalışmalarından seçilmiş
            proje görüntüleri.
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
            {GALLERY_CATEGORIES.map((cat) => (
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

      {/* Gallery Grid */}
      <main className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-16">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((project, idx) => (
            <article
              key={project.id}
              className="mb-4 break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div className={`relative overflow-hidden ${project.size === 'portrait' ? 'aspect-[3/4]' : project.size === 'large' ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                <ServiceImage
                  src={project.image}
                  alt={project.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-brand text-[9px] uppercase tracking-[.2em] text-white/60">{project.category}</span>
                    {project.location && (
                      <>
                        <span className="text-white/30">·</span>
                        <span className="flex items-center gap-1 text-[10px] text-white/60"><MapPin size={10} /> {project.location}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-display text-xl text-white">{project.title}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-sm text-[hsl(var(--muted-foreground))]">Bu kategoride henüz proje bulunmuyor.</p>
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

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <Lightbox
          project={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </>
  );
}
