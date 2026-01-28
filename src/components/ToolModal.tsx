'use client';

import { motion } from 'framer-motion';
import { 
  Box, FlaskConical, Download, Github, Terminal, Folder, ExternalLink, Copy, Check,
  Route, Code, GitBranch, DollarSign, Shield, FileText,
  Server, Sparkles, LayoutDashboard, Globe, Search, Activity,
  MapPin, Scan, Lock, FileCode, Map, Calculator, RotateCcw,
  Mail, ShieldCheck, Key, BadgeCheck, Gauge, Clock, BarChart2,
  Package, Wifi, TrendingUp, DownloadCloud, Radar,
  Shovel, Link, Eye, Flame, Plug, Network, GitFork, Settings,
  Sliders, Zap
} from 'lucide-react';
import { ElementType, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const [copied, setCopied] = useState(false);
  
  if (!tool) return null;
  
  const Icon = tool.icon ? getIcon(tool.icon) : Box;
  
  const statusConfig: Record<string, string> = {
    stable: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    beta: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    alpha: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`${tool.name} --help`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!tool} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-white/[0.08] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        <DialogHeader className="relative z-10">
          <div className="flex items-start gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={cn(
                'p-4 rounded-2xl',
                'bg-gradient-to-br from-teal-500/20 to-cyan-500/10',
                'border border-teal-500/20',
                'text-teal-400'
              )}
            >
              <Icon size={28} strokeWidth={1.5} />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold text-white">{tool.name}</DialogTitle>
                {tool.status && (
                  <Badge 
                    variant="outline"
                    className={cn(
                      'text-[10px] uppercase tracking-wider',
                      statusConfig[tool.status] || statusConfig.stable
                    )}
                  >
                    {tool.status}
                  </Badge>
                )}
              </div>
              {tool.version && (
                <span className="text-sm text-zinc-500 font-mono mt-1 block">v{tool.version}</span>
              )}
            </div>
          </div>
          
          <DialogDescription className="text-zinc-400 mt-4 leading-relaxed">
            {tool.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative z-10 space-y-6 mt-2">
          {/* Command Line Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 rounded-xl p-4 border border-white/[0.05] group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Quick Start</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCommand}
                className="h-7 px-2 text-zinc-500 hover:text-white hover:bg-white/10"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span className="ml-1.5 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
            <code className="text-sm font-mono text-teal-400">
              <span className="text-zinc-500">$</span> {tool.name} --help
            </code>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            {tool.tests !== undefined && (
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <FlaskConical size={14} className="text-teal-500" />
                  <span className="text-xs">Tests</span>
                </div>
                <p className="text-xl font-bold text-white">{tool.tests}</p>
              </div>
            )}
            
            {tool.downloads !== undefined && (
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Download size={14} className="text-amber-500" />
                  <span className="text-xs">Downloads</span>
                </div>
                <p className="text-xl font-bold text-white">{tool.downloads.toLocaleString()}</p>
              </div>
            )}
            
            {tool.category && (
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Folder size={14} className="text-cyan-500" />
                  <span className="text-xs">Category</span>
                </div>
                <p className="text-lg font-semibold text-white capitalize">{tool.category}</p>
              </div>
            )}
          </motion.div>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            {tool.github && (
              <Button
                variant="outline"
                asChild
                className="flex-1 bg-white/[0.03] border-white/[0.1] hover:bg-white/[0.08] hover:border-white/20 text-white"
              >
                <a href={tool.github} target="_blank" rel="noopener noreferrer">
                  <Github size={16} className="mr-2" />
                  View Source
                  <ExternalLink size={12} className="ml-2 opacity-50" />
                </a>
              </Button>
            )}
            
            <Button
              className={cn(
                'flex-1',
                'bg-gradient-to-r from-teal-600 to-cyan-600',
                'hover:from-teal-500 hover:to-cyan-500',
                'text-white font-medium',
                'shadow-lg shadow-teal-500/20'
              )}
              onClick={() => {
                navigator.clipboard.writeText(`${tool.name} --help`);
                onClose();
              }}
            >
              <Terminal size={16} className="mr-2" />
              Run Tool
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
