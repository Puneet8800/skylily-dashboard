'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rss, Cloud, Calendar, RefreshCw, ExternalLink, ChevronDown, 
  Plus, Settings, Flame, Code, Rocket, Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WeatherWidget from '@/components/feeds/WeatherWidget';
import CalendarWidget from '@/components/feeds/CalendarWidget';
import RSSFeed from '@/components/feeds/RSSFeed';

const defaultFeeds = [
  { id: 'hn', name: 'Hacker News', icon: Flame, color: '#f97316', type: 'hackernews' },
  { id: 'github', name: 'GitHub Trending', icon: Code, color: '#0ea5e9', type: 'rss', url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml' },
  { id: 'producthunt', name: 'Product Hunt', icon: Rocket, color: '#ec4899', type: 'rss', url: 'https://www.producthunt.com/feed' },
  { id: 'lobsters', name: 'Lobste.rs', icon: Newspaper, color: '#ef4444', type: 'rss', url: 'https://lobste.rs/rss' },
  { id: 'devto', name: 'Dev.to', icon: Code, color: '#a855f7', type: 'rss', url: 'https://dev.to/feed' },
];

export default function FeedsPage() {
  const [expandedFeeds, setExpandedFeeds] = useState<Record<string, boolean>>({
    hn: true,
    github: true,
  });

  const toggleFeed = (feedId: string) => {
    setExpandedFeeds(prev => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="matrix-bg" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#0ea5e9]/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-[#0ea5e9]/30 rounded-lg bg-[#0ea5e9]/5">
                  <Rss size={24} className="text-[#0ea5e9]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono">Feeds</h1>
                  <p className="text-sm text-zinc-500 font-mono">News & Updates</p>
                </div>
              </div>
              <button className="btn-terminal px-4 py-2 flex items-center gap-2 text-sm">
                <Plus size={16} />
                Add Feed
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Weather & Calendar */}
            <div className="lg:col-span-1 space-y-6">
              <WeatherWidget />
              <CalendarWidget />
            </div>

            {/* Main - Feeds */}
            <div className="lg:col-span-3 space-y-4">
              {defaultFeeds.map((feed) => {
                const Icon = feed.icon;
                const isExpanded = expandedFeeds[feed.id] ?? false;
                
                return (
                  <motion.div
                    key={feed.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-[#0a0a0a] border border-white/5 overflow-hidden"
                  >
                    {/* Feed Header */}
                    <button
                      onClick={() => toggleFeed(feed.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${feed.color}15` }}
                        >
                          <Icon size={18} style={{ color: feed.color }} />
                        </div>
                        <span className="font-mono text-white">{feed.name}</span>
                      </div>
                      <ChevronDown 
                        size={18} 
                        className={cn(
                          "text-zinc-500 transition-transform",
                          isExpanded && "rotate-180"
                        )} 
                      />
                    </button>
                    
                    {/* Feed Content */}
                    {isExpanded && (
                      <div className="border-t border-white/5">
                        <RSSFeed 
                          feedId={feed.id}
                          type={feed.type}
                          url={feed.url}
                          color={feed.color}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
