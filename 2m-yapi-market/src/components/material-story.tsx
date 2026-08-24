import { useScrollProgress } from '@/hooks/use-scroll';

const STAGES = [
  { id: 'material', label: 'Malzeme', icon: '◆', desc: 'Doğru malzeme, doğru kaynak' },
  { id: 'planning', label: 'Planlama', icon: '◇', desc: 'Kapsam ve proje netleşmesi' },
  { id: 'craftsman', label: 'Usta', icon: '◆', desc: 'İşini bilen ekip seçimi' },
  { id: 'application', label: 'Uygulama', icon: '◇', desc: 'Planlı ve kontrollü uygulama' },
  { id: 'result', label: 'Sonuç', icon: '◆', desc: 'Tamamlanmış proje' },
];

export function MaterialStory() {
  const [ref, progress] = useScrollProgress();
  const activeIndex = Math.min(
    STAGES.length - 1,
    Math.floor(progress * STAGES.length)
  );

  return (
    <section ref={ref} className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12">
        <p className="eyebrow">08 — YAKLAŞIM</p>
        <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Malzemeden<br /><em>uygulamaya.</em></h2>
      </div>

      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="absolute left-0 right-0 top-[30px] hidden h-[2px] bg-[hsl(var(--border))] md:block" />
        <div
          className="absolute left-0 top-[30px] hidden h-[2px] bg-[hsl(var(--primary))] transition-all duration-700 md:block"
          style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
        />

        <div className="grid gap-8 md:grid-cols-5 md:gap-4">
          {STAGES.map((stage, i) => {
            const isActive = i <= activeIndex;
            const isCurrent = i === activeIndex;
            return (
              <div
                key={stage.id}
                className={`relative flex flex-col items-center text-center transition-all duration-300 ${
                  isCurrent ? 'scale-105' : ''
                }`}
              >
                {/* Blueprint-style node */}
                <div className={`relative z-10 mb-6 flex h-[60px] w-[60px] items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : isActive
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))]'
                }`}>
                  <span className="font-display text-xl">{stage.icon}</span>
                </div>
                <p className={`font-mono-brand text-[10px] uppercase tracking-[.2em] ${isCurrent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className={`mt-2 text-lg font-bold ${isCurrent ? '' : 'text-[hsl(var(--muted-foreground))]'}`}>{stage.label}</h3>
                {isCurrent && (
                  <p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))] animate-fade-in max-w-[160px]">{stage.desc}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MaterialStory;
