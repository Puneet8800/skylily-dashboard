'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, Github, Terminal, Wrench, FlaskConical, Package,
  Activity, Cpu
} from 'lucide-react';
import CostsChart from '@/components/CostsChart';
import { SystemWidget, DockerWidget, TailscaleWidget, ServicesWidget, QuickActions } from '@/components/widgets';
import toolsData from '@/data/tools.json';

export default function Home() {
  const totalTools = toolsData.coreTools.length + toolsData.networkTools.length;
  const totalTests = [...toolsData.coreTools, ...toolsData.networkTools].reduce(
    (sum, tool) => sum + (tool.tests || 0), 0
  );
  const totalLibraries = toolsData.utilityLibraries.length;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="matrix-bg" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#0ea5e9]/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 border border-[#0ea5e9]/30 rounded-lg bg-[#0ea5e9]/5">
                <Terminal className="text-[#0ea5e9]" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0ea5e9] font-mono">Skylily</h1>
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
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#14b8a6]/30 rounded-full bg-[#14b8a6]/5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse"></span>
              <span className="text-[#14b8a6] text-sm font-mono">SYSTEM ONLINE</span>
              <span className="text-zinc-500 text-sm font-mono">• v2.0.0</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4 font-mono"
            >
              <span className="text-white">Build</span>{' '}
              <span className="text-[#0ea5e9]">Smarter</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-zinc-400 max-w-xl mx-auto mb-8"
            >
              AI orchestration platform powered by intelligent routing and automated workflows.
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#0ea5e9]/10">
                  <Wrench size={14} className="text-[#0ea5e9]" />
                </div>
                <span className="text-2xl font-bold text-white">{totalTools}</span>
                <span className="text-zinc-500 text-sm">tools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#a855f7]/10">
                  <FlaskConical size={14} className="text-[#a855f7]" />
                </div>
                <span className="text-2xl font-bold text-white">{totalTests}</span>
                <span className="text-zinc-500 text-sm">tests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#14b8a6]/10">
                  <Package size={14} className="text-[#14b8a6]" />
                </div>
                <span className="text-2xl font-bold text-white">{totalLibraries}</span>
                <span className="text-zinc-500 text-sm">packages</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Metrics */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="p-2 border border-[#14b8a6]/30 rounded-lg bg-[#14b8a6]/5">
                <Activity size={20} className="text-[#14b8a6]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono">Live Metrics</h3>
                <p className="text-sm text-zinc-500 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse"></span>
                  Powered by pulsed
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <SystemWidget />
              <DockerWidget />
              <ServicesWidget />
              <TailscaleWidget />
              <QuickActions />
              <CostsChart daily={toolsData.apiCosts.daily} monthly={toolsData.apiCosts.monthly} />
            </div>
          </div>
        </section>

        {/* Footer spacer for tab bar */}
        <div className="h-8" />
      </div>
    </div>
  );
}
