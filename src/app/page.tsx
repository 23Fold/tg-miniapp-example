"use client";

import Image from "next/image";
import { useSignMessage, useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useState, useEffect } from "react";
import { initTelegramApp } from "./telegram";
import { SophonConnectButton } from "./sophon-connect";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    initTelegramApp();
    // Get Telegram user info
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setTelegramUser(user || null);
    }
  }, []);

  const [copied, setCopied] = useState<"address" | "signature" | "transaction" | null>(null);
  const {
    data: signMessageData,
    error: signError,
    isPending: isSignPending,
    signMessage,
  } = useSignMessage();
  const {
    data: transactionData,
    error: txError,
    isPending: isTxPending,
    sendTransaction,
  } = useSendTransaction();

  const copyToClipboard = async (text: string, type: "address" | "signature" | "transaction") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[800px]">
        <div className="w-full space-y-4">
          {/* Telegram User Info */}
          <section className="p-6 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
            <h2 className="text-xl font-semibold mb-4">Telegram Context</h2>
            {telegramUser ? (
              <div className="space-y-2">
                <p>
                  <strong>Username:</strong> {telegramUser.username}
                </p>
                <p>
                  <strong>First Name:</strong> {telegramUser.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {telegramUser.last_name}
                </p>
                <p>
                  <strong>User ID:</strong> {telegramUser.id}
                </p>
              </div>
            ) : (
              <p>Not running in Telegram Mini App</p>
            )}
          </section>

          {/* Wallet Connection Status */}
          <section className="p-6 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
            <h2 className="text-xl font-semibold mb-4">Wallet Status</h2>
            <div className="space-y-2">
              <p>
                <strong>Connection Status:</strong> {isConnected ? "Connected" : "Disconnected"}
              </p>
              {address && (
                <div>
                  <p>
                    <strong>Connected Address:</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="p-2 bg-black/[.05] dark:bg-white/[.06] rounded font-mono text-sm break-all">
                      {address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(address, "address")}
                      className="text-sm px-2 py-1 rounded border border-black/[.08] dark:border-white/[.145]"
                    >
                      {copied === "address" ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <appkit-button label="Connect Wallet"></appkit-button>

          <SophonConnectButton authenticatedComponent={<div>Connected</div>} />

          <div className="w-full space-y-8">
            {/* Sign Message Section */}
            <section className="p-6 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
              <h2 className="text-xl font-semibold mb-4">Sign Message</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.target as HTMLFormElement);
                  const message = formData.get("message") as string;
                  signMessage({ message });
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Enter a message to sign
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    className="w-full min-h-[120px] p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSignPending}
                  className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                >
                  {isSignPending ? "Waiting for wallet..." : "Sign Message"}
                </button>

                {signError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    {signError.message}
                  </div>
                )}

                {signMessageData && (
                  <div className="mt-4 p-4 rounded-lg border border-black/[.08] dark:border-white/[.145]">
                    <div className="flex justify-between items-center mb-2">
                      <strong>Signature</strong>
                      <button
                        onClick={() => copyToClipboard(signMessageData, "signature")}
                        className="text-sm px-2 py-1 rounded border border-black/[.08] dark:border-white/[.145]"
                      >
                        {copied === "signature" ? "Copied! ✓" : "Copy"}
                      </button>
                    </div>
                    <code className="block p-2 bg-black/[.05] dark:bg-white/[.06] rounded font-mono text-sm break-all">
                      {signMessageData}
                    </code>
                  </div>
                )}
              </form>
            </section>

            {/* Send Transaction Section */}
            <section className="p-6 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
              <h2 className="text-xl font-semibold mb-4">Send Transaction</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.target as HTMLFormElement);
                  const amount = formData.get("amount") as string;
                  const destination = formData.get("destination") as string;

                  if (!destination || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                    alert("Please enter a valid address and amount.");
                    return;
                  }

                  sendTransaction({
                    to: destination as `0x${string}`,
                    value: parseEther(amount),
                    data: "0x",
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="Enter amount..."
                    className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium mb-2">
                    Destination Address
                  </label>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    placeholder="Enter destination address..."
                    className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTxPending}
                  className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                >
                  {isTxPending ? "Waiting for wallet..." : "Send Transaction"}
                </button>

                {txError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    {txError.message}
                  </div>
                )}

                {transactionData && (
                  <div className="mt-4 p-4 rounded-lg border border-black/[.08] dark:border-white/[.145]">
                    <div className="flex justify-between items-center mb-2">
                      <strong>Transaction Hash</strong>
                      <button
                        onClick={() => copyToClipboard(transactionData, "transaction")}
                        className="text-sm px-2 py-1 rounded border border-black/[.08] dark:border-white/[.145]"
                      >
                        {copied === "transaction" ? "Copied! ✓" : "Copy"}
                      </button>
                    </div>
                    <code className="block p-2 bg-black/[.05] dark:bg-white/[.06] rounded font-mono text-sm break-all">
                      {transactionData}
                    </code>
                  </div>
                )}
              </form>
            </section>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
