'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, X, Check, GripVertical, Eye, EyeOff } from 'lucide-react';
import { CustomFeed } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface FeedManagerProps {
  feeds: CustomFeed[];
  onAddFeed: (feed: Omit<CustomFeed, 'id'>) => void;
  onRemoveFeed: (id: string) => void;
  onToggleFeed: (id: string) => void;
  onClose: () => void;
}

const colorOptions = [
  '#0ea5e9', '#14b8a6', '#22c55e', '#a855f7', 
  '#ec4899', '#f97316', '#ef4444', '#facc15'
];

export default function FeedManager({ feeds, onAddFeed, onRemoveFeed, onToggleFeed, onClose }: FeedManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState({ name: '', url: '', color: '#0ea5e9' });

  const handleAdd = () => {
    if (newFeed.name && newFeed.url) {
      onAddFeed({ ...newFeed, enabled: true });
      setNewFeed({ name: '', url: '', color: '#0ea5e9' });
      setShowAddForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-[#0ea5e9]" />
            <h3 className="text-lg font-mono text-white">Manage Feeds</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Feed List */}
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-2">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                feed.enabled 
                  ? "bg-white/[0.02] border-white/10" 
                  : "bg-transparent border-white/5 opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: feed.color }}
                />
                <div>
                  <p className="text-sm text-white">{feed.name}</p>
                  {feed.url && (
                    <p className="text-xs text-zinc-600 truncate max-w-[200px]">{feed.url}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFeed(feed.id)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                  title={feed.enabled ? 'Disable' : 'Enable'}
                >
                  {feed.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {feed.id.startsWith('custom-') && (
                  <button
                    onClick={() => onRemoveFeed(feed.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Form */}
        <div className="p-4 border-t border-white/5">
          {showAddForm ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Feed name"
                value={newFeed.name}
                onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
              />
              <input
                type="url"
                placeholder="RSS feed URL"
                value={newFeed.url}
                onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Color:</span>
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFeed(prev => ({ ...prev, color }))}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform",
                      newFeed.color === color && "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!newFeed.name || !newFeed.url}
                  className="flex-1 py-2 bg-[#0ea5e9] text-black font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Feed
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 border border-dashed border-white/20 rounded-lg text-zinc-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Custom Feed
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
