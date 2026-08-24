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
import { services, CATEGORY_LABELS, serviceGroups } from '@/data/services';
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
      <header className={`sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.95)] backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-[var(--shadow-sm)]' : ''}`}>
        <div className={`mx-auto flex ${scrolled ? 'h-14' : 'h-18'} max-w-[1240px] items-center justify-between px-5 transition-all duration-300 md:px-8`}>
          <Mark />
          <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] transition-colors ${active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-[hsl(var(--border))] px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"><MessageCircle size={13} /> WhatsApp</a>
            <Link href="/iletisim" className="inline-flex items-center gap-1.5 bg-[hsl(var(--primary))] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors">Keşif / Teklif Al <ArrowRight size={13} /></Link>
          </div>
          <button type="button" aria-label="Menü aç" aria-expanded={open} onClick={() => setOpen(!open)} className="p-2 lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      {open && (
        <nav aria-label="Mobil menü" className="fixed inset-0 z-50 flex flex-col justify-between bg-[hsl(var(--foreground))] px-7 py-8 text-[hsl(var(--background))]">
          <button ref={closeRef} type="button" aria-label="Menü kapat" onClick={() => setOpen(false)} className="self-end"><X size={26} /></button>
          <div className="flex flex-col gap-1">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-50 mb-2">Ana Menü</p>
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={`border-b border-[hsl(var(--background)/.1)] py-3 text-lg font-bold uppercase ${active ? 'text-[hsl(var(--primary))]' : ''}`}>{n.label}</Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-3 py-4">
            <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-3 text-sm"><Phone size={17} /> {CONTACT.phoneDisplay}</a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm"><MessageCircle size={17} /> WhatsApp</a>
            <Link href="/iletisim" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Keşif / Teklif Al <ArrowRight size={14} /></Link>
            <p className="text-xs opacity-50 mt-2">Merkez: Kuşadası · Hizmet: Ege Bölgesi</p>
          </div>
        </nav>
      )}
    </>
  );
}
const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-8">
        <div>
          <Mark />
          <p className="mt-5 max-w-xs text-xs leading-6 opacity-60">Kuşadası merkezli 2M Yapı Market Proje; tadilat, çelik, çatı, cephe ve havuz uygulamalarını Ege Bölgesi genelinde tek muhatapta yürütür.</p>
        </div>
        <div>
          <p className="font-mono-brand text-[9px] uppercase tracking-[.2em] opacity-50">Kurumsal</p>
          <div className="mt-4 grid gap-2.5 text-xs opacity-70">
            <Link href="/hizmetler">Hizmetler</Link>
            <Link href="/uygulamalar">Uygulama Alanları</Link>
            <Link href="/galeri">Projeler & Galeri</Link>
            <Link href="/blog">Blog & Rehber</Link>
            <Link href="/iletisim">İletişim & Keşif</Link>
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[9px] uppercase tracking-[.2em] opacity-50">Hizmetler</p>
          <div className="mt-4 grid gap-2.5 text-xs opacity-70">
            {serviceGroups.slice(0, 5).map((g) => <span key={g.id}>{g.name}</span>)}
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[9px] uppercase tracking-[.2em] opacity-50">İletişim</p>
          <div className="mt-4 text-xs leading-6 opacity-70">
            <p className="font-bold">2M Yapı Market Proje Bianca</p>
            <p>TNR Corner Loft</p>
            <p>Kuşadası Davutlar Yolu No:75</p>
            <p>Soğucak · 09400 Kuşadası / AYDIN</p>
            <a href={`tel:${CONTACT.phoneRaw}`} className="mt-2 inline-block py-1">{CONTACT.phoneDisplay}</a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-2 py-1"><MessageCircle size={13} /> WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-[hsl(var(--background)/.1)] px-5 py-5 font-mono-brand text-[9px] opacity-40 md:flex-row md:justify-between md:px-8">
        <span>© {SITE.name}</span>
        <span>Kuşadası merkez · Tüm Ege Bölgesi</span>
      </div>
    </footer>
  );
});

const BottomBar = memo(function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-45 grid grid-cols-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <a href={`tel:${CONTACT.phoneRaw}`} className="flex flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-bold uppercase"><Phone size={15} /> Ara</a>
      <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-bold uppercase"><MessageCircle size={15} /> WhatsApp</a>
      <Link href="/iletisim" className="flex flex-col items-center justify-center gap-0.5 bg-[hsl(var(--primary))] py-2 text-[9px] font-bold uppercase text-[hsl(var(--primary-foreground))]"><ArrowRight size={15} /> Keşif Al</Link>
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
    <section ref={sectionRef} className="relative flex min-h-[88vh] items-center overflow-hidden">
      {/* Background image layer — moves most */}
      <div
        className="absolute inset-[-20px] transition-none will-change-transform"
        style={{ transform: `translate(${mouse.x}px, ${mouse.y}px) scale(1.05)` }}
      >
        <ServiceImage src={HERO_IMG} alt="Yapı ve uygulama çalışması" className="h-full w-full object-cover" loading="eager" />
      </div>
      <div className="absolute inset-0 bg-[hsl(var(--foreground))] opacity-50" />
      {/* Content layer — stable */}
      <div className="relative mx-auto max-w-[1240px] px-5 pt-24 pb-20 md:px-8">
        <p className={`font-mono-brand text-[10px] tracking-[.28em] uppercase text-[hsl(var(--background)/.7)] transition-all duration-700 delay-200 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          2M YAPI MARKET PROJE · KUŞADASI
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,7vw,6rem)] leading-[.88] tracking-[-.03em] text-[hsl(var(--background))]">
          <span className={`block transition-all duration-500 delay-300 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Ege Bölgesi'nde</span>
          <span className={`block transition-all duration-500 delay-500 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Yapı ve Uygulama</span>
          <span className={`block transition-all duration-500 delay-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Çözümleri.</span>
        </h1>
        <p className={`mt-8 max-w-[540px] text-base leading-7 text-[hsl(var(--background)/.8)] transition-all duration-600 delay-[800ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Tadilattan çelik konstrüksiyona, çatıdan dış cepheye; malzeme, usta ve uygulamayı tek noktada buluşturuyoruz.
        </p>
        <div className={`mt-10 flex flex-wrap items-center gap-3 transition-all duration-600 delay-[950ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/hizmetler" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors">Hizmetleri İncele <ArrowRight size={15} /></Link>
          <Link href="/iletisim" className="inline-flex items-center gap-2 border border-[hsl(var(--background)/.35)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--background))] hover:bg-[hsl(var(--background)/.1)] transition-colors">Projenizi Anlatın</Link>
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--background)/.35)] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--background))] hover:bg-[hsl(var(--background)/.1)] transition-colors"><MessageCircle size={14} /> WhatsApp</a>
        </div>
        <p className={`mt-6 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--background)/.7)] transition-all duration-500 delay-[1100ms] ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Phone size={14} /> <a href={`tel:${CONTACT.phoneRaw}`} className="underline decoration-[hsl(var(--background)/.3)] underline-offset-2 hover:decoration-[hsl(var(--background)/.7)] transition-colors">{CONTACT.phoneDisplay}</a>
          <span className="opacity-40">·</span>
          <span className="font-mono-brand text-[10px] tracking-[.14em] uppercase opacity-80">Kuşadası merkezli · Tüm Ege Bölgesi</span>
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- TRUST STRIP --------------------------------- */
function TrustStrip() {
  const items = [
    'Yapı Malzemesi + Uygulama',
    'Ege Bölgesi Genelinde Hizmet',
    'Farklı Usta Disiplinleri',
    'Keşif & Teklif Süreci',
    'Tek Muhatap',
  ];
  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-[1240px] px-5 py-5 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {items.map((item, i) => (
            <span key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">
              {i > 0 && <span className="hidden sm:inline text-[hsl(var(--border))]">|</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- BRAND POSITION ----------------------------- */
function AboutSection() {
  return (
    <section id="hakkimizda" className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div>
          <p className="eyebrow">Kurumsal</p>
          <h2 className="mt-5 font-display text-4xl leading-[.92] md:text-6xl">Bir yapı marketten<br /><em>daha fazlası.</em></h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            2M Yapı Market Proje; malzeme tedariki, uygulama, tadilat ve yapı hizmetlerini aynı organizasyon altında bir araya getirir.
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Farklı iş kalemlerini tek tek yönetmek yerine, ihtiyaca göre süreci bütün olarak planlıyoruz.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="border border-[hsl(var(--border))] px-4 py-2 text-[11px] font-bold uppercase tracking-[.08em]">Merkez: Kuşadası</span>
            <span className="border border-[hsl(var(--primary))] px-4 py-2 text-[11px] font-bold uppercase tracking-[.08em] text-[hsl(var(--primary))]">Hizmet: Ege Bölgesi</span>
          </div>
        </div>
        <div className="relative">
          <ServiceImage src={HERO_IMG} alt="Yapı uygulaması" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div className="absolute -left-3 -bottom-3 h-16 w-16 border-2 border-[hsl(var(--primary)/.3)]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------- UYGULAMA ALANLARI -------------------------- */
function Showcase() {
  return (
    <section id="uygulama" className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Hizmet Alanlarımız</p>
          <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Uygulama<br /><em>grupları.</em></h2>
        </div>
        <Link href="/hizmetler" className="group inline-flex items-center gap-2 border-b border-[hsl(var(--border))] pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors">Tüm hizmetleri gör <ArrowRight size={13} /></Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceGroups.map((group) => {
          const firstService = services.find(s => group.services.some(gs => s.name.includes(gs.split(' ')[0])));
          return (
            <Link key={group.id} href={firstService?.href || '/hizmetler'} className="group border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all hover:border-[hsl(var(--primary)/.5)]">
              <h3 className="text-lg font-bold tracking-[-.02em]">{group.name}</h3>
              <p className="mt-3 text-xs leading-6 text-[hsl(var(--muted-foreground))]">{group.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {group.services.slice(0, 4).map((s) => (
                  <span key={s} className="border border-[hsl(var(--border))] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.06em] text-[hsl(var(--muted-foreground))]">{s}</span>
                ))}
                {group.services.length > 4 && <span className="px-1 py-0.5 text-[9px] font-bold text-[hsl(var(--muted-foreground))]">+{group.services.length - 4}</span>}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] group-hover:gap-2.5 transition-all">İncele <ArrowRight size={12} /></span>
            </Link>
          );
        })}
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
        <p className="eyebrow text-[hsl(var(--background)/.4)]">Hizmetlerimiz</p>
        <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">İhtiyacınız neyse,<br /><em>oradan başlayalım.</em></h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="border-t border-[hsl(var(--background)/.12)]">
            {services.map((s, i) => {
              const isAct = s.id === activeId;
              const SIcon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-[hsl(var(--background)/.12)] py-4 text-left transition-colors ${isAct ? 'text-[hsl(var(--primary))]' : 'hover:text-[hsl(var(--background)/.7)]'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono-brand text-[10px] opacity-50">{String(i + 1).padStart(2, '0')}</span>
                    <SIcon size={16} />
                    <span className="text-lg font-bold tracking-[-.02em]">{s.name}</span>
                  </span>
                  <ArrowRight size={16} className={`shrink-0 transition ${isAct ? 'opacity-100' : 'opacity-20'}`} />
                </button>
              );
            })}
          </div>
          <div className="relative overflow-hidden">
            <ServiceImage key={active.id} src={active.image} alt={active.imageAlt} className="aspect-[4/5] w-full object-cover transition-opacity duration-500" loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--foreground)/.8)] p-5 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{CATEGORY_LABELS[active.category]}</p>
              <h3 className="mt-1 font-display text-2xl">{active.name}</h3>
              <p className="mt-2 text-xs leading-6 opacity-75">{active.short}</p>
              <Link href={active.href} className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Hizmeti incele <ArrowRight size={11} /></Link>
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
          <p className="eyebrow">Avantaj</p>
          <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Malzeme. Usta.<br /><em>Uygulama.</em><br />Tek muhatap.</h2>
        </div>
        <div className="border-t border-[hsl(var(--border))]">
          {rows.map(([t, d]) => (
            <div key={t} className="grid gap-2 border-b border-[hsl(var(--border))] py-5 sm:grid-cols-[140px_1fr]">
              <h3 className="text-base font-bold text-[hsl(var(--primary))]">{t}</h3>
              <p className="text-xs leading-6 text-[hsl(var(--muted-foreground))]">{d}</p>
            </div>
          ))}
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 border border-[hsl(var(--primary))] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors">WhatsApp'tan yaz <MessageCircle size={13} /></a>
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
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="eyebrow">Nasıl Çalışıyoruz</p>
            <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Net süreç,<br /><em>kontrollü uygulama.</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">İhtiyaçtan teslimatна kadar her adım planlı ve şeffaf ilerler. Tek muhatap, net takip.</p>
          </div>
          <div className="border-t border-[hsl(var(--border))]">
            {processSteps.map(([num, title, text]) => (
              <article key={num} className="grid gap-3 border-b border-[hsl(var(--border))] py-5 sm:grid-cols-[50px_1fr]">
                <span className="font-mono-brand text-sm font-bold text-[hsl(var(--primary))]">{num}</span>
                <div><h3 className="text-lg font-bold tracking-[-.02em]">{title}</h3><p className="mt-1.5 text-xs leading-6 text-[hsl(var(--muted-foreground))]">{text}</p></div>
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
          <p className="eyebrow">Dönüşüm</p>
          <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Değişimi<br /><em>görün.</em></h2>
          <p className="mt-6 max-w-md text-xs leading-7 text-[hsl(var(--muted-foreground))]">Doğru uygulamanın bir yapıda yaratabileceği dönüşümü inceleyin. Her proje, mevcut alanın değerlendirilmesiyle başlar.</p>
          <Link href="/iletisim" className="mt-5 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Keşif iste <ArrowRight size={12} /></Link>
        </div>
        <div className="relative overflow-hidden">
          <ServiceImage src={beforeAfter.image} alt={beforeAfter.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
            <p className="font-mono-brand text-[10px] text-white/70">{beforeAfter.label}</p>
            <p className="mt-1 text-xs font-bold text-white">Tadilat ve yenileme uygulaması</p>
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
        <p className="eyebrow">Hizmet Bölgemiz</p>
        <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Kuşadası merkezli.<br /><em>Tüm Ege Bölgesi.</em></h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">Aydın, İzmir, Muğla, Manisa, Denizli ve Ege Bölgesi genelindeki proje ve uygulama taleplerini işin kapsamına göre değerlendiriyoruz.</p>
        <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors">Projenizi anlatın <ArrowRight size={14} /></Link>
        <p className="mt-6 font-mono-brand text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">
          {CONTACT.serviceProvinces.join(' · ')} ve Ege Bölgesi
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ STORE / MAP -------------------------------- */
function StoreSection() {
  return (
    <section className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-50">Merkezimiz</p>
          <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Merkezimiz<br /><em>Kuşadası'nda.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 opacity-70">Soğucak'taki merkezimizden Ege Bölgesi genelindeki yapı ve uygulama taleplerini değerlendiriyoruz.</p>
          <p className="mt-6 text-sm font-bold">2M Yapı Market Proje Bianca</p>
          <p className="mt-2 text-xs opacity-70">TNR Corner Loft</p>
          <p className="text-xs opacity-70">Soğucak, Kuşadası Davutlar Yolu No:75</p>
          <p className="text-xs opacity-70">09400 Kuşadası / AYDIN</p>
          <p className="mt-3 text-sm">{CONTACT.phoneDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={BUSINESS.mapsDirections} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors">Yol Tarifi <ArrowRight size={13} /></a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 border border-[hsl(var(--background)/.2)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] hover:bg-[hsl(var(--background)/.1)] transition-colors">Telefon <Phone size={13} /></a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--background)/.2)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] hover:bg-[hsl(var(--background)/.1)] transition-colors">WhatsApp <MessageCircle size={13} /></a>
          </div>
        </div>
        <div className="aspect-square min-h-[280px] border border-[hsl(var(--background)/.1)]">
          <iframe title="2M Yapı Market Kuşadası merkez konumu" src={BUSINESS.mapsEmbed} className="h-full w-full border-0 grayscale opacity-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
        <p className="eyebrow">Güvence</p>
        <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Google'daki<br /><em>yorumlarımızı</em> inceleyin.</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">İşletmemizi Google'da bulabilir, yorumları okuyabilir ve bize ulaşabilirsiniz.</p>
        <a
          href={BUSINESS.googleProfile || `https://www.google.com/search?q=${encodeURIComponent(SITE.name + ' Kuşadası')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] transition-colors"
        >
          Google'da gör <ArrowRight size={13} />
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
        <p className="eyebrow">Sorular</p>
        <h2 className="mt-4 font-display text-4xl leading-[.92] md:text-6xl">Aklınızdaki<br /><em>sorular.</em></h2>
      </div>
      <div className="mt-10 border-t border-[hsl(var(--border))]">
        {faqItems.map(([q, a], i) => (
          <div key={q} className="border-b border-[hsl(var(--border))]">
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-base font-bold">
              <span>{q}</span><ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180 text-[hsl(var(--primary))]' : ''}`} />
            </button>
            {open === i && <p className="max-w-2xl pb-5 text-xs leading-7 text-[hsl(var(--muted-foreground))]">{a}</p>}
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
      <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-60">Başlayalım</p>
      <h2 className="mt-5 font-display text-4xl leading-[.92] md:text-6xl">Projenizi<br /><em>birlikte değerlendirelim.</em></h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-80">Yapılacak işi ve bulunduğunuz bölgeyi paylaşın. İhtiyacı değerlendirip size uygun uygulama sürecini konuşalım.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[hsl(var(--foreground))] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--background))] hover:bg-[hsl(var(--foreground)/.9)] transition-colors">Keşif / Teklif Al <ArrowRight size={14} /></Link>
        <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--primary-foreground)/.3)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] hover:bg-[hsl(var(--primary-foreground)/.1)] transition-colors"><MessageCircle size={14} /> WhatsApp</a>
      </div>
      <a href={`tel:${CONTACT.phoneRaw}`} className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">{CONTACT.phoneDisplay}</a>
    </section>
  );
}

/* --------------------------------- HOME ----------------------------------- */
function Home() {
  return (
    <>
      <Meta
        title="2M Yapı Market Proje | Ege Bölgesi Yapı & Tadilat Hizmetleri"
        description={SITE.description}
      />
      <main>
        <Hero />
        <TrustStrip />
        <AboutSection />
        <Showcase />
        <ProcessSection />
        <ServicesSection />
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
const GaleriPage = lazy(() => import('@/pages/galeri'));
const BlogPage = lazy(() => import('@/pages/blog'));
const BlogDetailPage = lazy(() => import('@/pages/blog-detail'));

/* -------------------------------- ROUTER ----------------------------------- */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hizmetler" component={ServicesPage} />
      <Route path="/uygulamalar" component={ApplicationsPage} />
      <Route path="/galeri" component={GaleriPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/iletisim" component={ContactPage} />
      {services.map((s) => <Route key={s.id} path={s.href} component={ServiceDetail} />)}
      <Route path="/admin" component={AdminApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

/* --------------------------------- ADMIN ---------------------------------- */
import { AuthProvider, useAuth } from '@/pages/admin/auth-context';
import { AdminLogin } from '@/pages/admin/login';
import { AdminLayout } from '@/pages/admin/layout';
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminServicesPage } from '@/pages/admin/services';
import { AdminSettingsPage } from '@/pages/admin/settings';
import { AdminLeadsPage } from '@/pages/admin/leads';
import { AdminBlogPage } from '@/pages/admin/blog';
import { AdminFaqsPage } from '@/pages/admin/faqs';
import { AdminApplicationsPage } from '@/pages/admin/applications';
import { AdminGalleriesPage } from '@/pages/admin/galleries';
import { AdminMediaPage } from '@/pages/admin/media';
import { AdminNavigationPage } from '@/pages/admin/navigation';
import { AdminAccountPage } from '@/pages/admin/account';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin border-2 border-[hsl(var(--primary))] border-t-transparent" /></div>;
  if (!user) return <AdminLogin />;
  return <AdminLayout>{children}</AdminLayout>;
}

function AdminRoutes() {
  return (
    <AdminGuard>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/services" component={AdminServicesPage} />
        <Route path="/admin/applications" component={AdminApplicationsPage} />
        <Route path="/admin/faqs" component={AdminFaqsPage} />
        <Route path="/admin/galleries" component={AdminGalleriesPage} />
        <Route path="/admin/media" component={AdminMediaPage} />
        <Route path="/admin/blog" component={AdminBlogPage} />
        <Route path="/admin/navigation" component={AdminNavigationPage} />
        <Route path="/admin/leads" component={AdminLeadsPage} />
        <Route path="/admin/settings" component={AdminSettingsPage} />
        <Route path="/admin/account" component={AdminAccountPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminGuard>
  );
}

function AdminApp() {
  return <AuthProvider><AdminRoutes /></AuthProvider>;
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
