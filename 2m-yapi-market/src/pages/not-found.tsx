import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return <main className="grid min-h-[100dvh] place-items-center bg-[hsl(var(--accent))] px-5 text-[hsl(var(--accent-foreground))]">
    <div className="max-w-xl text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center border border-[hsl(var(--accent-foreground)/.35)] text-[hsl(var(--primary))]"><Compass size={26} /></span>
      <p data-testid="text-404-kicker" className="mt-8 font-mono-brand text-[10px] uppercase tracking-[.25em] text-[hsl(var(--accent-foreground)/.55)]">404 / YOL BULUNAMADI</p>
      <h1 data-testid="heading-404" className="mt-4 font-display text-7xl leading-[.85] md:text-9xl">Bu sayfa<br /><em>yerinde değil.</em></h1>
      <p data-testid="text-404-description" className="mx-auto mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--accent-foreground)/.68)]">Aradığınız sayfa taşınmış olabilir. Ana sayfadan doğru yolu birlikte bulalım.</p>
      <Link href="/" data-testid="link-404-home" className="mt-8 inline-flex items-center gap-3 bg-[hsl(var(--primary))] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary-foreground))]"><ArrowLeft size={15} /> Ana sayfaya dön</Link>
    </div>
  </main>;
}