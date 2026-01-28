'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rss, ChevronDown, Settings, Flame, Code, Rocket, Newspaper, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WeatherWidget from '@/components/feeds/WeatherWidget';
import CalendarWidget from '@/components/feeds/CalendarWidget';
import RSSFeed from '@/components/feeds/RSSFeed';
import FeedManager from '@/components/feeds/FeedManager';
import { 
  CustomFeed, getFeeds, saveFeeds, addFeed, removeFeed, toggleFeed,
  getFeedExpandedState, saveFeedExpandedState 
} from '@/lib/storage';

const iconMap: Record<string, any> = {
  flame: Flame,
  code: Code,
  rocket: Rocket,
  newspaper: Newspaper,
  globe: Globe,
};

const getIconForFeed = (feedId: string) => {
  if (feedId === 'hn') return Flame;
  if (feedId.includes('github')) return Code;
  if (feedId.includes('product')) return Rocket;
  if (feedId.includes('lobster') || feedId.includes('devto') || feedId.includes('tech') || feedId.includes('ars')) return Newspaper;
  return Globe;
};

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<CustomFeed[]>([]);
  const [expandedFeeds, setExpandedFeeds] = useState<Record<string, boolean>>({});
  const [showManager, setShowManager] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFeeds(getFeeds());
    setExpandedFeeds(getFeedExpandedState());
  }, []);

  const toggleFeedExpanded = (feedId: string) => {
    const newState = { ...expandedFeeds, [feedId]: !expandedFeeds[feedId] };
    setExpandedFeeds(newState);
    saveFeedExpandedState(newState);
  };

  const handleAddFeed = (feed: Omit<CustomFeed, 'id'>) => {
    const updated = addFeed(feed);
    setFeeds(updated);
  };

  const handleRemoveFeed = (id: string) => {
    const updated = removeFeed(id);
    setFeeds(updated);
  };

  const handleToggleFeed = (id: string) => {
    const updated = toggleFeed(id);
    setFeeds(updated);
  };

  const enabledFeeds = feeds.filter(f => f.enabled);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

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
                  <p className="text-sm text-zinc-500 font-mono">{enabledFeeds.length} active feeds</p>
                </div>
              </div>
              <button 
                onClick={() => setShowManager(true)}
                className="btn-terminal px-4 py-2 flex items-center gap-2 text-sm"
              >
                <Settings size={16} />
                Manage
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
              {enabledFeeds.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <Rss className="mx-auto mb-4 opacity-50" size={48} />
                  <p>No feeds enabled</p>
                  <button
                    onClick={() => setShowManager(true)}
                    className="mt-4 text-[#0ea5e9] hover:underline"
                  >
                    Add some feeds
                  </button>
                </div>
              ) : (
                enabledFeeds.map((feed) => {
                  const Icon = getIconForFeed(feed.id);
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
                        onClick={() => toggleFeedExpanded(feed.id)}
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
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 overflow-hidden"
                          >
                            <RSSFeed 
                              feedId={feed.id}
                              type={feed.id === 'hn' ? 'hackernews' : 'rss'}
                              url={feed.url}
                              color={feed.color}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed Manager Modal */}
      <AnimatePresence>
        {showManager && (
          <FeedManager
            feeds={feeds}
            onAddFeed={handleAddFeed}
            onRemoveFeed={handleRemoveFeed}
            onToggleFeed={handleToggleFeed}
            onClose={() => setShowManager(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
