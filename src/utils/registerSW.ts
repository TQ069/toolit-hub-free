import { registerSW } from 'virtual:pwa-register';

/**
 * Register service worker with auto-update
 */
export function initServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
      
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });

  return updateSW;
}
