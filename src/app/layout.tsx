import "./globals.css";
import type { Metadata } from "next";
import Web3ModalProvider from "@/providers";

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "AppKit by reown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
