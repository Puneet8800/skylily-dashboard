'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Rss, Wrench, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/feeds', label: 'Feeds', icon: Rss },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/links', label: 'Links', icon: Link2 },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/5">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || 
              (tab.href !== '/' && pathname.startsWith(tab.href));
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all",
                  isActive 
                    ? "text-[#0ea5e9]" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#0ea5e9]/10 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10 text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-bottom bg-[#0a0a0a]" />
    </nav>
  );
}
