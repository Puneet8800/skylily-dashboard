'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, FlaskConical, Download, X, Github, Terminal, Folder,
  Route, Code, GitBranch, DollarSign, Shield, FileText,
  Server, Sparkles, LayoutDashboard, Globe, Search, Activity,
  MapPin, Scan, Lock, FileCode, Map, Calculator, RotateCcw,
  Mail, ShieldCheck, Key, BadgeCheck, Gauge, Clock, BarChart2,
  Package, Wifi, TrendingUp, DownloadCloud, Radar,
  Shovel, Link, Eye, Flame, Plug, Network, GitFork, Settings,
  Sliders, Zap
} from 'lucide-react';
import { ElementType } from 'react';

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

interface ToolModalProps {
  tool: Tool | null;
  onClose: () => void;
}

const iconMap: Record<string, ElementType> = {
  route: Route, code: Code, 'git-branch': GitBranch, 'dollar-sign': DollarSign,
  shield: Shield, 'file-text': FileText, 'flask-conical': FlaskConical,
  server: Server, sparkles: Sparkles, 'layout-dashboard': LayoutDashboard,
  globe: Globe, search: Search, activity: Activity, 'map-pin': MapPin,
  scan: Scan, lock: Lock, 'file-code': FileCode, map: Map,
  calculator: Calculator, 'rotate-ccw': RotateCcw, mail: Mail,
  'shield-check': ShieldCheck, key: Key, 'badge-check': BadgeCheck,
  gauge: Gauge, clock: Clock, 'bar-chart-2': BarChart2, package: Package,
  wifi: Wifi, 'trending-up': TrendingUp, terminal: Terminal,
  download: DownloadCloud, radar: Radar, shovel: Shovel, link: Link,
  eye: Eye, flame: Flame, plug: Plug, network: Network,
  'git-fork': GitFork, settings: Settings, sliders: Sliders, zap: Zap, box: Box
};

const getIcon = (iconName: string): ElementType => {
  return iconMap[iconName] || Box;
};

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  if (!tool) return null;
  
  const Icon = tool.icon ? getIcon(tool.icon) : Box;
  
  const statusColors: Record<string, string> = {
    stable: 'bg-emerald-500/20 text-emerald-400',
    beta: 'bg-amber-500/20 text-amber-400',
    alpha: 'bg-red-500/20 text-red-400',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl p-8 max-w-lg w-full relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-sky-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-lily-500/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/20 to-lily-500/20 text-sky-400">
                <Icon size={32} strokeWidth={1.5} />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {tool.version && (
                    <span className="text-sm text-zinc-500 font-mono">v{tool.version}</span>
                  )}
                  {tool.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tool.status]}`}>
                      {tool.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-zinc-300 mb-6 leading-relaxed">
              {tool.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {tool.tests !== undefined && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <FlaskConical size={16} />
                    <span className="text-sm">Tests</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{tool.tests}</p>
                </div>
              )}
              
              {tool.downloads !== undefined && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Download size={16} />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{tool.downloads.toLocaleString()}</p>
                </div>
              )}
              
              {tool.category && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Folder size={16} />
                    <span className="text-sm">Category</span>
                  </div>
                  <p className="text-lg font-semibold text-white capitalize">{tool.category}</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              {tool.github && (
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white font-medium"
                >
                  <Github size={18} />
                  View on GitHub
                </a>
              )}
              
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-lily-500 hover:from-sky-400 hover:to-lily-400 transition-all text-white font-medium"
              >
                <Terminal size={18} />
                Run Tool
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
