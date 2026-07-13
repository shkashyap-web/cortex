import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { RBACProvider } from "@/hooks/useRBAC";
import Shell from "@/components/Shell";
import BootSequence from "@/components/boot/BootSequence";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CORTEX - Executive Decision Intelligence Platform",
  description: "Cognitive Orchestration & Reasoning Technology for Executive Decision Intelligence. The AI-native Enterprise Banking Operating System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-mono">
        <RBACProvider>
          <BootSequence>
            <Shell>{children}</Shell>
          </BootSequence>
        </RBACProvider>
      </body>
    </html>
  );
}