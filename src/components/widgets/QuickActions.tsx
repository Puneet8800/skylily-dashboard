'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Terminal, RefreshCw, Trash2, Download, 
  FolderOpen, Settings, ExternalLink, RotateCcw
} from 'lucide-react';
import { pulsed } from '@/lib/pulsed';

interface Action {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  type: 'url' | 'docker' | 'command';
  target?: string;
  containerId?: string;
}

const actions: Action[] = [
  { 
    id: 'restart-glance', 
    name: 'Restart Glance', 
    description: 'Restart dashboard',
    icon: RotateCcw, 
    color: '#8b5cf6',
    type: 'docker',
    containerId: 'glance'
  },
  { 
    id: 'open-terminal', 
    name: 'Terminal', 
    description: 'Open iTerm',
    icon: Terminal, 
    color: '#0ea5e9',
    type: 'url',
    target: 'iterm://'
  },
  { 
    id: 'open-finder', 
    name: 'Projects', 
    description: 'Open workspace',
    icon: FolderOpen, 
    color: '#f59e0b',
    type: 'url',
    target: 'file:///Volumes/Illegg/clawdbot/workspace/projects'
  },
  { 
    id: 'system-prefs', 
    name: 'Settings', 
    description: 'System settings',
    icon: Settings, 
    color: '#64748b',
    type: 'url',
    target: 'x-apple.systempreferences://'
  },
  { 
    id: 'uptime-kuma', 
    name: 'Uptime Kuma', 
    description: 'Open monitoring',
    icon: ExternalLink, 
    color: '#10b981',
    type: 'url',
    target: 'http://localhost:19999'
  },
  { 
    id: 'dashy', 
    name: 'Dashy', 
    description: 'Open dashboard',
    icon: ExternalLink, 
    color: '#ec4899',
    type: 'url',
    target: 'http://localhost:4000'
  },
];

export default function QuickActions() {
  const [running, setRunning] = useState<string | null>(null);
  const [status, setStatus] = useState<{ id: string; success: boolean } | null>(null);

  const handleAction = async (action: Action) => {
    if (action.type === 'url' && action.target) {
      window.open(action.target, '_blank');
      return;
    }

    if (action.type === 'docker' && action.containerId) {
      setRunning(action.id);
      try {
        // Find container by name
        const containers = await pulsed.docker();
        const container = containers.containers.find(c => c.name === action.containerId);
        if (container) {
          await pulsed.dockerRestart(container.id);
          setStatus({ id: action.id, success: true });
        } else {
          setStatus({ id: action.id, success: false });
        }
      } catch (e) {
        setStatus({ id: action.id, success: false });
      } finally {
        setRunning(null);
        setTimeout(() => setStatus(null), 2000);
      }
    }
  };

  return (
    <div className="widget">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="widget-icon amber">
          <Zap size={18} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Quick Actions</h3>
          <p className="text-xs text-slate-500">Common tasks</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isRunning = running === action.id;
          const actionStatus = status?.id === action.id ? status : null;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleAction(action)}
              disabled={isRunning}
              className="flex flex-col items-start gap-1.5 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <div 
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon 
                    size={14} 
                    style={{ color: action.color }}
                    className={isRunning ? 'animate-spin' : ''} 
                  />
                </div>
                {actionStatus && (
                  <span className={`text-xs ${actionStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {actionStatus.success ? '✓' : '✗'}
                  </span>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-slate-200">{action.name}</span>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
