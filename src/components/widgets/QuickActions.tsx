'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Terminal, RefreshCw, Trash2, Download, 
  Play, Square, RotateCcw, FolderOpen, Settings 
} from 'lucide-react';

interface Action {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  command?: string;
  url?: string;
}

const actions: Action[] = [
  { id: 'restart-docker', name: 'Restart Docker', icon: RotateCcw, color: '#ec4899', command: 'docker restart $(docker ps -q)' },
  { id: 'clear-cache', name: 'Clear Cache', icon: Trash2, color: '#ef4444', command: 'rm -rf ~/.cache/*' },
  { id: 'update-brew', name: 'Brew Update', icon: Download, color: '#00ff00', command: 'brew update && brew upgrade' },
  { id: 'open-terminal', name: 'Terminal', icon: Terminal, color: '#00ffff', url: 'iterm://' },
  { id: 'open-finder', name: 'Projects', icon: FolderOpen, color: '#f97316', url: 'file:///Volumes/Illegg/clawdbot/workspace/projects' },
  { id: 'system-prefs', name: 'Settings', icon: Settings, color: '#a855f7', url: 'x-apple.systempreferences://' },
];

export default function QuickActions() {
  const [running, setRunning] = useState<string | null>(null);

  const handleAction = async (action: Action) => {
    if (action.url) {
      window.open(action.url, '_blank');
      return;
    }

    if (action.command) {
      setRunning(action.id);
      // In a real implementation, this would call an API
      // For now, just simulate
      setTimeout(() => {
        setRunning(null);
        alert(`Would run: ${action.command}`);
      }, 1000);
    }
  };

  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#facc15]/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 border border-[#facc15]/30 rounded-lg bg-[#facc15]/5">
          <Zap size={18} className="text-[#facc15]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-mono">Quick Actions</h3>
          <p className="text-xs text-zinc-500 font-mono">Common tasks</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isRunning = running === action.id;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleAction(action)}
              disabled={isRunning}
              className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-zinc-800/50 hover:border-opacity-50 transition-all text-left disabled:opacity-50"
              style={{ 
                '--hover-border': action.color,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${action.color}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
              }}
            >
              <div 
                className="p-1.5 rounded"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <Icon 
                  size={14} 
                  style={{ color: action.color }}
                  className={isRunning ? 'animate-spin' : ''} 
                />
              </div>
              <span className="text-sm text-zinc-300 font-mono truncate">{action.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
