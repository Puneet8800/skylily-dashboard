'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Github, Terminal, Wrench, FlaskConical, Package,
  Network, ChevronRight, Zap, Command, Cpu, Activity, Server,
  Code, GitBranch, Shield, BarChart3, Clock, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ToolCard from '@/components/ToolCard';
import ToolModal from '@/components/ToolModal';
import CostsChart from '@/components/CostsChart';
import SystemStatus from '@/components/SystemStatus';
import ActivityFeed from '@/components/ActivityFeed';

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

const filterCategories = ['All', 'DNS', 'Security', 'Performance', 'Analysis'];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAllTools, setShowAllTools] = useState(false);
  
  const totalTools = toolsData.coreTools.length + toolsData.networkTools.length;
  const totalTests = [...toolsData.coreTools, ...toolsData.networkTools].reduce(
    (sum, tool) => sum + (tool.tests || 0), 0
  );
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
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#00ff00]/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 border border-[#00ff00]/30 rounded-lg bg-[#00ff00]/5">
                <Terminal className="text-[#00ff00]" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#00ff00] font-mono">Skylily</h1>
                <p className="text-xs text-zinc-500 font-mono">AI Orchestration Platform</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button 
                onClick={() => window.open('https://github.com/Puneet8800/skylily-smart-router#readme', '_blank')}
                className="btn-terminal text-sm px-4 py-2"
              >
                <span className="text-zinc-500 mr-1">&gt;</span> docs
              </button>
              <button 
                onClick={() => window.open('https://github.com/Puneet8800', '_blank')}
                className="btn-terminal-filled text-sm px-4 py-2 flex items-center gap-2"
              >
                <Github size={16} />
                GitHub
              </button>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#00ff00]/30 rounded-full bg-[#00ff00]/5 mb-8"
            >
              <span className="status-live text-[#00ff00] text-sm font-mono">SYSTEM ONLINE</span>
              <span className="text-zinc-500 text-sm font-mono">• v2.0.0</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-mono"
            >
              <span className="text-white">Build</span>{' '}
              <span className="text-[#00ff00] glow-green">Smarter</span>
              <span className="cursor-blink"></span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              A comprehensive toolkit for AI development, orchestration, and deployment.
              <span className="text-zinc-500"> Powered by intelligent routing and automated workflows.</span>
            </motion.p>
            
            {/* Stats Grid - Multi-colored */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              <div className="p-6 text-center rounded-lg bg-[#0a0a0a] border border-[#00ff00]/20 hover:border-[#00ff00]/40 transition-all">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-[#00ff00]/10">
                    <Wrench size={16} className="text-[#00ff00]" />
                  </div>
                  <span className="text-zinc-500 text-sm font-mono">tools</span>
                </div>
                <p className="text-4xl font-bold text-[#00ff00] font-mono">{totalTools}</p>
              </div>
              
              <div className="p-6 text-center rounded-lg bg-[#0a0a0a] border border-[#a855f7]/20 hover:border-[#a855f7]/40 transition-all">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-[#a855f7]/10">
                    <FlaskConical size={16} className="text-[#a855f7]" />
                  </div>
                  <span className="text-zinc-500 text-sm font-mono">tests</span>
                </div>
                <p className="text-4xl font-bold text-[#a855f7] font-mono">{totalTests}</p>
              </div>
              
              <div className="p-6 text-center rounded-lg bg-[#0a0a0a] border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-all">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-[#00ffff]/10">
                    <Package size={16} className="text-[#00ffff]" />
                  </div>
                  <span className="text-zinc-500 text-sm font-mono">packages</span>
                </div>
                <p className="text-4xl font-bold text-[#00ffff] font-mono">{totalLibraries}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack Tags - Multi-colored */}
        <section className="py-8 px-6 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-zinc-500 text-sm font-mono mr-2">Tools we build:</span>
              {[
                { name: 'Clawdbot', color: '#f97316' },
                { name: 'Ollama', color: '#00ff00' },
                { name: 'Docker', color: '#3b82f6' },
                { name: 'n8n', color: '#ec4899' },
                { name: 'Tailscale', color: '#00ffff' },
                { name: 'Home Assistant', color: '#14b8a6' },
                { name: 'Caddy', color: '#a855f7' },
                { name: 'Redis', color: '#ef4444' },
              ].map((tech) => (
                <span 
                  key={tech.name} 
                  className="px-3 py-1 rounded-full text-xs font-mono border transition-all hover:scale-105"
                  style={{
                    color: tech.color,
                    borderColor: `${tech.color}33`,
                    background: `${tech.color}15`
                  }}
                >
                  {tech.name}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-[#ec4899]/30 rounded-lg bg-[#ec4899]/5">
                  <Zap size={20} className="text-[#ec4899]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-mono">Core Tools</h3>
                  <p className="text-sm text-zinc-500 font-mono">{filteredTools.length} available</p>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Command size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-transparent border border-[#00ff00]/20 rounded-lg text-white placeholder:text-zinc-600 font-mono text-sm focus:outline-none focus:border-[#00ff00]/50"
                />
              </div>
            </motion.div>
            
            {/* Tools Grid */}
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

        {/* Dashboard Grid */}
        <section className="py-16 px-6 border-t border-[#00ff00]/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 border border-[#3b82f6]/30 rounded-lg bg-[#3b82f6]/5">
                <BarChart3 size={20} className="text-[#3b82f6]" />
              </div>
              <h3 className="text-2xl font-bold text-white font-mono">System Status</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostsChart daily={toolsData.apiCosts.daily} monthly={toolsData.apiCosts.monthly} />
              <SystemStatus 
                uptime={toolsData.systemStatus.uptime}
                memory={toolsData.systemStatus.memory}
                cpu={toolsData.systemStatus.cpu}
                dockerContainers={toolsData.systemStatus.dockerContainers}
              />
            </div>
          </div>
        </section>

        {/* Activity & Libraries */}
        <section className="py-16 px-6 border-t border-[#00ff00]/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ActivityFeed activities={toolsData.recentActivity} />
              
              {/* Utility Libraries */}
              <div className="lg:col-span-2">
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
                    {toolsData.utilityLibraries.slice(0, 12).map((lib, index) => {
                      const colors = [
                        '#00ff00', '#00ffff', '#a855f7', '#ec4899', '#3b82f6', '#f97316',
                        '#14b8a6', '#facc15', '#ef4444', '#84cc16', '#00ff00', '#00ffff'
                      ];
                      const color = colors[index % colors.length];
                      return (
                        <motion.button
                          key={lib.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ x: 4 }}
                          onClick={() => setSelectedTool({ ...lib, category: 'utility' })}
                          className="flex items-center justify-between p-3 rounded-lg transition-all text-left group"
                          style={{
                            background: `${color}08`,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: `${color}20`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${color}50`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${color}20`;
                          }}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-mono truncate" style={{ color }}>{lib.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{lib.description}</p>
                          </div>
                          <ExternalLink size={14} className="text-zinc-600 shrink-0 ml-2 transition-colors" style={{ color: `${color}80` }} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#00ff00]/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-zinc-600 text-sm font-mono">
              Built with <span className="text-[#00ff00]">♥</span> by{' '}
              <span className="text-zinc-400">Skylily</span>
              <span className="mx-2">•</span>
              Running on M4 Pro Mac
            </p>
          </div>
        </footer>
        
        {/* Tool Modal */}
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      </div>
    </div>
  );
}
