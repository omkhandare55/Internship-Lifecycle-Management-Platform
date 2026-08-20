import { Capacitor } from '@capacitor/core';

export const nativeBridge = {
  isNative: (): boolean => {
    return Capacitor.isNativePlatform();
  },

  getPlatform: (): 'web' | 'android' | 'ios' => {
    return Capacitor.getPlatform() as 'web' | 'android' | 'ios';
  },

  /**
   * Safe Haptic vibration for mobile confirmations
   */
  hapticFeedback: (type: 'impact' | 'notification' | 'selection' = 'impact') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'impact') navigator.vibrate(15);
      else if (type === 'notification') navigator.vibrate([20, 50, 20]);
      else navigator.vibrate(10);
    }
  },

  /**
   * Cross-platform camera capture / KYC document scan
   */
  captureDocument: async (): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0] || null;
        resolve(file);
      };
      input.click();
    });
  },
};
