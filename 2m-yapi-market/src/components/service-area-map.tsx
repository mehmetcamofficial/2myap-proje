import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/use-scroll';

const PROVINCES = [
  { name: 'Kuşadası', x: 48, y: 72, isHome: true },
  { name: 'Aydın', x: 42, y: 65, isHome: false },
  { name: 'İzmir', x: 30, y: 55, isHome: false },
  { name: 'Muğla', x: 55, y: 82, isHome: false },
  { name: 'Manisa', x: 35, y: 45, isHome: false },
  { name: 'Denizli', x: 65, y: 60, isHome: false },
  { name: 'Uşak', x: 52, y: 48, isHome: false },
  { name: 'Kütahya', x: 48, y: 32, isHome: false },
  { name: 'Balıkesir', x: 25, y: 30, isHome: false },
  { name: 'Bursa', x: 35, y: 18, isHome: false },
];

export function ServiceAreaVisual() {
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal${visible ? ' visible' : ''} bg-[hsl(var(--secondary))]`}>
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">HİZMET BÖLGEMİZ</p>
            <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">Kuşadası'ndan<br /><em>tüm Ege'ye.</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              Merkezimiz Kuşadası'nda. Tadilat, yapı ve uygulama işleri için Ege Bölgesi genelindeki projeleri değerlendiriyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {PROVINCES.filter(p => !p.isHome).slice(0, 6).map((p) => (
                <span key={p.name} className="border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-semibold">
                  {p.name}
                </span>
              ))}
            </div>
            <Link href="/iletisim" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--primary))] px-6 py-4 text-[12px] font-extrabold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))]">
              Projenizi anlatın <span className="cta-arrow inline-block">→</span>
            </Link>
          </div>

          {/* Map visualization */}
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full max-w-md" aria-label="Ege Bölgesi hizmet haritası">
              {/* Simplified Aegean region outline */}
              <path
                d="M10,10 Q15,5 25,8 T45,12 Q55,15 60,20 T70,30 Q75,40 72,55 T65,75 Q60,85 50,90 T30,85 Q20,80 15,70 T12,50 Q10,35 10,10 Z"
                fill="hsl(176, 27%, 33%)"
                fillOpacity="0.08"
                stroke="hsl(176, 27%, 33%)"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />

              {/* Province dots */}
              {PROVINCES.map((province) => (
                <g key={province.name}>
                  {province.isHome && (
                    <>
                      <circle
                        cx={province.x}
                        cy={province.y}
                        r="6"
                        fill="hsl(13, 57%, 52%)"
                        fillOpacity="0.15"
                      >
                        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle
                        cx={province.x}
                        cy={province.y}
                        r="3"
                        fill="hsl(13, 57%, 52%)"
                      />
                    </>
                  )}
                  {!province.isHome && (
                    <circle
                      cx={province.x}
                      cy={province.y}
                      r="2"
                      fill="hsl(26, 21%, 16%)"
                      fillOpacity="0.5"
                    />
                  )}
                  <text
                    x={province.x}
                    y={province.y - (province.isHome ? 8 : 5)}
                    textAnchor="middle"
                    fill={province.isHome ? 'hsl(13, 57%, 52%)' : 'hsl(26, 21%, 16%)'}
                    fontSize={province.isHome ? '4' : '3'}
                    fontFamily="var(--app-font-mono)"
                    fontWeight={province.isHome ? '700' : '500'}
                  >
                    {province.name}
                  </text>
                </g>
              ))}

              {/* Coverage area */}
              <circle
                cx="48"
                cy="72"
                r="25"
                fill="none"
                stroke="hsl(13, 57%, 52%)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
                strokeOpacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceAreaVisual;
