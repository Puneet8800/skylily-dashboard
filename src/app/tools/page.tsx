'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, ChevronRight, Command, Code, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ToolCard from '@/components/ToolCard';
import ToolModal from '@/components/ToolModal';
import toolsData from '@/data/tools.json';

interface Tool {
  id: string;
  name: string;
  description: string;
  tests?: number;
  icon?: string;
  version?: string;
  status?: string;
  github?: string;
  category?: string;
  downloads?: number;
}

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTools, setShowAllTools] = useState(false);
  
  const totalLibraries = toolsData.utilityLibraries.length;
  
  const filteredTools = useMemo(() => {
    let tools = [...toolsData.coreTools, ...toolsData.networkTools];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower)
      );
    }
    return tools;
  }, [searchTerm]);

  const displayedTools = showAllTools ? filteredTools : filteredTools.slice(0, 12);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="matrix-bg" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#0ea5e9]/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-[#ec4899]/30 rounded-lg bg-[#ec4899]/5">
                <Wrench size={24} className="text-[#ec4899]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-mono">Tools</h1>
                <p className="text-sm text-zinc-500 font-mono">{filteredTools.length} available</p>
              </div>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="py-6 px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="relative max-w-md">
              <Command size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-[#0ea5e9]/20 rounded-lg text-white placeholder:text-zinc-600 font-mono text-sm focus:outline-none focus:border-[#0ea5e9]/50"
              />
            </div>
          </div>
        </section>

        {/* Core Tools */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-bold text-white font-mono mb-6">Core Tools</h2>
            
            <AnimatePresence mode="popLayout">
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedTools.map((tool, index) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    index={index}
                    onClick={() => setSelectedTool(tool)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            
            {filteredTools.length > 12 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <button
                  onClick={() => setShowAllTools(!showAllTools)}
                  className="btn-terminal px-6 py-3 flex items-center gap-2"
                >
                  <span className="text-zinc-500">&gt;</span>
                  {showAllTools ? 'show_less' : `view_all --count ${filteredTools.length}`}
                  <ChevronRight size={16} className={cn("transition-transform", showAllTools && "rotate-90")} />
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Utility Libraries */}
        <section className="py-8 px-6 border-t border-[#0ea5e9]/10">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#f97316]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 border border-[#f97316]/30 rounded-lg bg-[#f97316]/5">
                  <Code size={18} className="text-[#f97316]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Utility Libraries</h3>
                  <p className="text-xs text-zinc-500 font-mono">{totalLibraries} packages</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {toolsData.utilityLibraries.map((lib, index) => {
                  const colors = [
                    '#0ea5e9', '#22d3ee', '#a855f7', '#ec4899', '#3b82f6', '#f97316',
                    '#14b8a6', '#facc15', '#ef4444', '#84cc16', '#0ea5e9', '#22d3ee'
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <motion.button
                      key={lib.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index }}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedTool({ ...lib, category: 'utility' })}
                      className="flex items-center justify-between p-3 rounded-lg transition-all text-left group"
                      style={{
                        background: `${color}08`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: `${color}20`
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-mono truncate" style={{ color }}>{lib.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{lib.description}</p>
                      </div>
                      <ExternalLink size={14} className="text-zinc-600 shrink-0 ml-2" style={{ color: `${color}80` }} />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        
        {/* Tool Modal */}
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      </div>
    </div>
  );
}
