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
import { Badge } from '@/components/ui/badge';
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
  return iconMap[iconName] || Box;
};

export default function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const Icon = tool.icon ? getIcon(tool.icon) : Box;
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    stable: { variant: 'default', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
    beta: { variant: 'secondary', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
    alpha: { variant: 'destructive', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl cursor-pointer group',
        'bg-gradient-to-b from-white/[0.05] to-white/[0.02]',
        'border border-white/[0.08]',
        'transition-all duration-300',
        'hover:border-teal-500/30 hover:shadow-[0_8px_40px_-12px_rgba(20,184,166,0.25)]'
      )}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(20, 184, 166, 0.08), transparent 40%)`,
        }}
      />
      
      {/* Gradient border effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `linear-gradient(135deg, rgba(20, 184, 166, 0.1), transparent, rgba(245, 158, 11, 0.05))`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-3">
          <motion.div 
            className={cn(
              'p-2.5 rounded-xl',
              'bg-gradient-to-br from-teal-500/10 to-cyan-500/10',
              'text-teal-400 group-hover:text-teal-300',
              'border border-teal-500/10 group-hover:border-teal-500/20',
              'transition-all duration-300'
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Icon size={20} strokeWidth={1.5} />
          </motion.div>
          
          {tool.status && (
            <Badge 
              variant="outline"
              className={cn(
                'text-[10px] uppercase tracking-wider font-medium',
                statusConfig[tool.status]?.className || statusConfig.stable.className
              )}
            >
              {tool.status}
            </Badge>
          )}
          
          {tool.version && !tool.status && (
            <span className="text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-0.5 rounded-md">
              v{tool.version}
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-white mb-1.5 group-hover:text-teal-50 transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 group-hover:text-zinc-300 transition-colors">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between">
          {tool.tests !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
              <FlaskConical size={13} className="text-teal-500/70" />
              <span>{tool.tests} tests</span>
            </div>
          )}
          
          {tool.downloads !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
              <Download size={13} className="text-amber-500/70" />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
          )}
          
          <motion.div
            className="ml-auto"
            initial={{ opacity: 0.5, x: -5 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            <ArrowUpRight 
              size={16} 
              className="text-zinc-600 group-hover:text-teal-400 transition-all duration-300" 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
