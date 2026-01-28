import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skylily Dashboard | AI Orchestration Platform",
  description: "Beautiful dashboard for the Skylily AI orchestration ecosystem",
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
    <html lang="en">
      <body className="antialiased bg-[#0a0a0f] min-h-screen">
        <div className="noise" />
        <div className="fixed inset-0 bg-grid opacity-50" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-lily-500/10 via-transparent to-transparent pointer-events-none" />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
