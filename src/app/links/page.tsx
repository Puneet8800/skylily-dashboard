'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, Plus, ExternalLink, Folder, Edit2, Trash2,
  Server, Code, Globe, Sparkles, LayoutGrid, LayoutList, Briefcase, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LinkManager from '@/components/links/LinkManager';
import { 
  CustomLink, getLinks, addLink, updateLink, removeLink,
  getLinkViewMode, saveLinkViewMode 
} from '@/lib/storage';

const iconMap: Record<string, any> = {
  server: Server,
  code: Code,
  globe: Globe,
  sparkles: Sparkles,
  folder: Folder,
  briefcase: Briefcase,
  users: Users,
};

const categoryColors: Record<string, string> = {
  'Homelab': '#0ea5e9',
  'Dev Tools': '#a855f7',
  'Social': '#ec4899',
  'Productivity': '#14b8a6',
  'Other': '#71717a',
};

export default function LinksPage() {
  const [links, setLinks] = useState<CustomLink[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showManager, setShowManager] = useState(false);
  const [editingLink, setEditingLink] = useState<CustomLink | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLinks(getLinks());
    setViewMode(getLinkViewMode());
  }, []);

  const handleViewModeChange = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    saveLinkViewMode(mode);
  };

  const handleAddLink = (link: Omit<CustomLink, 'id'>) => {
    const updated = addLink(link);
    setLinks(updated);
    setShowManager(false);
  };

  const handleEditLink = (id: string, data: Partial<CustomLink>) => {
    const updated = updateLink(id, data);
    setLinks(updated);
    setEditingLink(null);
  };

  const handleRemoveLink = (id: string) => {
    if (confirm('Remove this link?')) {
      const updated = removeLink(id);
      setLinks(updated);
    }
  };

  // Group links by category
  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, CustomLink[]>);

  const categories = Object.keys(groupedLinks);

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
                <div className="p-2 border border-[#14b8a6]/30 rounded-lg bg-[#14b8a6]/5">
                  <Link2 size={24} className="text-[#14b8a6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono">Links</h1>
                  <p className="text-sm text-zinc-500 font-mono">{links.length} bookmarks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'list' ? 'bg-[#14b8a6] text-black' : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'grid' ? 'bg-[#14b8a6] text-black' : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => setShowManager(true)}
                  className="btn-terminal px-4 py-2 flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {links.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Link2 className="mx-auto mb-4 opacity-50" size={48} />
              <p>No bookmarks yet</p>
              <button
                onClick={() => setShowManager(true)}
                className="mt-4 text-[#14b8a6] hover:underline"
              >
                Add your first link
              </button>
            </div>
          ) : (
            Object.entries(groupedLinks).map(([category, items]) => {
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
                      {items.map((link, index) => {
                        const Icon = iconMap[link.icon] || Globe;
                        return (
                          <motion.div
                            key={link.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 flex-1 min-w-0"
                            >
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${color}15` }}
                              >
                                <Icon size={16} style={{ color }} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-white group-hover:text-[#0ea5e9] transition-colors">
                                  {link.title}
                                </span>
                                <p className="text-xs text-zinc-600 truncate max-w-xs">
                                  {link.url}
                                </p>
                              </div>
                            </a>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingLink(link)}
                                className="p-2 text-zinc-500 hover:text-white transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleRemoveLink(link.id)}
                                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-zinc-500 hover:text-white transition-colors"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {items.map((link, index) => {
                        const Icon = iconMap[link.icon] || Globe;
                        return (
                          <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group relative"
                          >
                            <div 
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon size={24} style={{ color }} />
                            </div>
                            <span className="text-sm text-white text-center truncate w-full group-hover:text-[#0ea5e9] transition-colors">
                              {link.title}
                            </span>
                          </motion.a>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Link Manager Modal */}
      <AnimatePresence>
        {(showManager || editingLink) && (
          <LinkManager
            link={editingLink}
            categories={categories}
            onSave={(data) => {
              if (editingLink) {
                handleEditLink(editingLink.id, data);
              } else {
                handleAddLink(data);
              }
            }}
            onClose={() => {
              setShowManager(false);
              setEditingLink(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
