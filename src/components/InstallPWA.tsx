import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'vybz-install-dismiss-count';
const LAST_DISMISSED_KEY = 'vybz-install-last-dismissed';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    const dismissCount = parseInt(localStorage.getItem(DISMISS_KEY) || '0');
    if (dismissCount >= 3) return;

    const lastDismissed = localStorage.getItem(LAST_DISMISSED_KEY);
    if (lastDismissed) {
      const daysSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 15000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (ios) {
      setTimeout(() => setShowPrompt(true), 15000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'dismissed') handleDismiss();
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    const count = parseInt(localStorage.getItem(DISMISS_KEY) || '0');
    localStorage.setItem(DISMISS_KEY, (count + 1).toString());
    localStorage.setItem(LAST_DISMISSED_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-start justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md mx-4 ${isMobile ? 'mb-4' : 'mt-6'} bg-card border border-border rounded-2xl shadow-2xl p-6 animate-slide-up`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-foreground">Install Vybz Music</h3>
              <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant access to your music library with faster loading and an app-like experience!
            </p>

            {isIOS ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">To install on iOS:</p>
                <p>1. Tap the <strong>Share</strong> button</p>
                <p>2. Tap <strong>"Add to Home Screen"</strong></p>
                <p>3. Tap <strong>"Add"</strong></p>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleInstall} className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Install App
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Not Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
