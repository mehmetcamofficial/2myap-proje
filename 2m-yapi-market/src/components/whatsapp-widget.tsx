import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { whatsappUrl } from '@/data/site';
import { BUSINESS } from '@/data/site';

const WA_MESSAGE = BUSINESS.whatsappDefaultMessage;
const DISMISS_KEY = '2m_wa_dismissed';

export function WhatsappWidget() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (wasDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setExpanded(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 right-5 z-50 md:bottom-8 md:right-8">
      {/* Expanded preview */}
      {expanded && (
        <div className="mb-4 w-[280px] border border-[hsl(var(--border))] bg-white shadow-xl animate-scale-in">
          <div className="flex items-center justify-between bg-[hsl(120,40%,40%)] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">2M Yapı</p>
              <p className="text-[10px] opacity-80">Çevrimiçi</p>
            </div>
            <button onClick={() => setExpanded(false)} aria-label="Kapat" className="p-1 hover:opacity-80">
              <X size={16} />
            </button>
          </div>
          <div className="bg-[#e5ddd5] p-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-sm text-gray-800">Merhaba 👋</p>
              <p className="mt-1 text-sm text-gray-700">Projenizle ilgili bilgi almak ister misiniz?</p>
              <p className="mt-2 text-[10px] text-gray-400">Genellikle birkaç dakika içinde yanıt veririz.</p>
            </div>
          </div>
          <div className="p-3">
            <a
              href={whatsappUrl(WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[hsl(120,40%,40%)] py-3 text-sm font-bold text-white hover:bg-[hsl(120,40%,35%)] transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp'tan Yaz
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="flex items-end gap-2">
        {expanded && (
          <button
            onClick={handleDismiss}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md hover:bg-gray-300 transition-colors"
            aria-label="Widget'ı kapat"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(120,40%,40%)] text-white shadow-lg hover:bg-[hsl(120,40%,35%)] transition-all whatsapp-widget-enter"
          aria-label={expanded ? 'WhatsApp penceresini kapat' : 'WhatsApp ile iletişime geç'}
        >
          {expanded ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  );
}
