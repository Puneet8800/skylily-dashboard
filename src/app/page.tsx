'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Github, 
  Wrench, 
  FlaskConical, 
  Package,
  Network,
  Library,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

import AnimatedCounter from '@/components/AnimatedCounter';
import ToolCard from '@/components/ToolCard';
import ToolModal from '@/components/ToolModal';
import CostsChart from '@/components/CostsChart';
import SystemStatus from '@/components/SystemStatus';
import ActivityFeed from '@/components/ActivityFeed';
import SearchFilter from '@/components/SearchFilter';

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

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Calculate totals
  const totalTools = toolsData.coreTools.length + toolsData.networkTools.length;
  const totalTests = [...toolsData.coreTools, ...toolsData.networkTools].reduce(
    (sum, tool) => sum + (tool.tests || 0), 0
  );
  const totalLibraries = toolsData.utilityLibraries.length;
  
  // Filter network tools
  const filteredNetworkTools = useMemo(() => {
    let tools = toolsData.networkTools;
    
    if (searchTerm) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return tools;
  }, [searchTerm]);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-lily-500/20">
            <Sparkles className="text-sky-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Skylily</h1>
            <p className="text-sm text-zinc-500">AI Orchestration Platform</p>
          </div>
        </div>
        
        <a
          href="https://github.com/Puneet8800"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white"
        >
          <Github size={18} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </motion.header>
      
      {/* Hero Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Build Smarter</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for AI development, orchestration, and deployment. 
            Powered by intelligent routing and automated workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tools */}
          <motion.div
            whileHover={{ y: -4 }}
            className="gradient-border rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Wrench className="text-sky-400" size={24} />
              <span className="text-zinc-400">Total Tools</span>
            </div>
            <p className="text-5xl font-bold text-white">
              <AnimatedCounter value={totalTools} />
            </p>
          </motion.div>
          
          {/* Tests */}
          <motion.div
            whileHover={{ y: -4 }}
            className="gradient-border rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <FlaskConical className="text-lily-400" size={24} />
              <span className="text-zinc-400">Tests Passing</span>
            </div>
            <p className="text-5xl font-bold text-white">
              <AnimatedCounter value={totalTests} />
            </p>
          </motion.div>
          
          {/* Libraries */}
          <motion.div
            whileHover={{ y: -4 }}
            className="gradient-border rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Package className="text-emerald-400" size={24} />
              <span className="text-zinc-400">Utility Packages</span>
            </div>
            <p className="text-5xl font-bold text-white">
              <AnimatedCounter value={totalLibraries} />
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Core Tools */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500/20 to-lily-500/20">
            <Sparkles className="text-sky-400" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">Core Tools</h2>
          <span className="text-sm text-zinc-500 ml-auto">
            {toolsData.coreTools.length} tools
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {toolsData.coreTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={index}
              onClick={() => setSelectedTool(tool)}
            />
          ))}
        </div>
      </section>
      
      {/* Network Toolkit */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
            <Network className="text-emerald-400" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">Network Toolkit</h2>
          <span className="text-sm text-zinc-500 ml-auto">
            {toolsData.networkTools.length} tools
          </span>
        </motion.div>
        
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={['All', 'DNS', 'Security', 'Performance', 'Analysis']}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredNetworkTools.slice(0, 15).map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={index}
              onClick={() => setSelectedTool(tool as Tool)}
            />
          ))}
        </div>
        
        {filteredNetworkTools.length > 15 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white"
          >
            View all {filteredNetworkTools.length} tools
            <ChevronRight size={16} />
          </motion.button>
        )}
      </section>
      
      {/* Dashboard Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CostsChart daily={toolsData.apiCosts.daily} monthly={toolsData.apiCosts.monthly} />
          <SystemStatus 
            uptime={toolsData.systemStatus.uptime}
            memory={toolsData.systemStatus.memory}
            cpu={toolsData.systemStatus.cpu}
            dockerContainers={toolsData.systemStatus.dockerContainers}
          />
        </div>
      </section>
      
      {/* Activity & Libraries */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <ActivityFeed activities={toolsData.recentActivity} />
          
          {/* Utility Libraries */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                  <Library className="text-violet-400" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-white">Utility Libraries</h2>
                <span className="text-sm text-zinc-500 ml-auto">
                  {toolsData.utilityLibraries.length} packages
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {toolsData.utilityLibraries.slice(0, 12).map((lib, index) => (
                  <motion.a
                    key={lib.id}
                    href="#"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-sky-100 transition-colors">
                        {lib.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate max-w-[180px]">
                        {lib.description}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-zinc-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  </motion.a>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                View all {toolsData.utilityLibraries.length} packages →
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center py-8 border-t border-white/5"
      >
        <p className="text-zinc-500 text-sm">
          Built with 💜 by <span className="text-white">Skylily</span> • 
          Running on M4 Pro Mac
        </p>
      </motion.footer>
      
      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
}
