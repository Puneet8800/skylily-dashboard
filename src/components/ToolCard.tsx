'use client';

import { useRef, useState, useCallback } from 'react';
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
  const [borderRotation, setBorderRotation] = useState(0);
  
  const statusConfig: Record<string, { className: string }> = {
    stable: { className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    beta: { className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    alpha: { className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    
    // Calculate rotation for animated border based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    setBorderRotation(angle);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Animated gradient border */}
      <div 
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from ${borderRotation}deg at 50% 50%, 
            rgba(20, 184, 166, 0.5) 0deg,
            rgba(6, 182, 212, 0.3) 90deg,
            transparent 180deg,
            rgba(20, 184, 166, 0.2) 270deg,
            rgba(20, 184, 166, 0.5) 360deg
          )`,
        }}
      />
      
      {/* Card background */}
      <div className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-zinc-900/80 backdrop-blur-sm",
        "border border-white/[0.06]",
        "group-hover:border-transparent",
        "transition-all duration-300"
      )}>
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(20, 184, 166, 0.06), transparent 40%)`,
          }}
        />
        
        {/* Glow effect */}
        <div
          className="pointer-events-none absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
          style={{
            background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(20, 184, 166, 0.1), transparent 50%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between mb-3">
            <motion.div 
              className={cn(
                'p-2.5 rounded-lg',
                'bg-gradient-to-br from-teal-500/15 to-cyan-500/10',
                'text-teal-400 group-hover:text-teal-300',
                'border border-teal-500/10 group-hover:border-teal-500/25',
                'transition-all duration-300'
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </motion.div>
            
            {tool.status && (
              <Badge 
                variant="outline"
                className={cn(
                  'text-[10px] uppercase tracking-wider font-medium px-2 py-0.5',
                  statusConfig[tool.status]?.className || statusConfig.stable.className
                )}
              >
                {tool.status}
              </Badge>
            )}
            
            {tool.version && !tool.status && (
              <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800/60 px-1.5 py-0.5 rounded">
                v{tool.version}
              </span>
            )}
          </div>
          
          <h3 className="font-medium text-[15px] text-white mb-1 group-hover:text-teal-50 transition-colors tracking-tight">
            {tool.name}
          </h3>
          
          <p className="text-[13px] text-zinc-500 mb-4 line-clamp-2 leading-relaxed group-hover:text-zinc-400 transition-colors">
            {tool.description}
          </p>
          
          <div className="flex items-center justify-between">
            {tool.tests !== undefined && (
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                <FlaskConical size={12} className="text-teal-500/70" />
                <span>{tool.tests} tests</span>
              </div>
            )}
            
            {tool.downloads !== undefined && (
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                <Download size={12} className="text-amber-500/70" />
                <span>{tool.downloads.toLocaleString()}</span>
              </div>
            )}
            
            <motion.div
              className="ml-auto"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: isHovered ? 1 : 0.4, x: isHovered ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight 
                size={14} 
                className="text-zinc-600 group-hover:text-teal-400 transition-colors duration-300" 
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
