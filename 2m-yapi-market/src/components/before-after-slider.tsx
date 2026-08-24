import { useState, useRef, useCallback, useEffect } from 'react';
import { ServiceImage } from '@/components/service-image';

interface BeforeAfterImage {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  label?: string;
}

interface BeforeAfterSliderProps {
  images: BeforeAfterImage[];
}

export function BeforeAfterSlider({ images }: BeforeAfterSliderProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const current = images[currentIdx];

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      setPosition((p) => Math.min(100, p + 5));
    }
  }, []);

  useEffect(() => {
    const handleGlobalUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  if (!current) return null;

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-col-resize select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        role="slider"
        aria-label="Önce/Sonra karşılaştırma"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* After image (full) */}
        <ServiceImage
          src={current.afterSrc}
          alt={current.afterAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <ServiceImage
            src={current.beforeSrc}
            alt={current.beforeAlt}
            className="h-full w-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-white shadow-md z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">Önce</span>
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <span className="bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">Sonra</span>
        </div>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {current.label && (
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{current.label}</p>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-bold uppercase tracking-wider disabled:opacity-30"
              aria-label="Önceki karşılaştırma"
            >
              ←
            </button>
            <span className="flex items-center px-3 text-xs text-[hsl(var(--muted-foreground))]">
              {currentIdx + 1} / {images.length}
            </span>
            <button
              onClick={() => setCurrentIdx((i) => Math.min(images.length - 1, i + 1))}
              disabled={currentIdx === images.length - 1}
              className="border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-bold uppercase tracking-wider disabled:opacity-30"
              aria-label="Sonraki karşılaştırma"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
