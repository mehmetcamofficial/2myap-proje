import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS, whatsappUrl } from '@/data/site';

/**
 * Yüzen WhatsApp sohbet öğesi.
 * - Masaüstü: sağ altta. Mobil: sticky alt barın üstünde.
 * - Kısa gecikmeyle karşılama balonu gösterir; oturum boyunca kapatılabilir
 *   (sessionStorage). prefers-reduced-motion desteklenir.
 */
export function WhatsappWidget() {
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('wa-bubble-dismissed') === '1') {
      setDismissed(true);
      return;
    }
    const t = window.setTimeout(() => setBubbleOpen(true), 3500);
    return () => window.clearTimeout(t);
  }, []);

  const closeBubble = () => {
    setBubbleOpen(false);
    setDismissed(true);
    sessionStorage.setItem('wa-bubble-dismissed', '1');
  };

  const href = whatsappUrl(BUSINESS.whatsappDefaultMessage);

  return (
    <div className="fixed right-4 bottom-[72px] z-[45] flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {/* Karşılama balonu */}
      {bubbleOpen && !dismissed && (
        <div
          role="status"
          className="reveal w-[240px] relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[var(--shadow-md)]"
        >
          <button
            type="button"
            aria-label="Balonu kapat"
            onClick={closeBubble}
            className="absolute top-2 right-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <X size={14} />
          </button>
          <p className="text-sm font-bold">Merhaba 👋</p>
          <p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
            Ege Bölgesi’ndeki tadilat veya yapı işiniz için yazabilirsiniz.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white"
          >
            <MessageCircle size={14} /> WhatsApp’tan Yaz
          </a>
        </div>
      )}

      {/* Ana buton */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile yazın"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pr-4 pl-3.5 shadow-lg transition-transform duration-200 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:transition-none"
      >
        <MessageCircle size={20} className="text-white" aria-hidden="true" />
        <span className="text-[11px] font-extrabold tracking-[.12em] text-white uppercase">WhatsApp</span>
      </a>
    </div>
  );
}