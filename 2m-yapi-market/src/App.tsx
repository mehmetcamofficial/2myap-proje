import { useEffect, useState } from 'react';
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
import { BeforeAfter } from '@/components/before-after';
import { WhatsappWidget } from '@/components/whatsapp-widget';
import { BUSINESS, CONTACT, NAV, SITE, whatsappUrl } from '@/data/site';
import { services, CATEGORY_LABELS } from '@/data/services';
import { beforeAfter, processSteps, faqItems } from '@/data/content';

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

function Mark() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="2M Yap\u0131 Market ana sayfa">
      <span className="relative grid h-10 w-10 place-items-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <span className="absolute inset-[7px] border border-current" />
        <span className="font-mono-brand text-[11px] font-medium">2M</span>
      </span>
      <span className="leading-none">
        <strong className="block text-[15px] tracking-[-.04em]">2M YAPI MARKET</strong>
        <small className="mt-1 block font-mono-brand text-[9px] tracking-[.22em]">PROJE BIANCA \u00B7 KU\u015EADASI</small>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.9)] backdrop-blur-md">
        <div className={`mx-auto flex ${scrolled ? 'h-16' : 'h-20'} max-w-[1240px] items-center justify-between px-5 md:px-8`}>
          <Mark />
          <nav aria-label="Ana men\u00FC" className="hidden items-center gap-6 md:flex">
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
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))]">Ke\u015Fif iste <ArrowRight size={15} /></Link>
          </div>
          <button type="button" aria-label="Men\u00FC a\u00E7" aria-expanded={open} onClick={() => setOpen(!open)} className="p-2 md:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      {open && (
        <nav aria-label="Mobil men\u00FC" className="fixed inset-0 z-50 flex flex-col justify-between bg-[hsl(var(--foreground))] px-7 py-8 text-[hsl(var(--background))]">
          <button type="button" aria-label="Men\u00FC kapat" onClick={() => setOpen(false)} className="self-end"><X size={26} /></button>
          <div className="flex flex-col gap-2">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] opacity-60">ANA MEN\u00DC</p>
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
            <p className="text-xs opacity-70">Merkez: Ku\u015Fadas\u0131 \u00B7 Hizmet: Ege B\u00F6lgesi</p>
          </div>
        </nav>
      )}
    </>
  );
}
function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:px-8">
        <div>
          <Mark />
          <p className="mt-6 max-w-sm text-sm leading-7 text-[hsl(var(--accent-foreground)/.72)]">Merkezimiz Ku\u015Fadas\u0131\u2019nda. Tadilat, yap\u0131 ve uygulama i\u015Flerini Ege B\u00F6lgesi genelinde tek muhatapta y\u00FCr\u00FCt\u00FCyoruz.</p>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">K\u0131sayollar</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/hizmetler">Hizmetler</Link>
            <Link href="/uygulamalar">Uygulamalar</Link>
            <Link href="/iletisim">\u0130leti\u015Fim & Ke\u015Fif</Link>
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">Hizmetler</p>
          <div className="mt-4 grid gap-3 text-sm">
            {services.slice(0, 5).map((s) => <Link key={s.id} href={s.href}>{s.name}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em]">\u0130leti\u015Fim</p>
          <div className="mt-4 text-sm leading-7 text-[hsl(var(--accent-foreground)/.8)]">
            <p>2M Yap\u0131 Market Proje Bianca</p>
            <p>TNR Corner Loft</p>
            <p>Ku\u015Fadas\u0131 Davutlar Yolu No:75</p>
            <p>So\u011Fucak \u00B7 09400 Ku\u015Fadas\u0131 / AYDIN</p>
            <a href={`tel:${CONTACT.phoneRaw}`} className="mt-3 inline-block py-1">{CONTACT.phoneDisplay}</a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 py-1"><MessageCircle size={15} /> WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-[hsl(var(--accent-foreground)/.14)] px-5 py-5 font-mono-brand text-[10px] md:flex-row md:justify-between md:px-8">
        <span>\u00A9 {SITE.name}</span>
        <span>Ku\u015Fadas\u0131 merkez \u00B7 T\u00FCm Ege B\u00F6lgesi</span>
      </div>
    </footer>
  );
}

function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-45 grid grid-cols-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <a href={`tel:${CONTACT.phoneRaw}`} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase"><Phone size={16} /> Ara</a>
      <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase"><MessageCircle size={16} /> WhatsApp</a>
      <Link href="/iletisim" className="flex flex-col items-center justify-center gap-1 bg-[hsl(var(--primary))] py-2.5 text-[10px] font-bold uppercase text-[hsl(var(--primary-foreground))]"><ArrowRight size={16} /> Ke\u015Fif iste</Link>
    </div>
  );
}
/* -------------------------------- HERO ------------------------------------ */
const HERO_IMG = 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600';

function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <ServiceImage src={HERO_IMG} alt="Villa ve d\u0131\u015F mek\u00E2n uygulamas\u0131na dair g\u00F6rsel" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
      <div className="absolute inset-0 bg-[hsl(var(--accent))] opacity-40" />
      <div className="absolute inset-0 architectural-lines opacity-30" />
      <div className="relative mx-auto max-w-[1240px] px-5 pt-20 pb-24 md:px-8">
        <p className="font-mono-brand text-[11px] tracking-[.28em] uppercase text-[hsl(var(--accent-foreground))]">2M YAPI MARKET PROJE \u00B7 KU\u015EADASI</p>
        <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] leading-[.85] tracking-[-.04em] text-[hsl(var(--background))]">
          Tadilat, \u00E7elik,<br />\u00E7at\u0131 & <em>havuz</em><br />tek noktada.
        </h1>
        <p className="mt-8 max-w-[560px] text-lg leading-8 text-[hsl(var(--background)/.85)]">Malzemeden uygulamaya; \u00E7at\u0131, pergola, \u00E7elik ve tadilat i\u015Flerini tek muhatapta y\u00FCr\u00FCt\u00FCyoruz. T\u00FCm Ege B\u00F6lgesi\u2019nde hizmet.</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/iletisim" className="inline-flex items-center gap-3 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlat\u0131n <ArrowRight size={16} /></Link>
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[hsl(var(--background)/.4)] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--background))]"><MessageCircle size={16} /> WhatsApp</a>
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--background)/.8)]">
          <Phone size={15} /> <a href={`tel:${CONTACT.phoneRaw}`} className="underline decoration-[hsl(var(--background)/.4)] underline-offset-2">{CONTACT.phoneDisplay}</a>
          <span className="opacity-60">\u00B7</span>
          <span className="font-mono-brand text-[11px] tracking-[.16em] uppercase opacity-90">Ku\u015Fadas\u0131 merkezli \u00B7 T\u00FCm Ege B\u00F6lgesi</span>
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
          <p className="eyebrow">01 \u2014 MALZEME \u00B7 USTA \u00B7 UYGULAMA</p>
          <h2 className="mt-5 font-display text-5xl leading-[.9] md:text-7xl">Malzeme. Usta.<br /><em>Uygulama.</em><br />Tek muhatap.</h2>
          <p className="mt-8 max-w-md text-base leading-8 text-[hsl(var(--muted-foreground))]">2M Yap\u0131 Market Proje Bianca; malzeme, uygulama ve proje i\u015Fini tek muhatapta toplar. Merkezimiz Ku\u015Fadas\u0131\u2019nda, hizmet alan\u0131m\u0131z t\u00FCm Ege B\u00F6lgesi.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="border border-[hsl(var(--border))] px-4 py-2 text-sm">Merkez: Ku\u015Fadas\u0131</span>
            <span className="border border-[hsl(var(--primary))] px-4 py-2 text-sm text-[hsl(var(--primary))]">Hizmet: Ege B\u00F6lgesi</span>
          </div>
        </div>
        <div className="relative">
          <ServiceImage src={HERO_IMG} alt="D\u0131\u015F mek\u00E2n ve yap\u0131 uygulamas\u0131na dair g\u00F6rsel" className="aspect-[4/5] w-full object-cover" loading="lazy" />
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
          <p className="eyebrow">02 \u2014 UYGULAMA ALANLARI</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Neler<br /><em>yap\u0131yoruz?</em></h2>
        </div>
        <Link href="/uygulamalar" className="group inline-flex items-center gap-2 border-b border-[hsl(var(--border))] pb-1 text-xs font-extrabold uppercase tracking-[.13em]">T\u00FCm uygulamalar\u0131 g\u00F6r <ArrowRight size={15} /></Link>
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
              <Link href={s.href} className="mt-4 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Detay\u0131 g\u00F6r <ArrowRight size={14} /></Link>
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
        <p className="eyebrow text-[hsl(var(--background)/.5)]">03 \u2014 H\u0130ZMETLER</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">\u0130htiyac\u0131n\u0131z neyse,<br /><em>oradan ba\u015Flayal\u0131m.</em></h2>
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
    ['Malzeme', 'Yap\u0131 ve yenileme malzemesini do\u011Fru kaynaktan, i\u015Fin ihtiyac\u0131na g\u00F6re temin ediyoruz.'],
    ['Usta', '\u0130\u015Fini bilen ekiplerle sahada d\u00FCzenli ve kontroll\u00FC ilerliyoruz.'],
    ['Uygulama', 'Kapsam\u0131 netle\u015Ftirip i\u015Fi planl\u0131 bi\u00E7imde uyguluyor, s\u00FCreci takip ediyoruz.'],
  ];
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div>
          <p className="eyebrow">04 \u2014 AVANTAJ</p>
          <h2 className="mt-4 font-display text-5xl leading-[.88] md:text-7xl">Malzeme. Usta.<br /><em>Uygulama.</em><br />Tek muhatap.</h2>
        </div>
        <div className="border-t border-[hsl(var(--border))]">
          {rows.map(([t, d]) => (
            <div key={t} className="grid gap-2 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[160px_1fr]">
              <h3 className="text-xl font-bold text-[hsl(var(--primary))]">{t}</h3>
              <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">{d}</p>
            </div>
          ))}
          <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 border border-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">WhatsApp\u2019tan yaz <MessageCircle size={15} /></a>
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
            <p className="eyebrow">05 \u2014 YAKLA\u015EIMIMIZ</p>
            <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Karma\u015Fay\u0131<br /><em>azalt\u0131r\u0131z.</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Net bir s\u00FCre\u00E7, do\u011Fru planlama ve tek muhatap. \u0130htiyactan uygulamaya kadar her ad\u0131m\u0131 anla\u015F\u0131l\u0131r \u015Fekilde ilerletiyoruz.</p>
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
          <p className="eyebrow">06 \u2014 \u00D6NCE / SONRA</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">De\u011Fi\u015Fimi<br /><em>g\u00F6r\u00FCn.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Do\u011Fru uygulaman\u0131n bir ya\u015Fam alan\u0131nda yaratabilece\u011Fi de\u011Fi\u015Fimi ke\u015Ffedin.</p>
          <Link href="/iletisim" className="mt-6 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Ke\u015Fif iste <ArrowRight size={14} /></Link>
        </div>
        <BeforeAfter data={beforeAfter} />
      </div>
    </section>
  );
}

/* ------------------------------ SERVICE AREA -------------------------------- */
function ServiceAreaSection() {
  return (
    <section className="bg-[hsl(var(--secondary))]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <p className="eyebrow">H\u0130ZMET B\u00D6LGEML\u0130Z</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Ku\u015Fadas\u0131\u2019ndan<br /><em>t\u00FCm Ege\u2019ye.</em></h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-[hsl(var(--muted-foreground))]">Merkezimiz Ku\u015Fadas\u0131\u2019nda. Tadilat, yap\u0131 ve uygulama i\u015Fleri i\u00E7in Ege B\u00F6lgesi genelinde projeleri de\u011Ferlendiriyoruz.</p>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">\u0130\u015Fin kapsam\u0131na ve bulundu\u011Funuz b\u00F6lgeye g\u00F6re ke\u015Fif ve uygulama planlamas\u0131 yap\u0131yoruz.</p>
        <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlat\u0131n <ArrowRight size={16} /></Link>
        <p className="mt-8 font-mono-brand text-[11px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
          {CONTACT.serviceProvinces.join(' \u00B7 ')} ve Ege B\u00F6lgesi
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
          <p className="font-mono-brand text-[11px] uppercase tracking-[.25em] opacity-70">07 \u2014 MERKEZ\u0130M\u0130Z</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Merkezimiz<br /><em>Ku\u015Fadas\u0131\u2019nda.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 opacity-80">Bizi yerinde ziyaret edebilir veya Ege B\u00F6lgesi\u2019ndeki projeniz i\u00E7in telefon ve WhatsApp \u00FCzerinden bize ula\u015Fabilirsiniz.</p>
          <p className="mt-6 text-sm font-bold">2M Yap\u0131 Market Proje Bianca</p>
          <p className="mt-2 text-sm">TNR Corner Loft</p>
          <p className="text-sm">So\u011Fucak, Ku\u015Fadas\u0131 Davutlar Yolu No:75</p>
          <p className="text-sm">09400 Ku\u015Fadas\u0131 / AYDIN</p>
          <p className="mt-3 text-sm">{CONTACT.phoneDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={BUSINESS.mapsDirections} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">Yol tarifi al <ArrowRight size={14} /></a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 border border-[hsl(var(--accent-foreground)/.4)] px-5 py-3 text-xs font-bold uppercase tracking-widest">Hemen ara <Phone size={14} /></a>
            <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[hsl(var(--accent-foreground)/.4)] px-5 py-3 text-xs font-bold uppercase tracking-widest">WhatsApp\u2019tan yaz <MessageCircle size={14} /></a>
          </div>
        </div>
        <div className="aspect-square min-h-[280px] border border-[hsl(var(--accent-foreground)/.2)]">
          <iframe title="2M Yap\u0131 Market Ku\u015Fadas\u0131 merkez konumu" src={BUSINESS.mapsEmbed} className="h-full w-full border-0 grayscale" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
        <p className="eyebrow">G\u00DCVENCE</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Google\u2019daki<br /><em>yorumlar\u0131m\u0131z\u0131</em><br />inceleyin.</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">\u0130\u015Fletmemizi Google\u2019da bulabilir, yorumlar\u0131 okuyabilir ve bize ula\u015Fabilirsiniz.</p>
        <a
          href={BUSINESS.googleProfile || `https://www.google.com/search?q=${encodeURIComponent(SITE.name + ' Ku\u015Fadas\u0131')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-xs font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]"
        >
          Google\u2019da g\u00F6r \u2192
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
        <p className="eyebrow">08 \u2014 SORULAR</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Akl\u0131n\u0131zdaki<br /><em>sorular.</em></h2>
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
      <p className="font-mono-brand text-[11px] uppercase tracking-[.26em] opacity-70">09 \u2014 BA\u015ELAYALIM</p>
      <h2 className="mt-5 font-display text-5xl leading-[.9] md:text-7xl">Bir projeniz mi var?<br /><em>Ba\u015Flayal\u0131m.</em></h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-80">Bulundu\u011Funuz b\u00F6lgeyi ve yapt\u0131rmak istedi\u011Finiz i\u015Fi yaz\u0131n; gerisini birlikte netle\u015Ftiririz.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/iletisim" className="inline-flex items-center gap-3 bg-[hsl(var(--foreground))] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[hsl(var(--background))]">Projenizi anlat\u0131n <ArrowRight size={16} /></Link>
        <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[hsl(var(--primary-foreground)/.4)] px-6 py-4 text-xs font-bold uppercase tracking-[.13em]"><MessageCircle size={16} /> WhatsApp\u2019tan yaz</a>
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
        title="2M Yap\u0131 Market Proje | Ege B\u00F6lgesi Tadilat & Yap\u0131 Uygulamalar\u0131"
        description={SITE.description}
      />
      <main>
        <Hero />
        <AboutSection />
        <Showcase />
        <ServicesSection />
        <ProcessSection />
        <BeforeAfterSection />
        <MaterialCraft />
        <ServiceAreaSection />
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
        title="Uygulama Alanlar\u0131 | 2M Yap\u0131 Market Proje | Ege B\u00F6lgesi"
        description="Tadilattan \u00E7elik konstr\u00FCksiyona, \u00E7at\u0131dan havuza kadar farkl\u0131 yap\u0131 i\u015Flerinde malzeme ve uygulamay\u0131 birlikte ele al\u0131yoruz."
        path="/uygulamalar"
      />
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <p className="eyebrow">UYGULAMA ALANLARI</p>
          <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Uygulama<br /><em>alanlar\u0131m\u0131z.</em></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">Tadilattan \u00E7elik konstr\u00FCksiyona, \u00E7at\u0131dan havuza kadar farkl\u0131 yap\u0131 ihtiya\u00E7lar\u0131nda malzeme ve uygulamay\u0131 birlikte ele al\u0131yoruz.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">Merkezimiz Ku\u015Fadas\u0131\u2019nda; Ege B\u00F6lgesi genelindeki projeleri de\u011Ferlendiriyoruz.</p>
          <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">Projenizi anlat\u0131n <ArrowRight size={16} /></Link>
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
                <span className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detay\u0131 g\u00F6r <ArrowRight size={14} /></span>
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
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detay\u0131 g\u00F6r <ArrowRight size={14} /></span>
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
                <span className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detay\u0131 g\u00F6r <ArrowRight size={14} /></span>
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
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest text-white">Detay\u0131 g\u00F6r <ArrowRight size={14} /></span>
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
  return (
    <>
      <Meta title={service.seoTitle} description={service.seoDesc} path={service.href} service={service} />
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Link href="/hizmetler" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]"><ArrowRight size={14} className="rotate-180" /> Hizmetler</Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-2 items-end">
            <div>
              <p className="eyebrow">{CATEGORY_LABELS[service.category]} / EGE B\u00D6LGES\u0130</p>
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
            <p className="eyebrow">Ke\u015Fif al</p>
            <h2 className="mt-4 font-display text-4xl">{service.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Ku\u015Fadas\u0131 merkezliyiz; Ege B\u00F6lgesi genelindeki talepleri de\u011Ferlendiriyoruz.</p>
            <a href={whatsappUrl(service.whatsapp)} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-[hsl(var(--primary-foreground))]"><MessageCircle size={15} /> WhatsApp ke\u015Fif</a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="mt-3 flex items-center justify-center gap-2 border border-[hsl(var(--border))] px-4 py-3 text-xs font-bold uppercase tracking-widest"><Phone size={15} /> {CONTACT.phoneDisplay}</a>
          </div>
        </div>
      </section>
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
      <Meta title="Hizmetler | 2M Yap\u0131 Market Proje | Ege B\u00F6lgesi" description="Tadilat, \u00E7at\u0131, pergola, \u00E7elik konstr\u00FCksiyon, d\u0131\u015F cephe, prefabrik, seramik, tesisat ve havuz uygulamalar\u0131 \u2014 Ku\u015Fadas\u0131 merkezli, Ege B\u00F6lgesi genelinde." path="/hizmetler" />
      <main className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-24">
        <p className="eyebrow">H\u0130ZMETLER</p>
        <h1 className="mt-4 font-display text-6xl leading-[.88] md:text-8xl">Yap\u0131, tadilat<br /> & <em>uygulama.</em></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">Merkezimiz Ku\u015Fadas\u0131\u2019nda. Ege B\u00F6lgesi genelindeki tadilat ve yap\u0131 i\u015Flerini de\u011Ferlendiriyoruz.</p>
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Kategori">
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={`border px-4 py-3 text-xs font-bold uppercase tracking-wider ${cat === c ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'}`}>{c === 'all' ? 'T\u00FCm\u00FC' : CATEGORY_LABELS[c as (typeof services)[0]['category']]}</button>
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
      <Meta title="\u0130leti\u015Fim & Ke\u015Fif | 2M Yap\u0131 Market Proje" description="Ege B\u00F6lgesi\u2019ndeki tadilat ve yap\u0131 i\u015Finiz i\u00E7in ke\u015Fif talebi g\u00F6nderin. Merkezimiz Ku\u015Fadas\u0131\u2019nda." path="/iletisim" />
      <main className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">\u0130LET\u0130\u015E\u0130M / \u0130LK ADIM</p>
            <h1 className="mt-4 font-display text-6xl leading-[.85] md:text-8xl">Projenizi<br /><em>bize b\u0131rak\u0131n.</em></h1>
            <p className="mt-6 max-w-md text-base leading-8 text-[hsl(var(--muted-foreground))]">Yapt\u0131rmak istedi\u011Finiz i\u015Fi ve bulundu\u011Funuz il / il\u00E7eyi yaz\u0131n. Kapsam\u0131 birlikte netle\u015Ftiririz.</p>
            <div className="mt-10 grid gap-4 border-t border-[hsl(var(--border))] pt-6 text-sm">
              <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-3"><Phone size={18} className="text-[hsl(var(--primary))]" /> {CONTACT.phoneDisplay}</a>
              <a href={whatsappUrl(WA_GENERIC)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3"><MessageCircle size={18} className="text-[hsl(var(--primary))]" /> WhatsApp\u2019tan yaz</a>
              <p className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-[hsl(var(--primary))]" /> TNR Corner Loft<br />Ku\u015Fadas\u0131 Davutlar Yolu No:75 \u00B7 So\u011Fucak<br />09400 Ku\u015Fadas\u0131 / AYDIN<br /><span className="mt-2 block text-[hsl(var(--muted-foreground))]">Merkez: Ku\u015Fadas\u0131 \u00B7 Hizmet: Ege B\u00F6lgesi</span></p>
            </div>
          </div>
          <div className="bg-[hsl(var(--card))] p-6 md:p-8">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.22em] text-[hsl(var(--muted-foreground))]">KE\u015E\u0130F TALEB\u0130</p>
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
          <Header />
          <ErrorBoundary><Router /></ErrorBoundary>
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
