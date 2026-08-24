import { useScrollProgress } from '@/hooks/use-scroll';

const STEEL_STEPS = [
  {
    id: 'foundation',
    label: 'Temel / Baz',
    description: 'Yapının taşıma kapasitesine göre hesaplanan temel sistemi.',
    svgPath: 'M20,180 L180,180 L180,170 L20,170 Z',
    svgPathMobile: 'M10,90 L90,90 L90,85 L10,85 Z',
  },
  {
    id: 'columns',
    label: 'Taşıyıcı Sütunlar',
    description: 'Dikey çelik sütunlar, yapının ana taşıyıcı elemanlarıdır.',
    svgPath: 'M40,170 L40,80 L50,80 L50,170 M150,170 L150,80 L160,80 L160,170',
    svgPathMobile: 'M20,85 L20,35 L25,35 L25,85 M75,85 L75,35 L80,35 L80,85',
  },
  {
    id: 'beams',
    label: 'Kirişler',
    description: 'Yatay çelik kirişler, taşıyıcı sistem arasındaki yükü dağıtır.',
    svgPath: 'M40,80 L160,80 L160,70 L40,70 Z M40,85 L160,85 L160,80 L40,80 Z',
    svgPathMobile: 'M20,35 L80,35 L80,30 L20,30 Z',
  },
  {
    id: 'secondary',
    label: 'İkincil Yapı',
    description: 'Tali kirişler ve destek elemanları çatı kaplamasını taşır.',
    svgPath: 'M40,70 L160,70 L160,65 L40,65 Z M70,70 L70,65 M100,70 L100,65 M130,70 L130,65',
    svgPathMobile: 'M20,30 L80,30 L80,27 L20,27 Z M35,30 L35,27 M55,30 L55,27',
  },
  {
    id: 'roof',
    label: 'Çatı Kaplaması',
    description: 'Çatı kaplama malzemesi ile üst örtünün tamamlanması.',
    svgPath: 'M30,65 L100,30 L170,65 Z',
    svgPathMobile: 'M15,27 L50,10 L85,27 Z',
  },
];

export function SteelAssembly() {
  const [ref, progress] = useScrollProgress();
  const activeIndex = Math.min(
    STEEL_STEPS.length - 1,
    Math.floor(progress * STEEL_STEPS.length)
  );

  return (
    <section ref={ref} className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12">
          <p className="eyebrow text-[hsl(var(--background)/.5)]">05 — ÇELİK KONSTRÜKSİYON</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Montaj<br /><em>süreci.</em></h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-[hsl(var(--background)/.7)]">
            Çelik yapının adım adım nasıl bir araya getirildiğini keşfedin.
            Her aşama, yapısal bütünlüğü sağlar.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          {/* Steps list */}
          <div className="space-y-1">
            {STEEL_STEPS.map((step, i) => {
              const isActive = i <= activeIndex;
              const isCurrent = i === activeIndex;
              return (
                <div
                  key={step.id}
                  className={`relative flex items-start gap-4 border-l-2 py-4 pl-6 transition-all duration-300 ${
                    isCurrent
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)]'
                      : isActive
                      ? 'border-[hsl(var(--primary)/.4)]'
                      : 'border-[hsl(var(--background)/.15)]'
                  }`}
                >
                  <span className={`step-dot shrink-0 mt-1 ${isCurrent ? 'active' : isActive ? 'completed' : ''}`} />
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${isCurrent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--background)/.5)]'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className={`mt-1 text-lg font-bold ${isCurrent ? '' : 'text-[hsl(var(--background)/.7)]'}`}>{step.label}</h3>
                    {isCurrent && (
                      <p className="mt-2 text-sm leading-6 text-[hsl(var(--background)/.7)] animate-fade-in">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG visualization */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Desktop SVG */}
              <svg viewBox="0 0 200 200" className="hidden w-full md:block" aria-label="Çelik montaj animasyonu">
                {/* Foundation */}
                <rect
                  x="20" y="170" width="160" height="10"
                  fill={activeIndex >= 0 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 0 ? 1 : 0.2}
                />
                {/* Columns */}
                <rect
                  x="40" y="80" width="10" height="90"
                  fill={activeIndex >= 1 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 1 ? 1 : 0.2}
                />
                <rect
                  x="150" y="80" width="10" height="90"
                  fill={activeIndex >= 1 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 1 ? 1 : 0.2}
                />
                {/* Beams */}
                <rect
                  x="40" y="70" width="120" height="10"
                  fill={activeIndex >= 2 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 2 ? 1 : 0.2}
                />
                <rect
                  x="40" y="80" width="120" height="5"
                  fill={activeIndex >= 2 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 2 ? 0.6 : 0.1}
                />
                {/* Secondary */}
                {[70, 100, 130].map((x) => (
                  <line
                    key={x}
                    x1={x} y1="70" x2={x} y2="65"
                    stroke={activeIndex >= 3 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                    strokeWidth="3"
                    className="transition-all duration-500"
                    opacity={activeIndex >= 3 ? 1 : 0.2}
                  />
                ))}
                <rect
                  x="40" y="65" width="120" height="5"
                  fill={activeIndex >= 3 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 3 ? 1 : 0.2}
                />
                {/* Roof */}
                <polygon
                  points="30,65 100,30 170,65"
                  fill={activeIndex >= 4 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'}
                  className="transition-all duration-500"
                  opacity={activeIndex >= 4 ? 1 : 0.2}
                />
                {/* Labels */}
                {activeIndex >= 1 && (
                  <text x="100" y="140" textAnchor="middle" fill="hsl(0,0%,90%)" fontSize="6" fontFamily="var(--app-font-mono)" opacity="0.7">
                    TAŞIYICI SİSTEM
                  </text>
                )}
                {activeIndex >= 2 && (
                  <text x="100" y="75" textAnchor="middle" fill="hsl(0,0%,90%)" fontSize="6" fontFamily="var(--app-font-mono)" opacity="0.7">
                    BİRLEŞİM
                  </text>
                )}
                {activeIndex >= 4 && (
                  <text x="100" y="25" textAnchor="middle" fill="hsl(0,0%,90%)" fontSize="6" fontFamily="var(--app-font-mono)" opacity="0.7">
                    ÇATI KONSTRÜKSİYONU
                  </text>
                )}
              </svg>

              {/* Mobile SVG */}
              <svg viewBox="0 0 100 100" className="block w-full md:hidden" aria-label="Çelik montaj animasyonu">
                <rect x="10" y="85" width="80" height="5" fill={activeIndex >= 0 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 0 ? 1 : 0.2} />
                <rect x="20" y="35" width="5" height="50" fill={activeIndex >= 1 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 1 ? 1 : 0.2} />
                <rect x="75" y="35" width="5" height="50" fill={activeIndex >= 1 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 1 ? 1 : 0.2} />
                <rect x="20" y="30" width="60" height="5" fill={activeIndex >= 2 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 2 ? 1 : 0.2} />
                <rect x="20" y="27" width="60" height="3" fill={activeIndex >= 3 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 3 ? 1 : 0.2} />
                {[35, 55].map((x) => (
                  <line key={x} x1={x} y1="30" x2={x} y2="27" stroke={activeIndex >= 3 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} strokeWidth="2" className="transition-all duration-500" opacity={activeIndex >= 3 ? 1 : 0.2} />
                ))}
                <polygon points="15,27 50,10 85,27" fill={activeIndex >= 4 ? 'hsl(13, 57%, 52%)' : 'hsl(0, 0%, 30%)'} className="transition-all duration-500" opacity={activeIndex >= 4 ? 1 : 0.2} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SteelAssembly;
