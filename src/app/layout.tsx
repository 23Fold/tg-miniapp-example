import "./globals.css";
import type { Metadata } from "next";
import Web3ModalProvider from "@/providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "AppKit by reown",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="MobileOptimized" content="176" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
