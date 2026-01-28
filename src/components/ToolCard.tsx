'use client';

import { useRef, useState } from 'react';
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
import { cn } from '@/lib/utils';

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
  return iconMap[iconName] || Terminal;
};

export default function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const Icon = tool.icon ? getIcon(tool.icon) : Terminal;
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors: Record<string, string> = {
    stable: 'text-[#00ff00] border-[#00ff00]/30 bg-[#00ff00]/10',
    beta: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    alpha: 'text-red-400 border-red-400/30 bg-red-400/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Glow effect on hover */}
      <div 
        className={cn(
          "absolute -inset-[1px] rounded-lg opacity-0 transition-opacity duration-300",
          "bg-gradient-to-b from-[#00ff00]/20 to-transparent",
          isHovered && "opacity-100"
        )}
      />
      
      {/* Card */}
      <div className={cn(
        "relative rounded-lg p-4",
        "bg-[#0a0a0a] border border-[#00ff00]/10",
        "group-hover:border-[#00ff00]/40",
        "transition-all duration-300"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "p-2 rounded-md",
            "bg-[#00ff00]/5 border border-[#00ff00]/20",
            "group-hover:bg-[#00ff00]/10 group-hover:border-[#00ff00]/30",
            "transition-all duration-300"
          )}>
            <Icon size={16} className="text-[#00ff00]" />
          </div>
          
          {tool.status && (
            <span className={cn(
              "text-[10px] font-mono uppercase px-2 py-0.5 rounded border",
              statusColors[tool.status] || statusColors.stable
            )}>
              {tool.status}
            </span>
          )}
          
          {tool.version && !tool.status && (
            <span className="text-[10px] text-zinc-500 font-mono">
              v{tool.version}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-mono font-semibold text-white mb-1 group-hover:text-[#00ff00] transition-colors">
          {tool.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          {tool.tests !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <FlaskConical size={12} className="text-[#00ff00]/70" />
              <span>{tool.tests} tests</span>
            </div>
          )}
          
          {tool.downloads !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Download size={12} className="text-[#00ff00]/70" />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
          )}
          
          <ArrowUpRight 
            size={14} 
            className={cn(
              "ml-auto text-zinc-600 transition-all duration-300",
              isHovered && "text-[#00ff00] translate-x-0.5 -translate-y-0.5"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}
