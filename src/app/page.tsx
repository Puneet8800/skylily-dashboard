'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Github, 
  Wrench, 
  FlaskConical, 
  Package,
  Network,
  Library,
  ChevronRight,
  ExternalLink,
  Terminal,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedCounter from '@/components/AnimatedCounter';
import ToolCard from '@/components/ToolCard';
import ToolModal from '@/components/ToolModal';
import CostsChart from '@/components/CostsChart';
import SystemStatus from '@/components/SystemStatus';
import ActivityFeed from '@/components/ActivityFeed';
import SearchFilter from '@/components/SearchFilter';
import { cn } from '@/lib/utils';

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

// Filter categories for network tools
const networkFilterCategories: Record<string, string[]> = {
  'All': [],
  'DNS': ['dns-lookup', 'dig', 'host', 'reverse-dns', 'mx-lookup'],
  'Security': ['ssl-check', 'spf-check', 'dkim-verify', 'dmarc-check', 'port-scan', 'iptables'],
  'Performance': ['speed-test', 'latency-test', 'iperf', 'bandwidth-mon', 'ping'],
  'Analysis': ['packet-capture', 'tcpdump', 'netstat', 'mtr', 'traceroute', 'nmap'],
};

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAllNetworkTools, setShowAllNetworkTools] = useState(false);
  const [showAllLibraries, setShowAllLibraries] = useState(false);
  
  // Calculate totals
  const totalTools = toolsData.coreTools.length + toolsData.networkTools.length;
  const totalTests = [...toolsData.coreTools, ...toolsData.networkTools].reduce(
    (sum, tool) => sum + (tool.tests || 0), 0
  );
  const totalLibraries = toolsData.utilityLibraries.length;
  
  // Filter network tools based on search and category
  const filteredNetworkTools = useMemo(() => {
    let tools = toolsData.networkTools;
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(lowerSearch) ||
        tool.description.toLowerCase().includes(lowerSearch) ||
        tool.id.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply category filter
    if (activeFilter !== 'All') {
      const categoryIds = networkFilterCategories[activeFilter] || [];
      tools = tools.filter(tool => categoryIds.includes(tool.id));
    }
    
    return tools;
  }, [searchTerm, activeFilter]);

  // Filter core tools based on search
  const filteredCoreTools = useMemo(() => {
    if (!searchTerm) return toolsData.coreTools;
    
    const lowerSearch = searchTerm.toLowerCase();
    return toolsData.coreTools.filter(tool => 
      tool.name.toLowerCase().includes(lowerSearch) ||
      tool.description.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  // Filter libraries based on search
  const filteredLibraries = useMemo(() => {
    if (!searchTerm) return toolsData.utilityLibraries;
    
    const lowerSearch = searchTerm.toLowerCase();
    return toolsData.utilityLibraries.filter(lib => 
      lib.name.toLowerCase().includes(lowerSearch) ||
      lib.description.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  // Displayed tools count
  const displayedNetworkTools = showAllNetworkTools 
    ? filteredNetworkTools 
    : filteredNetworkTools.slice(0, 15);
  
  const displayedLibraries = showAllLibraries 
    ? filteredLibraries 
    : filteredLibraries.slice(0, 12);

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="mesh-gradient" />
      <div className="mesh-gradient-layer" />
      <div className="noise-overlay" />
      <div className="bg-grid-pattern fixed inset-0 pointer-events-none opacity-[0.02]" />
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={cn(
                "p-2.5 rounded-xl",
                "bg-gradient-to-br from-teal-500/20 to-cyan-500/10",
                "border border-teal-500/20"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Sparkles className="text-teal-400" size={24} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">Skylily</h1>
              <p className="text-sm text-zinc-500">AI Orchestration Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/Puneet8800/skylily-smart-router#readme', '_blank')}
              className="hidden sm:flex bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-white"
            >
              <Terminal size={14} className="mr-2" />
              CLI Docs
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://github.com/Puneet8800', '_blank')}
              className="bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-white"
            >
              <Github size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </div>
        </motion.header>
        
        {/* Hero Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-xs font-medium text-teal-300 tracking-wide">v2.0 • Production Ready</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                <span className="gradient-text-premium">Build Smarter</span>
              </h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            >
              A comprehensive toolkit for AI development, orchestration, and deployment.
              <span className="text-zinc-500"> Powered by intelligent routing and automated workflows.</span>
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={cn(
                "relative rounded-2xl p-6 text-center",
                "bg-zinc-900/80 backdrop-blur-sm",
                "border border-white/[0.06] group-hover:border-teal-500/20",
                "transition-all duration-300"
              )}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 group-hover:bg-teal-500/15 transition-colors">
                    <Wrench className="text-teal-400" size={18} />
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">Total Tools</span>
                </div>
                <p className="text-5xl font-bold text-white tracking-tight">
                  <AnimatedCounter value={totalTools} />
                </p>
              </div>
            </motion.div>
            
            {/* Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={cn(
                "relative rounded-2xl p-6 text-center",
                "bg-zinc-900/80 backdrop-blur-sm",
                "border border-white/[0.06] group-hover:border-emerald-500/20",
                "transition-all duration-300"
              )}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/15 transition-colors">
                    <FlaskConical className="text-emerald-400" size={18} />
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">Tests Passing</span>
                </div>
                <p className="text-5xl font-bold text-white tracking-tight">
                  <AnimatedCounter value={totalTests} />
                </p>
              </div>
            </motion.div>
            
            {/* Libraries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={cn(
                "relative rounded-2xl p-6 text-center",
                "bg-zinc-900/80 backdrop-blur-sm",
                "border border-white/[0.06] group-hover:border-amber-500/20",
                "transition-all duration-300"
              )}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/15 transition-colors">
                    <Package className="text-amber-400" size={18} />
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">Utility Packages</span>
                </div>
                <p className="text-5xl font-bold text-white tracking-tight">
                  <AnimatedCounter value={totalLibraries} />
                </p>
              </div>
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
            <div className={cn(
              "p-2 rounded-lg",
              "bg-gradient-to-br from-teal-500/20 to-cyan-500/10",
              "border border-teal-500/20"
            )}>
              <Zap className="text-teal-400" size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Core Tools</h2>
            <Badge variant="outline" className="ml-auto bg-white/[0.02] border-white/[0.08] text-zinc-400">
              {filteredCoreTools.length} tools
            </Badge>
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
              layout
            >
              {filteredCoreTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={index}
                  onClick={() => setSelectedTool(tool)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredCoreTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-500"
            >
              No core tools match your search.
            </motion.div>
          )}
        </section>
        
        {/* Network Toolkit */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className={cn(
              "p-2 rounded-lg",
              "bg-gradient-to-br from-cyan-500/20 to-emerald-500/10",
              "border border-cyan-500/20"
            )}>
              <Network className="text-cyan-400" size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Network Toolkit</h2>
            <Badge variant="outline" className="ml-auto bg-white/[0.02] border-white/[0.08] text-zinc-400">
              {toolsData.networkTools.length} tools
            </Badge>
          </motion.div>
          
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filters={Object.keys(networkFilterCategories)}
            resultCount={filteredNetworkTools.length}
            totalCount={toolsData.networkTools.length}
          />
          
          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              layout
            >
              {displayedNetworkTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={index}
                  onClick={() => setSelectedTool(tool as Tool)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredNetworkTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-500"
            >
              No network tools match your search.
            </motion.div>
          )}
          
          {filteredNetworkTools.length > 15 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-6"
            >
              <Button
                variant="outline"
                onClick={() => setShowAllNetworkTools(!showAllNetworkTools)}
                className="bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-white"
              >
                {showAllNetworkTools ? 'Show less' : `View all ${filteredNetworkTools.length} tools`}
                <ChevronRight size={16} className={cn("ml-2 transition-transform", showAllNetworkTools && "rotate-90")} />
              </Button>
            </motion.div>
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
                className={cn(
                  "rounded-2xl p-6",
                  "bg-gradient-to-b from-white/[0.04] to-white/[0.01]",
                  "border border-white/[0.08]"
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-br from-amber-500/20 to-orange-500/10",
                    "border border-amber-500/20"
                  )}>
                    <Library className="text-amber-400" size={18} />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Utility Libraries</h2>
                  <Badge variant="outline" className="ml-auto bg-white/[0.02] border-white/[0.08] text-zinc-400">
                    {filteredLibraries.length} packages
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {displayedLibraries.map((lib, index) => (
                    <motion.a
                      key={lib.id}
                      href="#"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.02 }}
                      whileHover={{ x: 4 }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTool({
                          ...lib,
                          category: 'utility',
                          tests: undefined,
                        });
                      }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        "hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]",
                        "transition-all group cursor-pointer"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-teal-100 transition-colors truncate">
                          {lib.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {lib.description}
                        </p>
                      </div>
                      <ExternalLink size={14} className="text-zinc-600 group-hover:text-teal-400 transition-colors shrink-0 ml-2" />
                    </motion.a>
                  ))}
                </div>
                
                {filteredLibraries.length > 12 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllLibraries(!showAllLibraries)}
                    className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  >
                    {showAllLibraries ? 'Show less' : `View all ${filteredLibraries.length} packages`}
                    <ArrowRight size={14} className={cn("ml-2 transition-transform", showAllLibraries && "rotate-90")} />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center py-10 border-t border-white/[0.04]"
        >
          <p className="text-zinc-600 text-sm font-medium">
            Built with <span className="text-teal-500">♥</span> by{' '}
            <span className="text-zinc-400">Skylily</span>
            <span className="mx-2 text-zinc-700">•</span>
            Running on M4 Pro Mac
          </p>
        </motion.footer>
        
        {/* Tool Modal */}
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      </div>
    </div>
  );
}
