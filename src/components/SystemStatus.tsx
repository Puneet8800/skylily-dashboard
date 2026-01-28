'use client';

import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Clock, CheckCircle, Container } from 'lucide-react';

interface DockerContainer {
  name: string;
  status: string;
  uptime: string;
}

interface SystemStatusProps {
  uptime: string;
  memory: { used: number; total: number };
  cpu: number;
  dockerContainers: DockerContainer[];
}

export default function SystemStatus({ uptime, memory, cpu, dockerContainers }: SystemStatusProps) {
  const memoryPercentage = (memory.used / memory.total) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Server className="text-sky-400" size={20} />
        <h2 className="text-xl font-semibold text-white">System Status</h2>
        <div className="ml-auto flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium">All Systems Operational</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Uptime */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Clock size={16} />
            <span className="text-sm">Uptime</span>
          </div>
          <p className="text-xl font-bold text-white">{uptime}</p>
        </div>
        
        {/* Memory */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <HardDrive size={16} />
            <span className="text-sm">Memory</span>
          </div>
          <p className="text-xl font-bold text-white">{memory.used}GB / {memory.total}GB</p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${memoryPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-sky-500 to-lily-500 rounded-full"
            />
          </div>
        </div>
        
        {/* CPU */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Cpu size={16} />
            <span className="text-sm">CPU</span>
          </div>
          <p className="text-xl font-bold text-white">{cpu}%</p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cpu}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className={`h-full rounded-full ${cpu > 80 ? 'bg-red-500' : cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            />
          </div>
        </div>
      </div>
      
      {/* Docker Containers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Container size={16} className="text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-400">Docker Containers</h3>
        </div>
        
        <div className="space-y-2">
          {dockerContainers.map((container, index) => (
            <motion.div
              key={container.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle 
                  size={14} 
                  className={container.status === 'running' ? 'text-emerald-400' : 'text-red-400'} 
                />
                <span className="text-sm text-white font-medium">{container.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  container.status === 'running' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {container.status}
                </span>
                <span className="text-xs text-zinc-500">{container.uptime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
