import { useState } from 'react';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/use-scroll';
import { ServiceImage } from '@/components/service-image';

interface RoofSystem {
  id: string;
  name: string;
  description: string;
  image: string;
  advantages: string[];
  material: string;
}

const ROOF_SYSTEMS: RoofSystem[] = [
  {
    id: 'braas',
    name: 'Braas Çatı',
    description: 'Kiremit çatı sistemleri, doğal görünümlü, dayanıklı ve uzun ömürlü çözümler sunar. Farklı renk ve profillerle mimariye uyum sağlar.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
    advantages: ['Doğal estetik', 'Uzun ömürlü', 'Bakım kolaylığı', 'Isı yalıtımı'],
    material: 'Kil / Seramik',
  },
  {
    id: 'kenet',
    name: 'Kenet Çatı',
    description: 'Metal kenet çatı sistemleri, modern görünüm ve üstün su sızdırmazlık sağlar. Geniş yüzeyler için ideal çözüm.',
    image: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
    advantages: ['Su sızdırmazlık', 'Modern görünüm', 'Hafif yapı', 'Hızlı montaj'],
    material: 'Galvaniz Çelik',
  },
  {
    id: 'celik',
    name: 'Çelik Çatı',
    description: 'Çelik karkas çatı sistemleri, büyük açıklıklı yapılar için güçlü ve hafif bir çözüm sunar.',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
    advantages: ['Yüksek dayanım', 'Büyük açıklık', 'Hafif yapı', 'Deprem direnci'],
    material: 'Çelik Profil',
  },
  {
    id: 'izolasyon',
    name: 'İzolasyon',
    description: 'Çatı izolasyonu, enerji verimliliğini artırır ve iç mekân konforunu sağlar. Isı köprülerini önler.',
    image: 'https://images.pexels.com/photos/5691603/pexels-photo-5691603.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
    advantages: ['Enerji tasarrufu', 'Konfor', 'Nem koruması', 'Uzun ömür'],
    material: 'Polistren / Mineral Yün',
  },
];

export function RoofSystemExplorer() {
  const [activeId, setActiveId] = useState(ROOF_SYSTEMS[0].id);
  const [ref, visible] = useScrollReveal();
  const active = ROOF_SYSTEMS.find((s) => s.id === activeId) || ROOF_SYSTEMS[0];

  return (
    <section ref={ref} className={`scroll-reveal${visible ? ' visible' : ''} mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28`}>
      <div className="mb-12">
        <p className="eyebrow">04 — ÇATI SİSTEMLERİ</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Çatı sistemlerini<br /><em>keşfedin.</em></h2>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">Her yapı tipine uygun çatı çözümlerini karşılaştırın. Malzeme, görünüm ve avantajlarını inceleyin.</p>
      </div>

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 border-b border-[hsl(var(--border))]" role="tablist" aria-label="Çatı sistemi türleri">
        {ROOF_SYSTEMS.map((system) => (
          <button
            key={system.id}
            role="tab"
            aria-selected={activeId === system.id}
            aria-controls={`panel-${system.id}`}
            onClick={() => setActiveId(system.id)}
            className={`tab-underline px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              activeId === system.id
                ? 'text-[hsl(var(--primary))] active'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            {system.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="crossfade-container aspect-[4/3] overflow-hidden bg-[hsl(var(--muted))]">
          <ServiceImage
            key={active.id}
            src={active.image}
            alt={`${active.name} çatı sistemi`}
            className="h-full w-full object-cover animate-fade-in"
          />
        </div>
        <div id={`panel-${active.id}`} role="tabpanel" className="flex flex-col justify-center">
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">MALZEME: {active.material}</p>
          <h3 className="mt-3 font-display text-4xl md:text-5xl">{active.name}</h3>
          <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{active.description}</p>
          <ul className="mt-6 grid gap-3" role="list">
            {active.advantages.map((adv) => (
              <li key={adv} className="flex items-center gap-3 text-sm">
                <span className="step-dot active shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
          <Link
            href="/iletisim"
            className="mt-8 inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]"
          >
            Teklif al <span className="cta-arrow inline-block">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RoofSystemExplorer;
