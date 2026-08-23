import { useRef, useState } from 'react';
import type { BeforeAfter as BA } from '@/data/content';

// Accessible before/after comparison slider (mouse, touch and keyboard).
export function BeforeAfter({ data }: { data: BA }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(50);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden" ref={ref}>
      {/* After (base) */}
      <img src={data.after} alt={data.label + ' - SONRASI'} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Before (clipped overlay) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <img src={data.before} alt={data.label + ' - ÖNCESİ'} className="absolute inset-0 h-full w-full object-cover saturate-50 brightness-90" draggable={false} />
      </div>
      <span className="absolute left-3 top-3 bg-[hsl(var(--foreground))] px-2 py-1 font-mono-brand text-[10px] uppercase tracking-widest text-[hsl(var(--background))]">ÖNCESİ</span>
      <span className="absolute right-3 top-3 bg-[hsl(var(--primary))] px-2 py-1 font-mono-brand text-[10px] uppercase tracking-widest text-[hsl(var(--primary-foreground))]">SONRASI</span>

      {/* Handle */}
      <div className="absolute inset-y-0" style={{ left: `calc(${value}% - 11px)` }} onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}>
        <div className="relative h-full w-[22px] cursor-ew-resize">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[hsl(var(--background))]" />
          <div className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[hsl(var(--background)/.4)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" /></svg>
          </div>
        </div>
      </div>

      <input
        type="range"
        aria-label="Önce / sonra karşılaştırma"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize"
      />

      {/* pointer handlers on container */}
      <div className="absolute inset-0" onPointerDown={(e) => update(e.clientX)} onPointerMove={(e) => { if (e.buttons === 1) update(e.clientX); }} >
        <span className="sr-only">Slider yalnızca klavye ve sürükleme ile kullanılır</span>
      </div>
    </div>
  );
}