'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Server, Code, Globe, Sparkles, Folder, Briefcase, Users } from 'lucide-react';
import { CustomLink } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface LinkManagerProps {
  link?: CustomLink | null;
  categories: string[];
  onSave: (link: Omit<CustomLink, 'id'>) => void;
  onClose: () => void;
}

const iconOptions = [
  { id: 'server', icon: Server, label: 'Server' },
  { id: 'code', icon: Code, label: 'Code' },
  { id: 'globe', icon: Globe, label: 'Globe' },
  { id: 'sparkles', icon: Sparkles, label: 'AI' },
  { id: 'folder', icon: Folder, label: 'Folder' },
  { id: 'briefcase', icon: Briefcase, label: 'Work' },
  { id: 'users', icon: Users, label: 'Social' },
];

const defaultCategories = ['Homelab', 'Dev Tools', 'Social', 'Productivity', 'Other'];

export default function LinkManager({ link, categories, onSave, onClose }: LinkManagerProps) {
  const [formData, setFormData] = useState({
    title: link?.title || '',
    url: link?.url || '',
    icon: link?.icon || 'globe',
    category: link?.category || categories[0] || 'Other',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const allCategories = [...new Set([...defaultCategories, ...categories])];

  const handleSave = () => {
    if (formData.title && formData.url) {
      onSave(formData);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setShowNewCategory(false);
      setNewCategory('');
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
        className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-mono text-white">
            {link ? 'Edit Link' : 'Add Link'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="My Link"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormData(prev => ({ ...prev, icon: opt.id }))}
                    className={cn(
                      "p-2.5 rounded-lg border transition-all",
                      formData.icon === opt.id
                        ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/50 text-[#0ea5e9]"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    )}
                    title={opt.label}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Category</label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-[#0ea5e9] text-black rounded-lg text-sm font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowNewCategory(false)}
                  className="px-3 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      formData.category === cat
                        ? "bg-[#0ea5e9] text-black font-medium"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  <Plus size={14} />
                  New
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.title || !formData.url}
            className="px-6 py-2 bg-[#0ea5e9] text-black font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {link ? 'Save' : 'Add Link'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
