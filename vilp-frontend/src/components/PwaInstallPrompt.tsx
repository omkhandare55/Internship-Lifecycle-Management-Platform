import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { nativeBridge } from '@/services/nativeBridge';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // If running in native Capacitor app or already installed standalone, don't show
    if (nativeBridge.isNative() || window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      nativeBridge.hapticFeedback('notification');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-zinc-900 text-white p-4 rounded-2xl shadow-xl z-50 flex items-center justify-between gap-3 border border-zinc-800 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary-600 text-white rounded-xl">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Install VILP Mobile App</p>
          <p className="text-[11px] text-gray-400">Fast home screen access & instant alerts</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
