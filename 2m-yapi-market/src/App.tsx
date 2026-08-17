import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Route, Switch, useLocation, useRoute } from 'wouter';
import { useCreateQuoteRequest } from '@workspace/api-client-react';
import {
  ArrowDownRight, ArrowRight, Check, ChevronDown, CircleCheck, FileText, Hammer,
  Mail, MapPin, Menu, MessageCircle, Phone, Ruler, Send, ShieldCheck,
  Sparkles, X, Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const PHONE = import.meta.env.VITE_BUSINESS_PHONE || '05437280711';
const WHATSAPP = import.meta.env.VITE_WHATSAPP_PHONE || '905437280711';
const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

const services = [
  { slug: 'kusadasi-tadilat', name: 'Tadilat & yenileme', category: 'İç mekân', description: 'Yaşadığınız alanı doğru plan, malzeme ve uygulama ile baştan ele alalım.', icon: Ruler, accent: 'terracotta' },
  { slug: 'kusadasi-boya-badana', name: 'Boya & badana', category: 'İç mekân', description: 'Renk, yüzey ve temiz uygulama. Küçük dokunuştan kapsamlı yenilemeye.', icon: Sparkles, accent: 'cream' },
  { slug: 'kusadasi-cati-tamiri', name: 'Çatı tamiri', category: 'Dış yapı', description: 'Su alan, yıpranan veya yenilenmesi gereken çatılar için keşif ve uygulama.', icon: ShieldCheck, accent: 'teal' },
  { slug: 'kusadasi-celik-konstruksiyon', name: 'Çelik konstrüksiyon', category: 'Yapısal', description: 'İhtiyaca göre tasarlanan sağlam taşıyıcı çözümler.', icon: Hammer, accent: 'ink' },
  { slug: 'kusadasi-prefabrik', name: 'Prefabrik yapılar', category: 'Yapısal', description: 'Kullanım amacına göre planlanan pratik yapı çözümleri.', icon: FileText, accent: 'cream' },
  { slug: 'kusadasi-konteyner', name: 'Konteyner çözümleri', category: 'Yapısal', description: 'Şantiye, depo veya kullanım alanı için işlevsel konteynerler.', icon: Zap, accent: 'terracotta' },
  { slug: 'kusadasi-mantolama', name: 'Mantolama', category: 'Dış yapı', description: 'Yapının dış kabuğunu iyileştiren, planlı ısı yalıtımı uygulamaları.', icon: ShieldCheck, accent: 'teal' },
  { slug: 'kusadasi-seramik-doseme', name: 'Seramik döşeme', category: 'İç mekân', description: 'Zemin ve duvarlarda ölçülü, temiz, uzun ömürlü uygulama.', icon: Ruler, accent: 'ink' },
  { slug: 'kusadasi-su-tesisatcisi', name: 'Su tesisatı', category: 'Teknik', description: 'Arıza, yenileme ve yeni hat ihtiyaçları için çözüm.', icon: Zap, accent: 'teal' },
  { slug: 'kusadasi-elektrikci', name: 'Elektrik işleri', category: 'Teknik', description: 'Güvenli, düzenli ve ihtiyaca uygun elektrik uygulamaları.', icon: Zap, accent: 'cream' },
  { slug: 'kusadasi-havuz-yapimi', name: 'Havuz yapımı', category: 'Dış alan', description: 'Bahçenize ve kullanımınıza göre planlanan havuz projeleri.', icon: Sparkles, accent: 'terracotta' },
  { slug: 'kusadasi-pergola', name: 'Pergola', category: 'Dış alan', description: 'Gölge, konfor ve açık hava için bahçeye uyumlu çözümler.', icon: Hammer, accent: 'teal' },
];

const areas = ['Kuşadası', 'Soğucak', 'Davutlar', 'Güzelçamlı'];
const faqItems = [
  ['Keşif talebi nasıl ilerliyor?', 'Kısaca neye ihtiyacınız olduğunu ve bulunduğunuz bölgeyi paylaşın. Ekibimiz, uygun iletişim kanalından sizinle detayları netleştirsin.'],
  ['Sadece malzeme mi, uygulama da var mı?', 'Malzeme, usta ve uygulama adımlarını tek bir konuşmada bir araya getirmek için buradayız. İhtiyacınızın kapsamını birlikte belirleriz.'],
  ['Fotoğraf gönderebilir miyim?', 'Evet. Formda en fazla 5 fotoğraf adı paylaşabilirsiniz; WhatsApp üzerinden de alanı gösteren görseller gönderebilirsiniz.'],
  ['Hangi bölgelerde hizmet veriyorsunuz?', 'Kuşadası, Soğucak, Davutlar ve Güzelçamlı odağımızdaki hizmet alanlarıdır.'],
];

type FormValues = {
  name: string; phone: string; service: string; area: string; description: string;
  contactMethod: 'whatsapp' | 'phone'; honeypot?: string;
};
const quoteSchema = z.object({
  name: z.string().min(2, 'Ad soyad en az 2 karakter olmalı.'),
  phone: z.string().min(7, 'Geçerli bir telefon numarası yazın.'),
  service: z.string().min(2, 'Bir hizmet seçin.'),
  area: z.string().min(2, 'Bölgenizi seçin.'),
  description: z.string().min(10, 'İhtiyacınızı en az 10 karakterle anlatın.'),
  contactMethod: z.enum(['whatsapp', 'phone']),
  honeypot: z.string().optional(),
});

function Meta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [title, description]);
  return null;
}

function Logo() {
  return <Link href="/" data-testid="link-logo" className="focus-ring flex items-center gap-3">
    <span className="relative grid h-10 w-10 place-items-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <span className="absolute inset-[7px] border border-current"></span>
      <span className="font-mono-brand text-[11px] font-medium tracking-tighter">2M</span>
    </span>
    <span className="leading-none"><strong className="block text-[15px] tracking-[-.04em]">2M YAPI MARKET</strong><small className="mt-1 block font-mono-brand text-[9px] tracking-[.22em] text-[hsl(var(--muted-foreground))]">PROJE BIANCA</small></span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [['/', 'Ana sayfa'], ['/hizmetler', 'Hizmetler'], ['/iletisim', 'İletişim']];
  return <header className="relative z-30 border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.88)] backdrop-blur-md">
    <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 md:px-8">
      <Logo />
      <nav aria-label="Ana menü" className="hidden items-center gap-8 md:flex">
        {nav.map(([href, label]) => <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`focus-ring text-[12px] font-semibold uppercase tracking-[.12em] transition-colors hover:text-[hsl(var(--primary))] ${location === href ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <a href={whatsappUrl('Merhaba, bir projem için bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" data-testid="link-header-whatsapp" className="focus-ring inline-flex items-center gap-2 border border-[hsl(var(--accent))] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--accent))] transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"><MessageCircle size={15} /> WhatsApp</a>
        <Link href="/iletisim" data-testid="link-header-quote" className="focus-ring inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] transition hover:bg-[hsl(var(--accent))]">Keşif iste <ArrowRight size={15} /></Link>
      </div>
      <button type="button" aria-label="Menüyü aç" aria-expanded={open} data-testid="button-mobile-menu" onClick={() => setOpen(!open)} className="focus-ring p-2 md:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
    {open && <nav aria-label="Mobil menü" className="border-t border-[hsl(var(--border))] px-5 py-4 md:hidden">
      {nav.map(([href, label]) => <Link key={href} href={href} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setOpen(false)} className="focus-ring block border-b border-[hsl(var(--border)/.7)] py-3 text-sm font-semibold">{label}</Link>)}
      <Link href="/iletisim" data-testid="link-mobile-quote" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]">Keşif iste <ArrowRight size={15} /></Link>
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
    <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">
      <div><Logo /><p className="mt-6 max-w-sm text-sm leading-7 text-[hsl(var(--accent-foreground)/.72)]">Malzemeyi, güvenilir uygulamayı ve proje aklını aynı konuşmada buluşturan yerel yapı partneriniz.</p></div>
      <div><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent-foreground)/.55)]">Kısayollar</p><div className="mt-4 grid gap-3 text-sm"><Link href="/hizmetler" data-testid="link-footer-services" className="hover:text-[hsl(var(--primary))]">Hizmetler</Link><Link href="/iletisim" data-testid="link-footer-contact" className="hover:text-[hsl(var(--primary))]">İletişim ve keşif</Link></div></div>
      <div><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent-foreground)/.55)]">Hizmet alanı</p><p data-testid="text-footer-areas" className="mt-4 text-sm leading-7 text-[hsl(var(--accent-foreground)/.72)]">Kuşadası · Soğucak<br />Davutlar · Güzelçamlı</p><Link href="/iletisim" data-testid="link-footer-reach-out" className="mt-4 inline-flex items-center gap-2 text-sm hover:text-[hsl(var(--primary))]"><Mail size={14} /> İletişim formuna git</Link></div>
    </div>
    <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-[hsl(var(--accent-foreground)/.14)] px-5 py-5 font-mono-brand text-[10px] text-[hsl(var(--accent-foreground)/.5)] md:flex-row md:justify-between md:px-8"><span>© 2M Yapı Market Proje Bianca</span><span>Yerel düşünür, doğru uygular.</span></div>
  </footer>;
}

function MobileContactBar() {
  return <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] p-2 backdrop-blur md:hidden">
    {PHONE ? <a href={`tel:${PHONE}`} data-testid="link-mobile-call" className="flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider"><Phone size={16} /> Ara</a> : <Link href="/iletisim" data-testid="link-mobile-call" className="flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider"><Phone size={16} /> Görüşelim</Link>}
    <a href={whatsappUrl('Merhaba, projem için keşif ve fiyat bilgisi almak istiyorum.')} target="_blank" rel="noopener noreferrer" data-testid="link-mobile-whatsapp" className="flex items-center justify-center gap-2 bg-[hsl(var(--primary))] py-3 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary-foreground))]"><MessageCircle size={16} /> WhatsApp</a>
  </div>;
}

function FloatingWhatsApp() {
  return <a href={whatsappUrl('Merhaba, 2M Yapı Market hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile yazış" data-testid="link-floating-whatsapp" className="fixed bottom-20 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[0_8px_24px_rgba(44,70,67,.25)] transition hover:-translate-y-1 md:bottom-7 md:right-7"><MessageCircle size={23} /></a>;
}

function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const mutation = useCreateQuoteRequest();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { contactMethod: 'whatsapp', service: '', area: '', name: '', phone: '', description: '', honeypot: '' },
  });
  const onSubmit = (values: FormValues) => {
    mutation.mutate({ data: { ...values, photoNames, honeypot: values.honeypot || '' } }, {
      onSuccess: (data) => { setSubmittedId(data.id); reset(); setPhotoNames([]); },
    });
  };
  if (submittedId) return <div data-testid="status-quote-success" className="flex min-h-[360px] flex-col justify-center bg-[hsl(var(--accent))] p-8 text-[hsl(var(--accent-foreground))]">
    <CircleCheck size={38} className="mb-5 text-[hsl(var(--primary))]" /><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent-foreground)/.6)]">Talebiniz alındı</p><h3 className="mt-3 font-display text-4xl">Konuşmaya hazırız.</h3><p className="mt-4 text-sm leading-7 text-[hsl(var(--accent-foreground)/.75)]">İsteğiniz kayıt altına alındı. Tercih ettiğiniz iletişim kanalından size dönüş yapacağız.</p><button type="button" data-testid="button-new-quote" onClick={() => setSubmittedId(null)} className="mt-7 inline-flex w-fit items-center gap-2 border border-[hsl(var(--accent-foreground)/.35)] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--accent-foreground)/.1)]">Yeni talep <ArrowRight size={14} /></button>
  </div>;
  return <form onSubmit={handleSubmit(onSubmit)} data-testid={`form-quote-${compact ? 'compact' : 'main'}`} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-xs font-bold">Ad soyad<input {...register('name')} data-testid="input-quote-name" placeholder="Adınız ve soyadınız" className="form-input" />{errors.name && <span data-testid="error-quote-name" className="form-error">{errors.name.message}</span>}</label>
      <label className="grid gap-2 text-xs font-bold">Telefon<input {...register('phone')} data-testid="input-quote-phone" placeholder="05xx xxx xx xx" className="form-input" />{errors.phone && <span data-testid="error-quote-phone" className="form-error">{errors.phone.message}</span>}</label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-xs font-bold">Hizmet<select {...register('service')} data-testid="select-quote-service" className="form-input"><option value="">Hizmet seçin</option>{services.map(s => <option key={s.slug} value={s.name}>{s.name}</option>)}</select>{errors.service && <span className="form-error">{errors.service.message}</span>}</label>
      <label className="grid gap-2 text-xs font-bold">Bölge<select {...register('area')} data-testid="select-quote-area" className="form-input"><option value="">Bölgenizi seçin</option>{areas.map(area => <option key={area} value={area}>{area}</option>)}</select>{errors.area && <span className="form-error">{errors.area.message}</span>}</label>
    </div>
    <label className="grid gap-2 text-xs font-bold">İhtiyacınız nedir?<textarea {...register('description')} data-testid="textarea-quote-description" rows={compact ? 3 : 4} placeholder="Mekânı, yapılacak işi veya mevcut durumu kısaca anlatın." className="form-input resize-none" />{errors.description && <span data-testid="error-quote-description" className="form-error">{errors.description.message}</span>}</label>
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-xs font-bold">Nasıl ulaşalım?</span>
      <label className="flex items-center gap-2 text-xs"><input {...register('contactMethod')} value="whatsapp" type="radio" data-testid="radio-contact-whatsapp" className="accent-[hsl(var(--primary))]" /> WhatsApp</label>
      <label className="flex items-center gap-2 text-xs"><input {...register('contactMethod')} value="phone" type="radio" data-testid="radio-contact-phone" className="accent-[hsl(var(--primary))]" /> Telefon</label>
    </div>
    <label className="group flex cursor-pointer items-center gap-3 border border-dashed border-[hsl(var(--border))] px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]"><FileText size={16} /><span>{photoNames.length ? `${photoNames.length} fotoğraf seçildi` : 'İsterseniz fotoğraf ekleyin (en fazla 5)'}</span><input type="file" accept="image/*" multiple data-testid="input-quote-photos" className="hidden" onChange={e => setPhotoNames(Array.from(e.target.files || []).slice(0, 5).map(file => file.name))} /></label>
    <input {...register('honeypot')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" data-testid="input-quote-honeypot" />
    {mutation.isError && <div role="alert" data-testid="status-quote-error" className="border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.06)] px-3 py-2 text-xs text-[hsl(var(--destructive))]">Talebiniz gönderilemedi. Lütfen tekrar deneyin veya WhatsApp üzerinden yazın.</div>}
    <button type="submit" disabled={mutation.isPending} data-testid="button-submit-quote" className="flex w-full items-center justify-center gap-2 bg-[hsl(var(--primary))] px-5 py-4 text-xs font-extrabold uppercase tracking-[.14em] text-[hsl(var(--primary-foreground))] transition hover:bg-[hsl(var(--accent))] disabled:cursor-wait disabled:opacity-60">{mutation.isPending ? 'Gönderiliyor...' : 'Keşif talebi gönder'} <Send size={15} /></button>
    <p className="text-[10px] leading-5 text-[hsl(var(--muted-foreground))]">Bilgilerinizi yalnızca talebinizle ilgili iletişim kurmak için kullanırız.</p>
  </form>;
}

function Hero() {
  return <section className="relative overflow-hidden bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
    <div className="blueprint-grid absolute inset-0 opacity-40"></div>
    <div className="architectural-lines absolute inset-0 opacity-60"></div>
    <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:px-8 md:pb-24 md:pt-20">
      <div className="reveal">
        <p data-testid="text-hero-kicker" className="font-mono-brand text-[10px] uppercase tracking-[.26em] text-[hsl(var(--accent-foreground)/.65)]">KUŞADASI VE ÇEVRESİ / YAPI & PROJE</p>
        <h1 data-testid="heading-hero" className="mt-6 max-w-[680px] font-display text-[clamp(4rem,8vw,7.7rem)] leading-[.84] tracking-[-.045em]">İyi iş,<br /><em className="text-[hsl(var(--primary))]">doğru</em> konuşmayla<br />başlar.</h1>
        <p data-testid="text-hero-description" className="mt-8 max-w-[490px] text-base leading-8 text-[hsl(var(--accent-foreground)/.74)] md:text-lg">Malzemeyi, güvenilir uygulamayı ve proje aklını tek bir yerde buluşturuyoruz. Eviniz, iş yeriniz veya planınızdaki yeni yapı için ilk adımı birlikte atalım.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/iletisim" data-testid="link-hero-quote" className="focus-ring inline-flex items-center gap-3 bg-[hsl(var(--primary))] px-5 py-4 text-xs font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))] transition hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--foreground))]">Projemi anlatayım <ArrowDownRight size={16} /></Link>
          <a href={whatsappUrl('Merhaba, Kuşadası bölgesinde bir yapı projem var. Bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" data-testid="link-hero-whatsapp" className="focus-ring inline-flex items-center gap-3 border border-[hsl(var(--accent-foreground)/.35)] px-5 py-4 text-xs font-extrabold uppercase tracking-[.12em] transition hover:bg-[hsl(var(--accent-foreground)/.1)]"><MessageCircle size={16} /> WhatsApp’tan yaz</a>
        </div>
      </div>
      <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[470px]">
        <div className="absolute -right-3 -top-3 h-full w-full border border-[hsl(var(--primary)/.5)] md:-right-5 md:-top-5"></div>
        <div className="relative bg-[hsl(var(--background))] p-5 text-[hsl(var(--foreground))] shadow-[0_25px_70px_rgba(0,0,0,.18)] md:p-7">
          <div className="mb-6 flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="font-mono-brand text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">PROJE NOTU / 01</span><span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]"></span></div>
          <p className="font-display text-4xl leading-none md:text-5xl">Bir fikriniz mi var?<br /><em>Birlikte netleştirelim.</em></p>
          <div className="mt-8 grid grid-cols-2 border-t border-[hsl(var(--border))] pt-5"><div><p className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">NEREDE?</p><p className="mt-2 text-sm font-bold">Kuşadası ve çevresi</p></div><div><p className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">NASIL?</p><p className="mt-2 text-sm font-bold">Malzeme + uygulama</p></div></div>
          <div className="mt-8 flex items-center gap-3 bg-[hsl(var(--secondary))] p-3"><span className="grid h-9 w-9 place-items-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Ruler size={17} /></span><span className="text-xs leading-5">İhtiyacınıza göre ilk çerçeveyi<br /><strong>tek bir görüşmede</strong> kuralım.</span></div>
        </div>
      </div>
    </div>
    <div className="relative mx-auto flex max-w-[1240px] items-center gap-4 px-5 pb-7 font-mono-brand text-[10px] uppercase tracking-[.18em] text-[hsl(var(--accent-foreground)/.5)] md:px-8"><span className="h-px w-12 bg-current"></span> Yerel erişim · net iletişim · birlikte çözüm</div>
  </section>;
}

function ServicePreview() {
  return <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">01 — HİZMETLER</p><h2 data-testid="heading-services-preview" className="mt-4 max-w-xl font-display text-5xl leading-[.92] md:text-7xl">İhtiyacınız neyse,<br /><em>oradan başlayalım.</em></h2></div><Link href="/hizmetler" data-testid="link-all-services" className="focus-ring group inline-flex items-center gap-3 pb-1 text-xs font-extrabold uppercase tracking-[.13em]">Tüm hizmetleri gör <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link></div>
    <div className="mt-12 grid border-t border-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, 6).map((service, index) => { const Icon = service.icon; return <Link href={`/${service.slug}`} key={service.slug} data-testid={`card-service-${service.slug}`} className="hover-lift group relative border-b border-r border-[hsl(var(--border))] p-6 md:p-7"><span className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">0{index + 1}</span><span className={`service-icon service-icon-${service.accent}`}><Icon size={20} /></span><h3 className="mt-12 text-xl font-bold tracking-[-.03em]">{service.name}</h3><p className="mt-3 max-w-[260px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">{service.description}</p><span className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] opacity-0 transition group-hover:opacity-100">Detay <ArrowRight size={13} /></span></Link>; })}
    </div>
  </section>;
}

function MethodSection() {
  const steps = [['01', 'Dinliyoruz', 'İhtiyacınızı, kullanımınızı ve bulunduğunuz yeri anlamadan öneri sunmuyoruz.'], ['02', 'Çerçeveliyoruz', 'Malzeme, iş kapsamı ve uygulama adımlarını anlaşılır bir plan haline getiriyoruz.'], ['03', 'Birlikte ilerliyoruz', 'Karar verdiğinizde, doğru ekip ve doğru malzeme ile süreci takip ediyoruz.']];
  return <section className="bg-[hsl(var(--secondary))]"><div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28"><div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">02 — YAKLAŞIMIMIZ</p><h2 data-testid="heading-method" className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Karmaşayı<br /><em>azaltırız.</em></h2><p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">İyi bir iş, sadece iyi malzemeyle değil; doğru sorular, açık kapsam ve düzenli iletişimle tamamlanır.</p></div><div className="grid gap-0 border-t border-[hsl(var(--border))]">{steps.map(([num, title, text]) => <article key={num} data-testid={`article-method-${num}`} className="grid gap-4 border-b border-[hsl(var(--border))] py-7 sm:grid-cols-[70px_1fr]"><span className="font-mono-brand text-xs text-[hsl(var(--primary))]">{num}</span><div><h3 className="text-2xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-2 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">{text}</p></div></article>)}</div></div></div></section>;
}

function AreasSection() {
  return <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28"><div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end"><div><p className="eyebrow">03 — YAKININIZDA</p><h2 data-testid="heading-areas" className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Aynı kıyıda,<br /><em>aynı özenle.</em></h2></div><div><p className="max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">Kuşadası’nın mahallelerini, yazlık ritmini ve yapı ihtiyaçlarını yerel bir partner olmanın sorumluluğuyla ele alıyoruz.</p><div className="mt-8 flex flex-wrap gap-2">{areas.map((area, i) => <span key={area} data-testid={`badge-area-${i}`} className="border border-[hsl(var(--border))] px-4 py-3 text-sm font-bold">{area}</span>)}</div></div></div></section>;
}

function QuoteSection() {
  return <section id="quote" className="bg-[hsl(var(--secondary))]"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 md:grid-cols-[.85fr_1.15fr] md:items-start md:px-8 md:py-28"><div className="md:sticky md:top-8"><p className="eyebrow">04 — KONUŞALIM</p><h2 data-testid="heading-home-quote" className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Bir form,<br /><em>çok netlik.</em></h2><p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">Projenizin bütün detaylarını ilk mesajda bilmek zorunda değilsiniz. Bildiklerinizi yazın, doğru sorularla devam edelim.</p><div className="mt-8 flex gap-3 text-[hsl(var(--primary))]"><span className="grid h-9 w-9 place-items-center border border-current"><CircleCheck size={16} /></span><span className="max-w-[220px] text-xs font-bold leading-5 text-[hsl(var(--foreground))]">Talebiniz ekibe ulaşır, siz tercih ettiğiniz kanaldan dönüş beklersiniz.</span></div></div><div className="bg-[hsl(var(--background))] p-5 md:p-8"><div className="mb-7 flex items-center justify-between border-b border-[hsl(var(--border))] pb-5"><h3 className="font-display text-3xl">Keşif talebi</h3><span className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">FORM / 02</span></div><QuoteForm /></div></div></section>;
}

function PlaceholderProjects() {
  const projects = [['01', 'Konut yenileme', 'Kuşadası', 'İç mekân'], ['02', 'Dış alan fikri', 'Davutlar', 'Pergola / havuz'], ['03', 'Yapı çözümü', 'Soğucak', 'Prefabrik / çelik']];
  return <section className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"><div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--background)/.5)]">04 — PROJE ALANI</p><h2 data-testid="heading-projects" className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Buraya sizin<br /><em>projeniz gelebilir.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[hsl(var(--background)/.6)]">Yakında gerçek uygulama hikâyeleriyle güncellenecek. Şimdilik fikirlerinize yer açıyoruz.</p></div><div className="mt-12 grid gap-3 md:grid-cols-3">{projects.map(([num, title, location, service]) => <div key={num} data-testid={`card-project-placeholder-${num}`} className="group min-h-[270px] border border-[hsl(var(--background)/.2)] p-5 transition hover:border-[hsl(var(--primary))]"><div className="flex justify-between font-mono-brand text-[10px] text-[hsl(var(--background)/.5)]"><span>{num} / YER AYRILDI</span><ArrowDownRight size={15} /></div><div className="mt-24"><p className="text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]">{service}</p><h3 className="mt-2 text-2xl font-bold">{title}</h3><p className="mt-2 text-xs text-[hsl(var(--background)/.55)]">{location} · Görsel alanı yakında</p></div></div>)}</div></div></section>;
}

function FAQ() {
  const [active, setActive] = useState(0);
  return <section className="mx-auto max-w-[900px] px-5 py-20 md:py-28"><div className="text-center"><p className="eyebrow">05 — MERAK EDİLENLER</p><h2 data-testid="heading-faq" className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Aklınızdaki<br /><em>sorular.</em></h2></div><div className="mt-12 border-t border-[hsl(var(--border))]">{faqItems.map(([question, answer], index) => <div key={question} className="border-b border-[hsl(var(--border))]"><button type="button" aria-expanded={active === index} data-testid={`button-faq-${index}`} onClick={() => setActive(active === index ? -1 : index)} className="focus-ring flex w-full items-center justify-between gap-5 py-6 text-left text-base font-bold"><span>{question}</span><ChevronDown size={18} className={`shrink-0 transition-transform ${active === index ? 'rotate-180 text-[hsl(var(--primary))]' : ''}`} /></button>{active === index && <p data-testid={`text-faq-answer-${index}`} className="max-w-2xl pb-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{answer}</p>}</div>)}</div></section>;
}

function Home() {
  return <><Meta title="2M Yapı Market | Kuşadası Yapı ve Proje Çözümleri" description="Kuşadası, Soğucak, Davutlar ve Güzelçamlı’da malzeme, uygulama ve proje hizmetlerini tek konuşmada buluşturun." /><Header /><main><Hero /><ServicePreview /><MethodSection /><AreasSection /><QuoteSection /><PlaceholderProjects /><FAQ /><section className="bg-[hsl(var(--primary))] px-5 py-16 text-center text-[hsl(var(--primary-foreground))] md:py-24"><h2 data-testid="heading-home-cta" className="font-display text-5xl leading-[.9] md:text-7xl">Projenizi<br /><em>anlatın.</em></h2><p className="mx-auto mt-5 max-w-md text-sm leading-6 opacity-80">İlk adım için uzun bir dosyaya gerek yok. Birkaç cümle yeter.</p><Link href="/iletisim" data-testid="link-home-final-cta" className="mt-8 inline-flex items-center gap-3 bg-[hsl(var(--foreground))] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[hsl(var(--background))] transition hover:bg-[hsl(var(--accent))]">Talep formuna git <ArrowRight size={16} /></Link></section></main><Footer /><FloatingWhatsApp /><MobileContactBar /></>;
}

function ServicesPage() {
  const [category, setCategory] = useState('Tümü');
  const categories = ['Tümü', 'İç mekân', 'Dış yapı', 'Yapısal', 'Teknik', 'Dış alan'];
  const filtered = category === 'Tümü' ? services : services.filter(s => s.category === category);
  return <><Meta title="Hizmetler | 2M Yapı Market Kuşadası" description="Tadilat, boya, çatı, çelik, prefabrik, tesisat ve daha fazlası için Kuşadası hizmet rehberi." /><Header /><main className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24"><div className="max-w-3xl"><p className="eyebrow">HİZMET DİZİNİ / 2024</p><h1 data-testid="heading-services" className="mt-5 font-display text-6xl leading-[.86] md:text-8xl">İşin adı ne olursa olsun,<br /><em>bir yerden başlayalım.</em></h1><p className="mt-8 max-w-xl text-base leading-8 text-[hsl(var(--muted-foreground))]">Her hizmet sayfası, ihtiyacınızı daha iyi anlatabilmeniz için bir başlangıç noktası. Detaylar için bize ulaşın.</p></div><div className="mt-14 flex flex-wrap gap-2" role="group" aria-label="Hizmet kategorileri">{categories.map(item => <button type="button" key={item} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setCategory(item)} className={`focus-ring border px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${category === item ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'}`}>{item}</button>)}</div><div className="mt-8 grid border-t border-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-3">{filtered.map((service, index) => { const Icon = service.icon; return <Link href={`/${service.slug}`} key={service.slug} data-testid={`card-directory-${service.slug}`} className="hover-lift group border-b border-r border-[hsl(var(--border))] p-6 md:p-8"><div className="flex justify-between"><span className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">0{index + 1}</span><Icon size={21} className="text-[hsl(var(--primary))]" /></div><p className="mt-14 text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{service.category}</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em]">{service.name}</h2><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{service.description}</p><span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">Hizmeti incele <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></Link>; })}</div></main><Footer /><FloatingWhatsApp /><MobileContactBar /></>;
}

function ContactPage() {
  return <><Meta title="İletişim ve Keşif | 2M Yapı Market" description="Kuşadası ve çevresindeki yapı, tadilat ve proje ihtiyacınızı 2M Yapı Market’e anlatın. Keşif talebinizi gönderin." /><Header /><main><section className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-[.85fr_1.15fr] md:px-8 md:py-24"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.25em] text-[hsl(var(--accent-foreground)/.55)]">İLETİŞİM / İLK ADIM</p><h1 data-testid="heading-contact" className="mt-6 font-display text-6xl leading-[.85] md:text-8xl">Projenizi<br /><em>bize bırakın.</em></h1><p className="mt-8 max-w-md text-base leading-8 text-[hsl(var(--accent-foreground)/.72)]">Ne yapılacağını, nerede olduğunu ve size nasıl ulaşmamızı istediğinizi yazın. Gerisini konuşarak netleştirelim.</p><div className="mt-10 grid gap-4 border-t border-[hsl(var(--accent-foreground)/.18)] pt-6 text-sm"><a href={whatsappUrl('Merhaba, keşif talebi oluşturmak istiyorum.')} target="_blank" rel="noopener noreferrer" data-testid="link-contact-whatsapp" className="flex items-center gap-3 hover:text-[hsl(var(--primary))]"><MessageCircle size={18} /> WhatsApp’tan doğrudan yazın <ArrowRight size={14} /></a>{PHONE ? <a href={`tel:${PHONE}`} data-testid="link-contact-phone" className="flex items-center gap-3 hover:text-[hsl(var(--primary))]"><Phone size={18} /> Telefonla görüşün <ArrowRight size={14} /></a> : <span data-testid="text-contact-phone-pending" className="flex items-center gap-3 text-[hsl(var(--accent-foreground)/.55)]"><Phone size={18} /> Telefon bilgisi yakında eklenecek</span>}<span data-testid="text-contact-address" className="flex items-start gap-3 text-[hsl(var(--accent-foreground)/.65)]"><MapPin size={18} className="mt-0.5 shrink-0" /> Kuşadası · Soğucak · Davutlar · Güzelçamlı</span></div></div><div className="bg-[hsl(var(--background))] p-5 text-[hsl(var(--foreground))] md:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="font-display text-3xl">Kısa bir not yeter.</h2><span className="font-mono-brand text-[10px] text-[hsl(var(--muted-foreground))]">FORM / 01</span></div><QuoteForm compact /></div></div></section></main><Footer /><FloatingWhatsApp /><MobileContactBar /></>;
}

function ServicePage() {
  const [, params] = useRoute('/:slug');
  const service = services.find(item => item.slug === params?.slug) || services[0];
  const Icon = service.icon;
  return <><Meta title={`${service.name} | 2M Yapı Market Kuşadası`} description={`${service.name} hizmeti için Kuşadası ve çevresinde malzeme, keşif ve uygulama çözümleri. 2M Yapı Market’e ulaşın.`} /><Header /><main><section className="bg-[hsl(var(--secondary))]"><div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24"><Link href="/hizmetler" data-testid="link-service-breadcrumb" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"><ArrowRight size={13} className="rotate-180" /> Hizmetler</Link><div className="mt-14 grid gap-10 md:grid-cols-[1fr_.8fr] md:items-end"><div><span data-testid="icon-service-detail" className="grid h-14 w-14 place-items-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Icon size={26} /></span><p className="eyebrow mt-8">{service.category} / KUŞADASI VE ÇEVRESİ</p><h1 data-testid="heading-service-detail" className="mt-5 max-w-3xl font-display text-7xl leading-[.84] md:text-9xl">{service.name}</h1></div><p data-testid="text-service-detail-description" className="max-w-md text-lg leading-8 text-[hsl(var(--muted-foreground))]">{service.description} İhtiyacınızı ve alanınızı anlatın; kapsamı birlikte netleştirelim.</p></div></div></section><section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 md:grid-cols-[.8fr_1.2fr] md:px-8 md:py-28"><div><p className="eyebrow">BU SAYFA BİR BAŞLANGIÇ</p><h2 className="mt-4 font-display text-5xl leading-[.9]">Doğru sorular,<br /><em>temiz bir plan.</em></h2></div><div><p className="max-w-xl text-base leading-8 text-[hsl(var(--muted-foreground))]">Her yapı ihtiyacı kendine özgü. Kullanım amacı, mevcut durum, alan ve zaman planı gibi detaylar önerinin temelini oluşturur. Hazır bir paket yerine, size uyan çözümü konuşalım.</p><div className="mt-9 grid gap-3 sm:grid-cols-2"><div className="border-l-2 border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] p-5"><p className="font-bold">Alanı anlayalım</p><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Nerede, nasıl kullanılacak?</p></div><div className="border-l-2 border-[hsl(var(--accent))] bg-[hsl(var(--secondary))] p-5"><p className="font-bold">Kapsamı netleştirelim</p><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Malzeme ve uygulama adımları.</p></div></div><Link href="/iletisim" data-testid="link-service-quote" className="mt-9 inline-flex items-center gap-3 bg-[hsl(var(--primary))] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))] transition hover:bg-[hsl(var(--accent))]">Bu hizmet için yazın <ArrowRight size={15} /></Link></div></section><section className="bg-[hsl(var(--foreground))] px-5 py-16 text-center text-[hsl(var(--background))] md:py-20"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] opacity-50">BİR SONRAKİ ADIM</p><h2 className="mt-4 font-display text-5xl">Sorunuzu birlikte<br /><em>çözelim.</em></h2><a href={whatsappUrl(`Merhaba, ${service.name} hakkında bilgi almak istiyorum.`)} target="_blank" rel="noopener noreferrer" data-testid="link-service-whatsapp" className="mt-7 inline-flex items-center gap-3 border border-[hsl(var(--background)/.35)] px-5 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--background)/.1)]"><MessageCircle size={16} /> WhatsApp’tan yazın</a></section></main><Footer /><FloatingWhatsApp /><MobileContactBar /></>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/hizmetler" component={ServicesPage} /><Route path="/iletisim" component={ContactPage} />{services.map(service => <Route key={service.slug} path={`/${service.slug}`} component={ServicePage} />)}<Route component={NotFound} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><div className="site-noise min-h-[100dvh]"><ErrorBoundary><Router /></ErrorBoundary></div><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;