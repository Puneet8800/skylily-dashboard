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
  Sliders, Zap, X
} from 'lucide-react';
import { ElementType, useState } from 'react';
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
  return iconMap[iconName] || Terminal;
};

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  const [copied, setCopied] = useState(false);
  
  if (!tool) return null;
  
  const Icon = tool.icon ? getIcon(tool.icon) : Terminal;
  
  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`${tool.name} --help`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0a0a0a] border border-[#00ff00]/20 rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#00ff00]/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#00ff00]/5 border border-[#00ff00]/20">
                <Icon size={24} className="text-[#00ff00]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono">{tool.name}</h3>
                {tool.version && (
                  <span className="text-sm text-zinc-500 font-mono">v{tool.version}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-4 text-zinc-400 leading-relaxed">{tool.description}</p>
        </div>
        
        {/* Command */}
        <div className="p-6 border-b border-[#00ff00]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 font-mono uppercase">Quick Start</span>
            <button
              onClick={handleCopyCommand}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#00ff00] transition-colors"
            >
              {copied ? <Check size={12} className="text-[#00ff00]" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-3 bg-black rounded-md border border-[#00ff00]/10 font-mono text-sm">
            <span className="text-zinc-500">$</span>{' '}
            <span className="text-[#00ff00]">{tool.name}</span>{' '}
            <span className="text-zinc-400">--help</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="p-6 border-b border-[#00ff00]/10">
          <div className="grid grid-cols-3 gap-4">
            {tool.tests !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <FlaskConical size={14} className="text-[#00ff00]" />
                  <span className="text-xs text-zinc-500 font-mono">Tests</span>
                </div>
                <p className="text-xl font-bold text-white font-mono">{tool.tests}</p>
              </div>
            )}
            {tool.downloads !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Download size={14} className="text-[#00ff00]" />
                  <span className="text-xs text-zinc-500 font-mono">Downloads</span>
                </div>
                <p className="text-xl font-bold text-white font-mono">{tool.downloads.toLocaleString()}</p>
              </div>
            )}
            {tool.category && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Folder size={14} className="text-[#00ff00]" />
                  <span className="text-xs text-zinc-500 font-mono">Category</span>
                </div>
                <p className="text-lg font-semibold text-white font-mono capitalize">{tool.category}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 flex gap-3">
          {tool.github && (
            <a
              href={tool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-terminal flex items-center justify-center gap-2 py-3"
            >
              <Github size={16} />
              View Source
              <ExternalLink size={12} className="opacity-50" />
            </a>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${tool.name} --help`);
              onClose();
            }}
            className="flex-1 btn-terminal-filled flex items-center justify-center gap-2 py-3"
          >
            <Terminal size={16} />
            Run Tool
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
