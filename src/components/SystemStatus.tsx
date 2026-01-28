'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, HardDrive, Clock, Box, CheckCircle2, 
  AlertCircle, XCircle, RefreshCw 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Container {
  name: string;
  status: string;
  uptime: string;
}

interface SystemStatusProps {
  uptime: string;
  memory: { used: number; total: number };
  cpu: number;
  dockerContainers: Container[];
}

export default function SystemStatus({ uptime, memory, cpu, dockerContainers }: SystemStatusProps) {
  const memoryPercent = (memory.used / memory.total) * 100;
  
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: CheckCircle2 };
      case 'stopped':
        return { color: 'text-rose-400', bg: 'bg-rose-500', icon: XCircle };
      case 'warning':
        return { color: 'text-amber-400', bg: 'bg-amber-500', icon: AlertCircle };
      default:
        return { color: 'text-zinc-400', bg: 'bg-zinc-500', icon: CheckCircle2 };
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent < 50) return { bar: 'from-emerald-500 to-teal-500', text: 'text-emerald-400' };
    if (percent < 80) return { bar: 'from-amber-500 to-orange-500', text: 'text-amber-400' };
    return { bar: 'from-rose-500 to-red-500', text: 'text-rose-400' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "rounded-2xl p-6",
        "bg-gradient-to-b from-white/[0.04] to-white/[0.01]",
        "border border-white/[0.08]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={18} className="text-teal-500" />
            <h2 className="text-lg font-semibold text-white">System Status</h2>
          </div>
          <p className="text-sm text-zinc-500">Infrastructure health</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-white/[0.05]"
        >
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>
      
      {/* Uptime */}
      <motion.div 
        className="bg-white/[0.02] rounded-xl p-4 mb-4 border border-white/[0.05]"
        whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10">
              <Clock size={18} className="text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">System Uptime</p>
              <p className="text-xl font-bold text-white">{uptime}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          >
            Healthy
          </Badge>
        </div>
      </motion.div>
      
      {/* Resource Usage */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* CPU */}
        <motion.div 
          className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]"
          whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-zinc-500" />
              <span className="text-sm text-zinc-400">CPU Usage</span>
            </div>
            <span className={cn("text-sm font-bold", getUsageColor(cpu).text)}>{cpu}%</span>
          </div>
          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cpu}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn("h-full rounded-full bg-gradient-to-r", getUsageColor(cpu).bar)}
            />
          </div>
        </motion.div>
        
        {/* Memory */}
        <motion.div 
          className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]"
          whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-zinc-500" />
              <span className="text-sm text-zinc-400">Memory</span>
            </div>
            <span className={cn("text-sm font-bold", getUsageColor(memoryPercent).text)}>
              {memory.used}GB/{memory.total}GB
            </span>
          </div>
          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${memoryPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn("h-full rounded-full bg-gradient-to-r", getUsageColor(memoryPercent).bar)}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Docker Containers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Box size={14} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-400">Docker Containers</span>
          <Badge variant="outline" className="ml-auto text-[10px] bg-white/[0.02] border-white/[0.08]">
            {dockerContainers.filter(c => c.status === 'running').length}/{dockerContainers.length} running
          </Badge>
        </div>
        
        <div className="space-y-2">
          {dockerContainers.map((container, index) => {
            const statusConfig = getStatusConfig(container.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={container.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl",
                  "bg-white/[0.02] border border-white/[0.03]",
                  "hover:bg-white/[0.04] hover:border-white/[0.06] transition-all"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={cn("w-2 h-2 rounded-full", statusConfig.bg)} />
                    {container.status === 'running' && (
                      <div className={cn("absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-75", statusConfig.bg)} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">{container.name}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">{container.uptime}</span>
                  <StatusIcon size={14} className={statusConfig.color} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
