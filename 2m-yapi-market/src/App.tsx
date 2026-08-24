import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Switch, useRoute, useLocation } from 'wouter';
import {
  ArrowRight, ChevronDown, MapPin, Menu, MessageCircle, Phone, X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setBaseUrl } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ServiceImage } from '@/components/service-image';
import NotFound from '@/pages/not-found';
import { QuoteForm } from '@/components/quote-form';
import { WhatsappWidget } from '@/components/whatsapp-widget';
import { BUSINESS, CONTACT, NAV, SITE, whatsappUrl } from '@/data/site';
import { services, CATEGORY_LABELS } from '@/data/services';
import { beforeAfter, processSteps, faqItems } from '@/data/content';

const BeforeAfterSlider = lazy(() => import('@/components/before-after-slider').then(m => ({ default: m.BeforeAfterSlider })));
const RoofSystemExplorer = lazy(() => import('@/components/roof-explorer').then(m => ({ default: m.RoofSystemExplorer })));
const SteelAssembly = lazy(() => import('@/components/steel-assembly').then(m => ({ default: m.SteelAssembly })));
const PoolConstructionTimeline = lazy(() => import('@/components/pool-timeline').then(m => ({ default: m.PoolConstructionTimeline })));
const InsulationExplorer = lazy(() => import('@/components/insulation-explorer').then(m => ({ default: m.InsulationExplorer })));
const MaterialStory = lazy(() => import('@/components/material-story').then(m => ({ default: m.MaterialStory })));
const ServiceAreaVisual = lazy(() => import('@/components/service-area-map').then(m => ({ default: m.ServiceAreaVisual })));

function SectionFallback() {
  return <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8" aria-hidden="true"><div className="h-40 animate-pulse bg-[hsl(var(--muted))]" /></div>;
}

const queryClient = new QueryClient();

const apiBase = import.meta.env.VITE_API_BASE_URL;
if (apiBase) setBaseUrl(apiBase.replace(/\/+$/, ''));

export const PUBLIC_SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://2myapimarket.vercel.app').replace(/\/+$/, '');

const WA_GENERIC = BUSINESS.whatsappDefaultMessage;

/* ----------------------------- SEO / meta ------------------------------- */
function Meta({
  title,
  description,
  path = '/',
  service,
}: {
  title: string;
  description: string;
  path?: string;
  service?: (typeof services)[number];
}) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', description);

    const ensure = (attr: string, val: string, prop = false) => {
      const sel = prop ? `meta[property="${attr}"]` : `meta[name="${attr}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        (prop ? el.setAttribute('property', attr) : el.setAttribute('name', attr));
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    ensure('og:title', title);
    ensure('og:description', description);
    ensure('og:type', 'website', true);
    ensure('og:url', `${PUBLIC_SITE_URL}${path}`, true);
    ensure('og:image', service?.image || `${PUBLIC_SITE_URL}/favicon.svg`, true);

    const ld: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: SITE.name,
        description: SITE.description,
        url: PUBLIC_SITE_URL,
        telephone: CONTACT.phoneDisplay,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${BUSINESS.address.building}, ${BUSINESS.address.streetAddress}`,
          addressLocality: BUSINESS.address.locality,
          addressRegion: BUSINESS.address.region,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.country,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: BUSINESS.serviceRegion,
        },
      },
    ];
    if (service) {
      ld.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.short,
        provider: { '@type': 'HomeAndConstructionBusiness', name: SITE.name, url: PUBLIC_SITE_URL },
        areaServed: { '@type': 'AdministrativeArea', name: BUSINESS.serviceRegion },
        serviceType: service.name,
      });
    }
    if (path === '/') {
      ld.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [title, description, path, service]);

  return null;
}

const Mark = memo(function Mark() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="2M Yapı Market ana sayfa">
      <span className="relative grid h-10 w-10 place-items-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <span className="absolute inset-[7px] border border-current" />
        <span className="font-mono-brand text-[11px] font-medium">2M</span>
      </span>
      <span className="leading-none">
        <strong className="block text-[15px] tracking-[-.04em]">2M YAPI MARKET</strong>
        <small className="mt-1 block font-mono-brand text-[9px] tracking-[.22em]">PROJE BIANCA · KUŞADASI</small>
      </span>
    </Link>
  );
});

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      const prev = document.activeElement as HTMLElement | null;
      return () => prev?.focus();
    }
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.9)] backdrop-blur-md">
        <div className={`mx-auto flex ${scrolled ? 'h-16' : 'h-20'} max-w-[1240px] items-center justify-between px-5 md:px-8`}>
          <Mark />
          <nav aria-label="Ana menü" className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`text-[12px] font-semibold uppercase tracking-[.12em] ${active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]'}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--accent))] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"><MessageCircle size={15} /> WhatsApp</a>
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))]">Keşif iste <ArrowRight size={15} /></Link>
          </div>
          <button type="button" aria-label="Menü aç" aria-expanded={open} onClick={() => setOpen(!open)} className="p-2 md:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      {open && (
        <nav aria-label="Mobil menü" className="fixed inset-0 z-50 flex flex-col justify-between bg-[hsl(var(--foreground))] px-7 py-8 text-[hsl(var(--background))]">
          <button ref={closeRef} type="button" aria-label="Menü kapat" onClick={() => setOpen(false)} className="self-end"><X size={26} /></button>
          <div className="flex flex-col gap-2">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-60">ANA MENÜ</p>
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={`border-b border-[hsl(var(--background)/.14)] py-3 text-xl font-bold uppercase ${active ? 'text-[hsl(var(--primary))]' : ''}`}>{n.label}</Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-3 py-4">
            <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-3 text-sm"><Phone size={17} /> {CONTACT.phoneDisplay}</a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm"><MessageCircle size={17} /> WhatsApp</a>
            <p className="text-xs opacity-70">Merkez: Kuşadası · Hizmet: Ege Bölgesi</p>
          </div>
        </nav>
      )}
    </>
  );
}
const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:px-8">
        <div>
          <Mark />
          <p className="mt-6 max-w-sm text-sm leading-7 text-[hsl(var(--accent-foreground)/.72)]">Merkezimiz Kuşadası’nda. Tadilat, yapı ve uygulama işlerini Ege Bölgesi genelinde tek muhatapta yürütüyoruz.</p>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">Kısayollar</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/hizmetler">Hizmetler</Link>
            <Link href="/uygulamalar">Uygulamalar</Link>
            <Link href="/iletisim">İletişim & Keşif</Link>
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">Hizmetler</p>
          <div className="mt-4 grid gap-3 text-sm">
            {services.slice(0, 5).map((s) => <Link key={s.id} href={s.href}>{s.name}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">İletişim</p>
          <div className="mt-4 text-sm leading-7 text-[hsl(var(--accent-foreground)/.8)]">
            <p>2M Yapı Market Proje Bianca</p>
            <p>TNR Corner Loft</p>
            <p>Kuşadası Davutlar Yolu No:75</p>
            <p>Soğucak · 09400 Kuşadası / AYDIN</p>
            <a href={`tel:${CONTACT.phoneRaw}`} className="mt-3 inline-block py-1">{CONTACT.phoneDisplay}</a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 py-1"><MessageCircle size={15} /> WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-[hsl(var(--accent-foreground)/.14)] px-5 py-5 font-mono-brand text-[10px] md:flex-row md:justify-between md:px-8">
        <span>© {SITE.name}</span>
        <span>Kuşadası merkez · Tüm Ege Bölgesi</span>
      </div>
    </footer>
  );
});

const BottomBar = memo(function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-45 grid grid-cols-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <a href={`tel:${CONTACT.phoneRaw}`} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase"><Phone size={16} /> Ara</a>
      <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase"><MessageCircle size={16} /> WhatsApp</a>
      <Link href="/iletisim" className="flex flex-col items-center justify-center gap-1 bg-[hsl(var(--primary))] py-2.5 text-[10px] font-bold uppercase text-[hsl(var(--primary-foreground))]"><ArrowRight size={16} /> Keşif iste</Link>
    </div>
  );
});
/* -------------------------------- HERO ------------------------------------ */
const HERO_IMG = 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600';

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [entered, setEntered] = useState(false);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setEntered(true); return; }
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const onMove = (e: MouseEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current = {
        x: (e.clientX - cx) / (rect.width / 2),
        y: (e.clientY - cy) / (rect.height / 2),
      };
    };

    let idle = 0;
    const tick = () => {
      idle += 0.003;
      const idleX = Math.sin(idle) * 4;
      const idleY = Math.cos(idle * 0.7) * 3;
      const px = mouseRef.current.x * 12 + idleX;
      const py = mouseRef.current.y * 8 + idleY;
      setMouse({ x: px, y: py });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Background image layer — moves most */}
      <div
        className="absolute inset-[-20px] transition-none will-change-transform"
        style={{ transform: `translate(${mouse.x}px, ${mouse.y}px) scale(1.05)` }}
      >
        <ServiceImage src={HERO_IMG} alt="Villa ve dış mekân uygulamasına dair görsel" className="h-full w-full object-cover" loading="eager" />
      </div>
      <div className="absolute inset-0 bg-[hsl(var(--accent))] opacity-40" />
      {/* Architectural grid layer — moves at half amplitude */}
      <div
        className="absolute inset-[-10px] architectural-lines opacity-30 will-change-transform"
        style={{ transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}
      />
      {/* Content layer — stable */}
      <div className="relative mx-auto max-w-[1240px] px-5 pt-20 pb-24 md:px-8">
        <p className={`font-mono-brand text-[11px] tracking-[.28em] uppercase text-[hsl(var(--accent-foreground))] transition-all duration-700 delay-200 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          2M YAPI MARKET PROJE · KUŞADASI
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] leading-[.85] tracking-[-.04em] text-[hsl(var(--background))]">
          <span className={`block transition-all duration-500 delay-300 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Tadilat, çelik,</span>
          <span className={`block transition-all duration-500 delay-500 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>çatı & <em>havuz</em></span>
          <span className={`block transition-all duration-500 delay-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>tek noktada.</span>
        </h1>
        <p className={`mt-8 max-w-[560px] text-lg leading-8 text-[hsl(var(--background)/.85)] transition-all duration-600 delay-[800ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Malzemeden uygulamaya; çatı, pergola, çelik ve tadilat işlerini tek muhatapta yürütüyoruz. Tüm Ege Bölgesi'nde hizmet.
        </p>
        <div className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-600 delay-[950ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/iletisim" className="inline-flex items-center gap-3 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlatın <ArrowRight size={16} /></Link>
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[hsl(var(--background)/.4)] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--background))]"><MessageCircle size={16} /> WhatsApp</a>
        </div>
        <p className={`mt-6 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--background)/.8)] transition-all duration-500 delay-[1100ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Phone size={15} /> <a href={`tel:${CONTACT.phoneRaw}`} className="underline decoration-[hsl(var(--background)/.4)] underline-offset-2">{CONTACT.phoneDisplay}</a>
          <span className="opacity-60">·</span>
          <span className="font-mono-brand text-[11px] tracking-[.16em] uppercase opacity-90">Kuşadası merkezli · Tüm Ege Bölgesi</span>
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- BRAND POSITION ----------------------------- */
function AboutSection() {
  return (
    <section id="hakkimizda" className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-2 md:items-stretch">
        <div>
          <p className="eyebrow">01 — MALZEME · USTA · UYGULAMA</p>
          <h2 className="mt-5 font-display text-5xl leading-[.9] md:text-7xl">Malzeme. Usta.<br /><em>Uygulama.</em><br />Tek muhatap.</h2>
          <p className="mt-8 max-w-md text-base leading-8 text-[hsl(var(--muted-foreground))]">2M Yapı Market Proje Bianca; malzeme, uygulama ve proje işini tek muhatapta toplar. Merkezimiz Kuşadası’nda, hizmet alanımız tüm Ege Bölgesi.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="border border-[hsl(var(--border))] px-4 py-2 text-sm">Merkez: Kuşadası</span>
            <span className="border border-[hsl(var(--primary))] px-4 py-2 text-sm text-[hsl(var(--primary))]">Hizmet: Ege Bölgesi</span>
          </div>
        </div>
        <div className="relative">
          <ServiceImage src={HERO_IMG} alt="Dış mekân ve yapı uygulamasına dair görsel" className="aspect-[4/5] w-full object-cover" loading="lazy" />
          <div className="absolute -left-3 -bottom-3 h-20 w-20 border bg-[hsl(var(--accent))] opacity-30" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------- UYGULAMA ALANLARI -------------------------- */
function Showcase() {
  const showcaseItems = services.slice(0, 6);
  return (
    <section id="uygulama" className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="eyebrow">02 — UYGULAMA ALANLARI</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Neler<br /><em>yapıyoruz?</em></h2>
        </div>
        <Link href="/uygulamalar" className="group inline-flex items-center gap-2 border-b border-[hsl(var(--border))] pb-1 text-xs font-extrabold uppercase tracking-[.13em]">Tüm uygulamaları gör <ArrowRight size={15} /></Link>
      </div>
      <div className="mt-12 flex flex-col gap-10">
        {showcaseItems.map((s, idx) => (
          <article key={s.id} className="grid md:grid-cols-[1.2fr_1fr] items-center gap-8">
            <Link href={s.href} className="group relative aspect-[4/3] overflow-hidden">
              <ServiceImage src={s.applicationImage} alt={s.applicationImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute top-3 left-3 font-mono-brand text-xs">{String(idx + 1).padStart(2, '0')}</span>
            </Link>
            <div className="md:pl-6">
              <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">{CATEGORY_LABELS[s.category]}</p>
              <h3 className="mt-4 font-display text-4xl md:text-6xl">{s.name}</h3>
              <Link href={s.href} className="mt-4 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Detayı gör <ArrowRight size={14} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
/* -------------------------- SERVICES (interactive) ------------------------- */
function ServicesSection() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) || services[0];
  return (
    <section className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <p className="eyebrow text-[hsl(var(--background)/.5)]">03 — HİZMETLER</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">İhtiyacınız neyse,<br /><em>oradan başlayalım.</em></h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="border-t border-[hsl(var(--background)/.16)]">
            {services.map((s, i) => {
              const isAct = s.id === activeId;
              const SIcon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-[hsl(var(--background)/.16)] py-5 text-left ${isAct ? 'text-[hsl(var(--primary))]' : 'hover:text-[hsl(var(--background)/.7)]'}`}
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono-brand text-xs opacity-60">{String(i + 1).padStart(2, '0')}</span>
                    <SIcon size={18} />
                    <span className="text-xl font-bold tracking-[-.02em]">{s.name}</span>
                  </span>
                  <ArrowRight size={18} className={`shrink-0 transition ${isAct ? 'opacity-100' : 'opacity-30'}`} />
                </button>
              );
            })}
          </div>
          <div className="relative overflow-hidden">
            <ServiceImage key={active.id} src={active.image} alt={active.imageAlt} className="aspect-[4/5] w-full object-cover transition-opacity duration-500" loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--foreground)/.7)] p-5 backdrop-blur">
              <p className="text-xs text-[hsl(var(--primary))]">{CATEGORY_LABELS[active.category]}</p>
              <h3 className="mt-1 font-display text-3xl">{active.name}</h3>
              <p className="mt-2 text-sm leading-6 opacity-80">{active.short}</p>
              <Link href={active.href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Hizmeti incele <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- MATERIAL / CRAFT ------------------------------ */
function MaterialCraft() {
  const rows = [
    ['Malzeme', 'Yapı ve yenileme malzemesini doğru kaynaktan, işin ihtiyacına göre temin ediyoruz.'],
    ['Usta', 'İşini bilen ekiplerle sahada düzenli ve kontrollü ilerliyoruz.'],
    ['Uygulama', 'Kapsamı netleştirip işi planlı biçimde uyguluyor, süreci takip ediyoruz.'],
  ];
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div>
          <p className="eyebrow">04 — AVANTAJ</p>
          <h2 className="mt-4 font-display text-5xl leading-[.88] md:text-7xl">Malzeme. Usta.<br /><em>Uygulama.</em><br />Tek muhatap.</h2>
        </div>
        <div className="border-t border-[hsl(var(--border))]">
          {rows.map(([t, d]) => (
            <div key={t} className="grid gap-2 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[160px_1fr]">
              <h3 className="text-xl font-bold text-[hsl(var(--primary))]">{t}</h3>
              <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">{d}</p>
            </div>
          ))}
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 border border-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">WhatsApp’tan yaz <MessageCircle size={15} /></a>
        </div>
      </div>
    </section>
  );
}
/* ------------------------------- PROCESS ----------------------------------- */
function ProcessSection() {
  return (
    <section className="bg-[hsl(var(--secondary))]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">05 — YAKLAŞIMIMIZ</p>
            <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Karmaşayı<br /><em>azaltırız.</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Net bir süreç, doğru planlama ve tek muhatap. İhtiyaçtan uygulamaya kadar her adımı anlaşılır şekilde ilerletiyoruz.</p>
          </div>
          <div className="border-t border-[hsl(var(--border))]">
            {processSteps.map(([num, title, text]) => (
              <article key={num} className="grid gap-3 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[60px_1fr]">
                <span className="font-mono-brand text-sm text-[hsl(var(--primary))]">{num}</span>
                <div><h3 className="text-2xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- BEFORE / AFTER ------------------------- */
function BeforeAfterSection() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p className="eyebrow">06 — DÖNÜŞÜM ÖRNEĞİ</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Değişimi<br /><em>görün.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Doğru uygulamanın bir yapıda yaratabileceği dönüşümü karşılaştırın.</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Her proje, mevcut alanın ve ihtiyacın değerlendirilmesiyle başlar. Keşif sürecinde malzeme, kapsam ve uygulama adımları netleştirilir.</p>
          <Link href="/iletisim" className="mt-6 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Keşif iste <span className="cta-arrow inline-block">→</span></Link>
        </div>
        <div className="relative overflow-hidden">
          <ServiceImage src={beforeAfter.image} alt={beforeAfter.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p className="font-mono-brand text-xs text-white/80">{beforeAfter.label}</p>
            <p className="mt-1 text-sm font-semibold text-white">Tadilat ve yenileme uygulaması</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SERVICE AREA -------------------------------- */
function ServiceAreaSection() {
  return (
    <section className="bg-[hsl(var(--secondary))]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <p className="eyebrow">HİZMET BÖLGEMLİZ</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Kuşadası’ndan<br /><em>tüm Ege’ye.</em></h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-[hsl(var(--muted-foreground))]">Merkezimiz Kuşadası’nda. Tadilat, yapı ve uygulama işleri için Ege Bölgesi genelinde projeleri değerlendiriyoruz.</p>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">İşin kapsamına ve bulunduğunuz bölgeye göre keşif ve uygulama planlaması yapıyoruz.</p>
        <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlatın <ArrowRight size={16} /></Link>
        <p className="mt-8 font-mono-brand text-[11px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
          {CONTACT.serviceProvinces.join(' · ')} ve Ege Bölgesi
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ STORE / MAP -------------------------------- */
function StoreSection() {
  return (
    <section className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[.25em] opacity-70">07 — MERKEZİMİZ</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Merkezimiz<br /><em>Kuşadası’nda.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 opacity-80">Bizi yerinde ziyaret edebilir veya Ege Bölgesi’ndeki projeniz için telefon ve WhatsApp üzerinden bize ulaşabilirsiniz.</p>
          <p className="mt-6 text-sm font-bold">2M Yapı Market Proje Bianca</p>
          <p className="mt-2 text-sm">TNR Corner Loft</p>
          <p className="text-sm">Soğucak, Kuşadası Davutlar Yolu No:75</p>
          <p className="text-sm">09400 Kuşadası / AYDIN</p>
          <p className="mt-3 text-sm">{CONTACT.phoneDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={BUSINESS.mapsDirections} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">Yol tarifi al <ArrowRight size={14} /></a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 border border-[hsl(var(--accent-foreground)/.4)] px-5 py-3 text-xs font-bold uppercase tracking-widest">Hemen ara <Phone size={14} /></a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--accent-foreground)/.4)] px-5 py-3 text-xs font-bold uppercase tracking-widest">WhatsApp’tan yaz <MessageCircle size={14} /></a>
          </div>
        </div>
        <div className="aspect-square min-h-[280px] border border-[hsl(var(--accent-foreground)/.2)]">
          <iframe title="2M Yapı Market Kuşadası merkez konumu" src={BUSINESS.mapsEmbed} className="h-full w-full border-0 grayscale" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}
/* ----------------------------- GOOGLE REVIEWS ---------------------------- */
function GoogleReviewsSection() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="text-center">
        <p className="eyebrow">GÜVENCE</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Google’daki<br /><em>yorumlarımızı</em><br />inceleyin.</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">İşletmemizi Google’da bulabilir, yorumları okuyabilir ve bize ulaşabilirsiniz.</p>
        <a
          href={BUSINESS.googleProfile || `https://www.google.com/search?q=${encodeURIComponent(SITE.name + ' Kuşadası')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-xs font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]"
        >
          Google’da gör →
        </a>
      </div>
    </section>
  );
}
/* --------------------------------- FAQ ------------------------------------- */
function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-[900px] px-5 py-20 md:py-28">
      <div className="text-center">
        <p className="eyebrow">08 — SORULAR</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Aklınızdaki<br /><em>sorular.</em></h2>
      </div>
      <div className="mt-12 border-t border-[hsl(var(--border))]">
        {faqItems.map(([q, a], i) => (
          <div key={q} className="border-b border-[hsl(var(--border))]">
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-5 py-6 text-left text-lg font-bold">
              <span>{q}</span><ChevronDown size={20} className={`shrink-0 transition ${open === i ? 'rotate-180 text-[hsl(var(--primary))]' : ''}`} />
            </button>
            {open === i && <p className="max-w-2xl pb-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ FINAL CTA --------------------------------- */
function FinalCta() {
  return (
    <section className="bg-[hsl(var(--primary))] text-center text-[hsl(var(--primary-foreground))] px-5 py-16 md:py-24">
      <p className="font-mono-brand text-[11px] uppercase tracking-[.26em] opacity-70">09 — BAŞLAYALIM</p>
      <h2 className="mt-5 font-display text-5xl leading-[.9] md:text-7xl">Bir projeniz mi var?<br /><em>Başlayalım.</em></h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-80">Bulunduğunuz bölgeyi ve yaptırmak istediğiniz işi yazın; gerisini birlikte netleştiririz.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/iletisim" className="inline-flex items-center gap-3 bg-[hsl(var(--foreground))] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[hsl(var(--background))]">Projenizi anlatın <ArrowRight size={16} /></Link>
        <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[hsl(var(--primary-foreground)/.4)] px-6 py-4 text-xs font-bold uppercase tracking-[.13em]"><MessageCircle size={16} /> WhatsApp’tan yaz</a>
      </div>
      <a href={`tel:${CONTACT.phoneRaw}`} className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4">{CONTACT.phoneDisplay}</a>
    </section>
  );
}

/* --------------------------------- HOME ----------------------------------- */
function Home() {
  return (
    <>
      <Meta
        title="2M Yapı Market Proje | Ege Bölgesi Tadilat & Yapı Uygulamaları"
        description={SITE.description}
      />
      <main>
        <Hero />
        <AboutSection />
        <Showcase />
        <ServicesSection />
        <ProcessSection />
        <BeforeAfterSection />
        <MaterialStory />
        <MaterialCraft />
        <ServiceAreaVisual />
        <StoreSection />
        <GoogleReviewsSection />
        <FaqSection />
        <FinalCta />
      </main>
    </>
  );
}

/* ----------------------------- UYGULAMALAR PAGE ----------------------------- */
function ApplicationsPage() {
  return (
    <>
      <Meta
        title="Uygulama Alanları | 2M Yapı Market Proje | Ege Bölgesi"
        description="Tadilattan çelik konstrüksiyona, çatıdan havuza kadar farklı yapı işlerinde malzeme ve uygulamayı birlikte ele alıyoruz."
        path="/uygulamalar"
      />
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <p className="eyebrow">UYGULAMA ALANLARI</p>
          <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Uygulama<br /><em>alanlarımız.</em></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">Tadilattan çelik konstrüksiyona, çatıdan havuza kadar farklı yapı ihtiyaçlarında malzeme ve uygulamayı birlikte ele alıyoruz.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">Merkezimiz Kuşadası’nda; Ege Bölgesi genelindeki projeleri değerlendiriyoruz.</p>
          <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlatın <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Editorial grid */}
      <main className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-24">
        {/* 01 — Large landscape */}
        {services[0] && (
          <article className="mb-10">
            <Link href={services[0].href} className="group relative block aspect-[16/9] overflow-hidden md:aspect-[21/9]">
              <ServiceImage src={services[0].applicationImage} alt={services[0].applicationImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute top-4 left-4 font-mono-brand text-xs text-white/80">01</span>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-10">
                <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-white/60">{CATEGORY_LABELS[services[0].category]}</p>
                <h2 className="mt-2 font-display text-4xl text-white md:text-6xl">{services[0].name}</h2>
                <p className="mt-2 max-w-md text-sm text-white/80">{services[0].short}</p>
                <span className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detayı gör <ArrowRight size={14} /></span>
              </div>
            </Link>
          </article>
        )}

        {/* 02 + 03 — Two contrasting blocks */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          {services.slice(1, 3).map((s, idx) => (
            <article key={s.id}>
              <Link href={s.href} className="group relative block aspect-[4/3] overflow-hidden">
                <ServiceImage src={s.applicationImage} alt={s.applicationImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-4 left-4 font-mono-brand text-xs text-white/80">{String(idx + 2).padStart(2, '0')}</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-white/60">{CATEGORY_LABELS[s.category]}</p>
                  <h3 className="mt-2 font-display text-3xl text-white">{s.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detayı gör <ArrowRight size={14} /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* 04 — Full width */}
        {services[3] && (
          <article className="mb-10">
            <Link href={services[3].href} className="group relative block aspect-[16/9] overflow-hidden">
              <ServiceImage src={services[3].applicationImage} alt={services[3].applicationImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute top-4 left-4 font-mono-brand text-xs text-white/80">04</span>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-10">
                <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-white/60">{CATEGORY_LABELS[services[3].category]}</p>
                <h2 className="mt-2 font-display text-4xl text-white md:text-6xl">{services[3].name}</h2>
                <span className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detayı gör <ArrowRight size={14} /></span>
              </div>
            </Link>
          </article>
        )}

        {/* Remaining items — varied grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {services.slice(4).map((s, idx) => (
            <article key={s.id}>
              <Link href={s.href} className="group relative block aspect-[4/3] overflow-hidden">
                <ServiceImage src={s.applicationImage} alt={s.applicationImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-4 left-4 font-mono-brand text-xs text-white/80">{String(idx + 5).padStart(2, '0')}</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-white/60">{CATEGORY_LABELS[s.category]}</p>
                  <h3 className="mt-2 font-display text-3xl text-white">{s.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detayı gör <ArrowRight size={14} /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

/* ----------------------------- SERVICE DETAIL ------------------------------ */
function ServiceDetail() {
  const [, params] = useRoute('/:slug');
  const service = services.find((s) => s.slug === params?.slug) || services[0];

  const renderInteractiveModule = () => {
    switch (service.slug) {
      case 'cati-sistemleri':
        return <RoofSystemExplorer />;
      case 'celik-konstruksiyon':
        return <SteelAssembly />;
      case 'havuz-yapimi':
        return <PoolConstructionTimeline />;
      case 'dis-cephe':
      case 'prefabrik':
        return <InsulationExplorer />;
      default:
        return null;
    }
  };

  return (
    <>
      <Meta title={service.seoTitle} description={service.seoDesc} path={service.href} service={service} />
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Link href="/hizmetler" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]"><ArrowRight size={14} className="rotate-180" /> Hizmetler</Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-2 items-end">
            <div>
              <p className="eyebrow">{CATEGORY_LABELS[service.category]} / EGE BÖLGESİ</p>
              <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">{service.name}</h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-[hsl(var(--muted-foreground))]">{service.short}</p>
            </div>
            <p className="max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">{service.text}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <ServiceImage src={service.image} alt={service.imageAlt} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <p className="eyebrow">Keşif al</p>
            <h2 className="mt-4 font-display text-4xl">{service.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Kuşadası merkezliyiz; Ege Bölgesi genelindeki talepleri değerlendiriyoruz.</p>
            <a href={whatsappUrl(service.whatsapp)} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-[hsl(var(--primary-foreground))]"><MessageCircle size={15} /> WhatsApp keşif</a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="mt-3 flex items-center justify-center gap-2 border border-[hsl(var(--border))] px-4 py-3 text-xs font-bold uppercase tracking-widest"><Phone size={15} /> {CONTACT.phoneDisplay}</a>
          </div>
        </div>
      </section>
      {renderInteractiveModule()}
    </>
  );
}
/* ----------------------------- SERVICES PAGE ------------------------------- */
function ServicesPage() {
  const [cat, setCat] = useState('all');
  const cats = ['all', 'interior', 'exterior', 'structural', 'technical', 'outdoor'];
  const list = cat === 'all' ? services : services.filter((s) => s.category === cat);
  return (
    <>
      <Meta title="Hizmetler | 2M Yapı Market Proje | Ege Bölgesi" description="Tadilat, çatı, pergola, çelik konstrüksiyon, dış cephe, prefabrik, seramik, tesisat ve havuz uygulamaları — Kuşadası merkezli, Ege Bölgesi genelinde." path="/hizmetler" />
      <main className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-24">
        <p className="eyebrow">HİZMETLER</p>
        <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Yapı, tadilat<br /> & <em>uygulama.</em></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">Merkezimiz Kuşadası’nda. Ege Bölgesi genelindeki tadilat ve yapı işlerini değerlendiriyoruz.</p>
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Kategori">
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={`border px-4 py-3 text-xs font-bold uppercase tracking-wider ${cat === c ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'}`}>{c === 'all' ? 'Tümü' : CATEGORY_LABELS[c as (typeof services)[0]['category']]}</button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => {
            const SIcon = s.icon;
            return (
              <Link key={s.id} href={s.href} className="group overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ServiceImage src={s.image} alt={s.imageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute left-3 top-3 font-mono-brand text-xs opacity-70">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]"><SIcon size={15} /> {CATEGORY_LABELS[s.category]}</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-.03em]">{s.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{s.short}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

/* ------------------------------ CONTACT PAGE -------------------------------- */
function ContactPage() {
  return (
    <>
      <Meta title="İletişim & Keşif | 2M Yapı Market Proje" description="Ege Bölgesi’ndeki tadilat ve yapı işiniz için keşif talebi gönderin. Merkezimiz Kuşadası’nda." path="/iletisim" />
      <main className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">İLETİŞİM / İLK ADIM</p>
            <h1 className="mt-4 font-display text-6xl leading-[.85] md:text-8xl">Projenizi<br /><em>bize bırakın.</em></h1>
            <p className="mt-6 max-w-md text-base leading-8 text-[hsl(var(--muted-foreground))]">Yaptırmak istediğiniz işi ve bulunduğunuz il / ilçeyi yazın. Kapsamı birlikte netleştiririz.</p>
            <div className="mt-10 grid gap-4 border-t border-[hsl(var(--border))] pt-6 text-sm">
              <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-3"><Phone size={18} className="text-[hsl(var(--primary))]" /> {CONTACT.phoneDisplay}</a>
              <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3"><MessageCircle size={18} className="text-[hsl(var(--primary))]" /> WhatsApp’tan yaz</a>
              <p className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-[hsl(var(--primary))]" /> TNR Corner Loft<br />Kuşadası Davutlar Yolu No:75 · Soğucak<br />09400 Kuşadası / AYDIN<br /><span className="mt-2 block text-[hsl(var(--muted-foreground))]">Merkez: Kuşadası · Hizmet: Ege Bölgesi</span></p>
            </div>
          </div>
          <div className="bg-[hsl(var(--card))] p-6 md:p-8">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] text-[hsl(var(--muted-foreground))]">KEŞİF TALEBİ</p>
            <div className="mt-6"><QuoteForm /></div>
          </div>
        </div>
      </main>
    </>
  );
}
/* -------------------------------- ROUTER ----------------------------------- */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hizmetler" component={ServicesPage} />
      <Route path="/uygulamalar" component={ApplicationsPage} />
      <Route path="/iletisim" component={ContactPage} />
      {services.map((s) => <Route key={s.id} path={s.href} component={ServiceDetail} />)}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="site-noise min-h-[100dvh]">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[hsl(var(--primary))] focus:px-4 focus:py-2 focus:text-[hsl(var(--primary-foreground))]">İçeriğe atla</a>
          <Header />
          <ErrorBoundary><main id="main-content"><Router /></main></ErrorBoundary>
          <Footer />
          <BottomBar />
          <WhatsappWidget />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
