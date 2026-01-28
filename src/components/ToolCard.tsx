'use client';

import { useState } from 'react';
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
  category?: string;
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

// Multi-color palette based on tool index or category
const colorPalette = [
  { main: '#00ff00', bg: 'rgba(0, 255, 0, 0.1)', border: 'rgba(0, 255, 0, 0.2)' },      // Green
  { main: '#00ffff', bg: 'rgba(0, 255, 255, 0.1)', border: 'rgba(0, 255, 255, 0.2)' },  // Cyan
  { main: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)' }, // Purple
  { main: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)' }, // Orange
  { main: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.2)' }, // Pink
  { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' }, // Blue
  { main: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.2)' }, // Yellow
  { main: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', border: 'rgba(20, 184, 166, 0.2)' }, // Teal
  { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },   // Red
  { main: '#84cc16', bg: 'rgba(132, 204, 22, 0.1)', border: 'rgba(132, 204, 22, 0.2)' }, // Lime
];

const getIcon = (iconName: string): ElementType => {
  return iconMap[iconName] || Terminal;
};

export default function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const Icon = tool.icon ? getIcon(tool.icon) : Terminal;
  const [isHovered, setIsHovered] = useState(false);
  
  // Get color based on index for variety
  const color = colorPalette[index % colorPalette.length];
  
  const statusColors: Record<string, { text: string; bg: string; border: string }> = {
    stable: { text: '#00ff00', bg: 'rgba(0, 255, 0, 0.1)', border: 'rgba(0, 255, 0, 0.3)' },
    beta: { text: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.3)' },
    alpha: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' },
  };

  const statusStyle = tool.status ? statusColors[tool.status] : statusColors.stable;

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
        className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(180deg, ${color.bg} 0%, transparent 100%)`,
          boxShadow: isHovered ? `0 0 30px ${color.bg}` : 'none'
        }}
      />
      
      {/* Card */}
      <div 
        className={cn(
          "relative rounded-lg p-4",
          "bg-[#0a0a0a]",
          "transition-all duration-300"
        )}
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isHovered ? color.border : 'rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div 
            className="p-2 rounded-md transition-all duration-300"
            style={{
              background: color.bg,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: color.border
            }}
          >
            <Icon size={16} style={{ color: color.main }} />
          </div>
          
          {tool.status && (
            <span 
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded"
              style={{
                color: statusStyle.text,
                background: statusStyle.bg,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: statusStyle.border
              }}
            >
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
        <h3 
          className="font-mono font-semibold text-white mb-2 transition-colors text-base"
          style={{ color: isHovered ? color.main : 'white' }}
        >
          {tool.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          {tool.tests !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <FlaskConical size={12} style={{ color: color.main, opacity: 0.7 }} />
              <span>{tool.tests} tests</span>
            </div>
          )}
          
          {tool.downloads !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Download size={12} style={{ color: color.main, opacity: 0.7 }} />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
          )}
          
          <ArrowUpRight 
            size={14} 
            className="ml-auto transition-all duration-300"
            style={{ 
              color: isHovered ? color.main : '#52525b',
              transform: isHovered ? 'translate(2px, -2px)' : 'none'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
