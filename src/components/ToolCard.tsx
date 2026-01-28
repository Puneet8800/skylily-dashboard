'use client';

import { motion } from 'framer-motion';
import { 
  Box, FlaskConical, ArrowUpRight, Download,
  Route, Code, GitBranch, DollarSign, Shield, FileText,
  Server, Sparkles, LayoutDashboard, Globe, Search, Activity,
  MapPin, Scan, Lock, FileCode, Map, Calculator, RotateCcw,
  Mail, ShieldCheck, Key, BadgeCheck, Gauge, Clock, BarChart2,
  Package, Wifi, TrendingUp, Terminal, DownloadCloud, Radar,
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
  downloads?: number;
}

interface ToolCardProps {
  tool: Tool;
  index: number;
  onClick?: () => void;
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

export default function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const Icon = tool.icon ? getIcon(tool.icon) : Box;
  
  const statusColors: Record<string, string> = {
    stable: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    beta: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    alpha: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-lily-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-lily-500/20 text-sky-400 group-hover:text-sky-300 transition-colors">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          
          {tool.status && (
            <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[tool.status] || statusColors.stable}`}>
              {tool.status}
            </span>
          )}
          
          {tool.version && !tool.status && (
            <span className="text-xs text-zinc-500 font-mono">
              v{tool.version}
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-white mb-1.5 group-hover:text-sky-100 transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between">
          {tool.tests !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <FlaskConical size={14} />
              <span>{tool.tests} tests</span>
            </div>
          )}
          
          {tool.downloads !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Download size={14} />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
          )}
          
          <ArrowUpRight 
            size={16} 
            className="text-zinc-600 group-hover:text-sky-400 transition-colors ml-auto" 
          />
        </div>
      </div>
    </motion.div>
  );
}
