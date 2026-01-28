import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skylily Dashboard | AI Orchestration Platform",
  description: "Premium dashboard for the Skylily AI orchestration ecosystem. Build smarter with intelligent routing and automated workflows.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
