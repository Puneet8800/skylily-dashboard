'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, Thermometer, Activity, RefreshCw } from 'lucide-react';
import { pulsed, SystemMetrics } from '@/lib/pulsed';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)}GB`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function SystemWidget() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const data = await pulsed.system();
      setMetrics(data);
      setError(null);
    } catch (e) {
      setError('Pulsed offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const avgTemp = metrics?.temperatures?.length
    ? metrics.temperatures.reduce((sum, t) => sum + t.celsius, 0) / metrics.temperatures.length
    : null;

  const getColor = (value: number) => {
    if (value < 50) return '#00ff00';
    if (value < 75) return '#facc15';
    return '#ef4444';
  };

  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#00ffff]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#00ffff]/30 rounded-lg bg-[#00ffff]/5">
            <Cpu size={18} className="text-[#00ffff]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">System</h3>
            {metrics && (
              <p className="text-xs text-zinc-500 font-mono">
                Uptime: {formatUptime(metrics.uptime_secs)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchMetrics}
          className="p-2 text-zinc-500 hover:text-[#00ffff] transition-colors border border-zinc-800 hover:border-[#00ffff]/30 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-zinc-500">
          <Activity className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[#00ffff]" />
                <span className="text-sm text-zinc-400">CPU</span>
              </div>
              <span className="text-sm font-mono" style={{ color: getColor(metrics?.cpu_usage || 0) }}>
                {metrics?.cpu_usage.toFixed(1)}%
              </span>
            </div>
            <ProgressBar value={metrics?.cpu_usage || 0} color={getColor(metrics?.cpu_usage || 0)} />
            <p className="text-xs text-zinc-600 mt-1 font-mono">
              {metrics?.cpu_count} cores • Load: {metrics?.load_avg[0].toFixed(1)}
            </p>
          </div>

          {/* Memory */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MemoryStick size={14} className="text-[#a855f7]" />
                <span className="text-sm text-zinc-400">Memory</span>
              </div>
              <span className="text-sm font-mono" style={{ color: getColor(metrics?.memory_percent || 0) }}>
                {metrics?.memory_percent.toFixed(1)}%
              </span>
            </div>
            <ProgressBar value={metrics?.memory_percent || 0} color={getColor(metrics?.memory_percent || 0)} />
            <p className="text-xs text-zinc-600 mt-1 font-mono">
              {formatBytes(metrics?.memory_used || 0)} / {formatBytes(metrics?.memory_total || 0)}
            </p>
          </div>

          {/* Disk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive size={14} className="text-[#f97316]" />
                <span className="text-sm text-zinc-400">Disk</span>
              </div>
              <span className="text-sm font-mono" style={{ color: getColor(metrics?.disk_percent || 0) }}>
                {metrics?.disk_percent.toFixed(1)}%
              </span>
            </div>
            <ProgressBar value={metrics?.disk_percent || 0} color={getColor(metrics?.disk_percent || 0)} />
            <p className="text-xs text-zinc-600 mt-1 font-mono">
              {formatBytes(metrics?.disk_used || 0)} / {formatBytes(metrics?.disk_total || 0)}
            </p>
          </div>

          {/* Temperature */}
          {avgTemp !== null && (
            <div className="pt-3 border-t border-zinc-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer size={14} className="text-[#ef4444]" />
                  <span className="text-sm text-zinc-400">Avg Temp</span>
                </div>
                <span 
                  className="text-sm font-mono"
                  style={{ color: avgTemp > 70 ? '#ef4444' : avgTemp > 50 ? '#facc15' : '#00ff00' }}
                >
                  {avgTemp.toFixed(1)}°C
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
