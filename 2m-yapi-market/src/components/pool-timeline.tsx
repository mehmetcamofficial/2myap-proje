import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';
import { ServiceImage } from '@/components/service-image';

interface PoolStage {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
}

const POOL_STAGES: PoolStage[] = [
  {
    id: 'prep',
    step: '01',
    title: 'Alan Hazırlığı',
    description: 'Havuz alanının temizlenmesi, işaretlenmesi ve zemin hazırlığı yapılır. Kaçak ve seviye tespitleri kontrol edilir.',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
  {
    id: 'excavation',
    step: '02',
    title: 'Kazı',
    description: 'Havuz için gerekli kazı çalışması, zemin etüdlerine göre gerçekleştirilir.',
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
  {
    id: 'concrete',
    step: '03',
    title: 'Betonarme',
    description: 'Havuzun betonarme gövdesi, yapısal hesaplara uygun olarak inşa edilir.',
    image: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
  {
    id: 'waterproof',
    step: '04',
    title: 'Su Yalıtımı',
    description: 'Havuz içinde su sızıntısını önleyen özel yalıtım uygulaması yapılır.',
    image: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
  {
    id: 'coating',
    step: '05',
    title: 'Kaplama',
    description: 'Seramik, fayans veya özel kaplama malzemesi ile havuz iç yüzeyi tamamlanır.',
    image: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
  {
    id: 'final',
    step: '06',
    title: 'Son Uygulamalar',
    description: 'Kenar taşı, aydınlatma, filtre ve devre tesisatı, son dokunuşlar tamamlanır.',
    image: 'https://images.pexels.com/photos/261328/pexels-photo-261328.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800',
  },
];

export function PoolConstructionTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [ref, visible] = useScrollReveal();
  const active = POOL_STAGES[activeIdx];

  return (
    <section ref={ref} className={`scroll-reveal${visible ? ' visible' : ''} mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28`}>
      <div className="mb-12">
        <p className="eyebrow">06 — HAVUZ YAPIMI</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Havuz yapım<br /><em>süreci.</em></h2>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">
          Sıfırdan havuza kadar her aşamayı adım adım görüntüleyin.
        </p>
      </div>

      {/* Progress bar */}
      <div className="progress-line mb-8">
        <div className="progress-line-fill" style={{ width: `${((activeIdx + 1) / POOL_STAGES.length) * 100}%` }} />
      </div>

      {/* Step buttons (mobile-friendly) */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Havuz yapım aşamaları">
        {POOL_STAGES.map((stage, i) => (
          <button
            key={stage.id}
            role="tab"
            aria-selected={i === activeIdx}
            aria-controls={`pool-panel-${stage.id}`}
            onClick={() => setActiveIdx(i)}
            className={`flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              i === activeIdx
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : i < activeIdx
                ? 'border-[hsl(var(--primary)/.4)] text-[hsl(var(--primary))]'
                : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            <span className="step-dot !w-2 !h-2" />
            {stage.step}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div id={`pool-panel-${active.id}`} role="tabpanel" className="crossfade-container aspect-[4/3] overflow-hidden bg-[hsl(var(--muted))]">
          <ServiceImage
            key={active.id}
            src={active.image}
            alt={active.title}
            className="h-full w-full object-cover animate-fade-in"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-mono-brand text-sm text-[hsl(var(--primary))]">{active.step}</span>
          <h3 className="mt-2 font-display text-4xl md:text-5xl">{active.title}</h3>
          <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{active.description}</p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="border border-[hsl(var(--border))] px-5 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-30"
              aria-label="Önceki adım"
            >
              ← Önceki
            </button>
            <button
              onClick={() => setActiveIdx(Math.min(POOL_STAGES.length - 1, activeIdx + 1))}
              disabled={activeIdx === POOL_STAGES.length - 1}
              className="border border-[hsl(var(--border))] px-5 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-30"
              aria-label="Sonraki adım"
            >
              Sonraki →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PoolConstructionTimeline;
