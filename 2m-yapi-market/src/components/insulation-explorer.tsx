import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';

interface InsulationLayer {
  id: string;
  name: string;
  role: string;
  color: string;
  height: number;
  description: string;
}

const LAYERS: InsulationLayer[] = [
  { id: 'outer', name: 'Dış Kaplama', role: 'Koruma ve estetik', color: 'hsl(26, 21%, 16%)', height: 18, description: 'Dış etkenlere karşı koruma sağlar. Yağmur, rüzgâr ve UV ışınlarını engeller.' },
  { id: 'insulation', name: 'Yalıtım Katmanı', role: 'Isı ve ses yalıtımı', color: 'hsl(176, 27%, 33%)', height: 35, description: 'Isı köprülerini önler. Enerji tasarrufu ve iç mekân konforunu sağlar.' },
  { id: 'carrier', name: 'Taşıyıcı Yüzey', role: 'Yapısal destek', color: 'hsl(13, 57%, 52%)', height: 25, description: 'Duvar veya çatı strüktürünün taşıma kapasitesini sağlar.' },
  { id: 'inner', name: 'İç Yüzey', role: 'Bitiş ve estetik', color: 'hsl(40, 29%, 96%)', height: 22, description: 'Boya, alçı veya kaplama ile iç mekân görünümünü tamamlar.' },
];

export function InsulationExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ref, visible] = useScrollReveal();
  const active = LAYERS.find((l) => l.id === activeId);

  return (
    <section ref={ref} className={`scroll-reveal${visible ? ' visible' : ''} mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28`}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="eyebrow">07 — YALITIM</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Yalıtım<br /><em>katmanları.</em></h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Bir yapının yalıtım sistemindeki katmanları keşfedin.
            Her katmanının rolünü ve önemini öğrenin.
          </p>
          <p className="mt-4 text-xs text-[hsl(var(--muted-foreground)/.7)]">
            Not: Bu şematik bir gösterimdir. Gerçek detaylar proje bazlı hesaplamalara göre belirlenir.
          </p>

          {/* Layer buttons */}
          <div className="mt-8 space-y-2">
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                onMouseEnter={() => setActiveId(layer.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(layer.id)}
                onBlur={() => setActiveId(null)}
                onClick={() => setActiveId(activeId === layer.id ? null : layer.id)}
                className={`layer-card flex w-full items-center gap-4 border-l-4 px-5 py-4 text-left transition-all ${
                  activeId === layer.id ? 'highlighted' : 'border-transparent'
                }`}
                aria-pressed={activeId === layer.id}
              >
                <span className="h-4 w-4 shrink-0 rounded-sm" style={{ background: layer.color }} />
                <div>
                  <p className="text-sm font-bold">{layer.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{layer.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Schematic visualization */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Layer stack */}
            <div className="relative border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              {LAYERS.map((layer) => {
                const isActive = activeId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onMouseEnter={() => setActiveId(layer.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={() => setActiveId(activeId === layer.id ? null : layer.id)}
                    className={`layer-card relative cursor-pointer transition-all ${isActive ? 'highlighted z-10' : ''}`}
                    style={{ height: `${layer.height * 2.5}px`, background: `${layer.color}20` }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${layer.name}: ${layer.role}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(activeId === layer.id ? null : layer.id); } }}
                  >
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: layer.color }}>
                        {layer.name}
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                      style={{ height: '3px', background: isActive ? layer.color : 'transparent' }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Detail card */}
            {active && (
              <div className="mt-6 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 animate-fade-in">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: active.color }}>{active.name}</p>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{active.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
