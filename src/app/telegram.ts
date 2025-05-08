declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string) => void;
        showPopup: (params: PopupParams) => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
        MainButton: {
          text: string;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
      };
    };
  }
}

interface PopupParams {
  title?: string;
  message: string;
  buttons?: Array<{
    id: string;
    type?: "default" | "ok" | "close" | "cancel" | "destructive";
    text: string;
  }>;
}

export const initTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    // Initialize the app
    window.Telegram.WebApp.ready();

    // Expand the app to full height
    window.Telegram.WebApp.expand();

    // Set up the main button
    window.Telegram.WebApp.MainButton.setText("Connect Wallet");
    window.Telegram.WebApp.MainButton.onClick(() => {
      // This will be handled by the appkit-button component
      const connectButton = document.querySelector("appkit-button");
      if (connectButton) {
        (connectButton as HTMLElement).click();
      }
    });

    // Show the main button
    window.Telegram.WebApp.MainButton.show();
  }
};

export const showTelegramAlert = (message: string) => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  }
};

export const closeTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
};
