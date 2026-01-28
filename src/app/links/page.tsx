'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, Plus, Grid, List, ExternalLink, Folder, 
  Server, Code, Globe, Sparkles, LayoutGrid, LayoutList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category: string;
}

const defaultBookmarks: Bookmark[] = [
  // Homelab Services
  { id: '1', title: 'Dashy Dashboard', url: 'https://dashy.local', category: 'Homelab', icon: 'server' },
  { id: '2', title: 'Glance Dashboard', url: 'https://glance.local', category: 'Homelab', icon: 'server' },
  { id: '3', title: 'Presenton AI', url: 'https://presenton.local', category: 'Homelab', icon: 'sparkles' },
  { id: '4', title: 'Netdata Monitor', url: 'https://netdata.local', category: 'Homelab', icon: 'server' },
  { id: '5', title: 'Clawdbot Gateway', url: 'https://clawdbot.local', category: 'Homelab', icon: 'sparkles' },
  { id: '6', title: 'RSS Bridge', url: 'https://rss-bridge.local', category: 'Homelab', icon: 'server' },
  { id: '7', title: 'Uptime Kuma', url: 'http://localhost:19999', category: 'Homelab', icon: 'server' },
  // Dev Tools
  { id: '8', title: 'GitHub', url: 'https://github.com', category: 'Dev Tools', icon: 'code' },
  { id: '9', title: 'VS Code Web', url: 'https://vscode.dev', category: 'Dev Tools', icon: 'code' },
  { id: '10', title: 'Vercel', url: 'https://vercel.com', category: 'Dev Tools', icon: 'globe' },
  // Social
  { id: '11', title: 'Twitter/X', url: 'https://x.com', category: 'Social', icon: 'globe' },
  { id: '12', title: 'LinkedIn', url: 'https://linkedin.com', category: 'Social', icon: 'globe' },
];

const iconMap: Record<string, any> = {
  server: Server,
  code: Code,
  globe: Globe,
  sparkles: Sparkles,
};

export default function LinksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(defaultBookmarks);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Group bookmarks by category
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.category]) acc[bookmark.category] = [];
    acc[bookmark.category].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  const categoryColors: Record<string, string> = {
    'Homelab': '#0ea5e9',
    'Dev Tools': '#a855f7',
    'Social': '#ec4899',
    'Productivity': '#14b8a6',
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
                <div className="p-2 border border-[#14b8a6]/30 rounded-lg bg-[#14b8a6]/5">
                  <Link2 size={24} className="text-[#14b8a6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono">Links</h1>
                  <p className="text-sm text-zinc-500 font-mono">{bookmarks.length} bookmarks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'list' ? 'bg-[#14b8a6] text-black' : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'grid' ? 'bg-[#14b8a6] text-black' : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
                <button className="btn-terminal px-4 py-2 flex items-center gap-2 text-sm">
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {Object.entries(groupedBookmarks).map(([category, items]) => {
            const color = categoryColors[category] || '#71717a';
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Folder size={16} style={{ color }} />
                  <h2 className="text-lg font-mono text-white">{category}</h2>
                  <span className="text-xs text-zinc-500">({items.length})</span>
                </div>

                {/* Bookmarks */}
                {viewMode === 'list' ? (
                  <div className="space-y-2">
                    {items.map((bookmark, index) => {
                      const Icon = iconMap[bookmark.icon || 'globe'] || Globe;
                      return (
                        <motion.a
                          key={bookmark.id}
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon size={16} style={{ color }} />
                            </div>
                            <div>
                              <span className="text-white group-hover:text-[#0ea5e9] transition-colors">
                                {bookmark.title}
                              </span>
                              <p className="text-xs text-zinc-600 truncate max-w-xs">
                                {bookmark.url}
                              </p>
                            </div>
                          </div>
                          <ExternalLink size={14} className="text-zinc-600 group-hover:text-zinc-400" />
                        </motion.a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {items.map((bookmark, index) => {
                      const Icon = iconMap[bookmark.icon || 'globe'] || Globe;
                      return (
                        <motion.a
                          key={bookmark.id}
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group"
                        >
                          <div 
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon size={24} style={{ color }} />
                          </div>
                          <span className="text-sm text-white text-center truncate w-full group-hover:text-[#0ea5e9] transition-colors">
                            {bookmark.title}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
