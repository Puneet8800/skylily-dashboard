'use client';

import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, RefreshCw, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DockerContainer {
  name: string;
  status: string;
  port: number;
}

interface SystemStatusProps {
  uptime: string;
  memory: { used: number; total: number };
  cpu: number;
  dockerContainers: DockerContainer[];
}

export default function SystemStatus({ uptime, memory, cpu, dockerContainers }: SystemStatusProps) {
  const memoryPercent = Math.round((memory.used / memory.total) * 100);
  
  return (
    <div className="card-terminal p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#00ff00]/30 rounded-lg bg-[#00ff00]/5">
            <Server size={18} className="text-[#00ff00]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">System Status</h3>
            <p className="text-xs text-zinc-500 font-mono">Infrastructure health</p>
          </div>
        </div>
        
        <button className="p-2 text-zinc-500 hover:text-[#00ff00] transition-colors border border-zinc-700 hover:border-[#00ff00]/30 rounded-lg">
          <RefreshCw size={16} />
        </button>
      </div>
      
      {/* Uptime */}
      <div className="mb-6 p-4 rounded-lg bg-black/30 border border-[#00ff00]/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 font-mono uppercase mb-1">System Uptime</p>
            <p className="text-2xl font-bold text-white font-mono">{uptime}</p>
          </div>
          <div className="px-3 py-1 rounded text-xs font-mono text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/20">
            Healthy
          </div>
        </div>
      </div>
      
      {/* Resources */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* CPU */}
        <div className="p-4 rounded-lg bg-black/30 border border-[#00ff00]/10">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={14} className="text-[#00ff00]" />
            <span className="text-xs text-zinc-500 font-mono">CPU Usage</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-white font-mono">{cpu}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${cpu}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#00ff00] rounded-full"
            />
          </div>
        </div>
        
        {/* Memory */}
        <div className="p-4 rounded-lg bg-black/30 border border-[#00ff00]/10">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive size={14} className="text-[#00ffff]" />
            <span className="text-xs text-zinc-500 font-mono">Memory</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-white font-mono">{memory.used}GB</span>
            <span className="text-xs text-zinc-500 font-mono">/{memory.total}GB</span>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${memoryPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#00ffff] rounded-full"
            />
          </div>
        </div>
      </div>
      
      {/* Docker Containers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Box size={14} className="text-[#00ff00]" />
          <span className="text-xs text-zinc-500 font-mono uppercase">Docker Containers</span>
          <span className="ml-auto text-xs text-[#00ff00] font-mono">{dockerContainers.filter(c => c.status === 'running').length} running</span>
        </div>
        
        <div className="space-y-2">
          {dockerContainers.map((container, index) => (
            <motion.div
              key={container.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-[#00ff00]/5 hover:border-[#00ff00]/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  container.status === 'running' ? "bg-[#00ff00]" : "bg-zinc-600"
                )} />
                <span className="text-sm text-white font-mono">{container.name}</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">:{container.port}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
