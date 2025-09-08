import { Toaster } from "@/app/_components/ui/sonner";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { UserProvider } from "@/lib/auth/provider";
import { getUser } from "@/lib/auth/server";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trigger.oi",
  description: "API to manage push notifications via webhooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = getUser();

  return (
    <html className="dark" lang="en">
      <body className={`${jetBrainsMono.className} antialiased`}>
        <div className="min-h-svh w-full">
          <UserProvider userPromise={user}>{children}</UserProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
