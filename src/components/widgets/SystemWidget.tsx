'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, RefreshCw, Thermometer, Clock } from 'lucide-react';
import { pulsed, SystemMetrics } from '@/lib/pulsed';

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export default function SystemWidget() {
  const [data, setData] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const result = await pulsed.system();
      setData(result);
      setError(null);
    } catch (e) {
      setError('Pulsed offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const avgTemp = data?.temperatures?.length
    ? (data.temperatures.reduce((sum, t) => sum + t.celsius, 0) / data.temperatures.length).toFixed(0)
    : null;

  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'rose';
    if (percent > 70) return 'amber';
    return 'sky';
  };

  return (
    <div className="widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="widget-icon sky">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">System</h3>
            {data && (
              <p className="text-xs text-slate-500">
                Uptime: {formatUptime(data.uptime_secs)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchData}
          className="btn-ghost"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-slate-500">
          <Cpu className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">CPU ({data?.cpu_count} cores)</span>
              <span className="text-sm font-medium text-white">{data?.cpu_usage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressColor(data?.cpu_usage || 0)}`}
                style={{ width: `${data?.cpu_usage || 0}%` }}
              />
            </div>
          </div>

          {/* Memory */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Memory</span>
              <span className="text-sm font-medium text-white">
                {formatBytes(data?.memory_used || 0)} / {formatBytes(data?.memory_total || 0)}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressColor(data?.memory_percent || 0)}`}
                style={{ width: `${data?.memory_percent || 0}%` }}
              />
            </div>
          </div>

          {/* Disk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Disk</span>
              <span className="text-sm font-medium text-white">{data?.disk_percent.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressColor(data?.disk_percent || 0)}`}
                style={{ width: `${data?.disk_percent || 0}%` }}
              />
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/30">
              <Clock size={14} className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Load Avg</p>
                <p className="text-sm font-medium text-white">
                  {data?.load_avg[0].toFixed(2)}
                </p>
              </div>
            </div>
            {avgTemp && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/30">
                <Thermometer size={14} className="text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Temp</p>
                  <p className="text-sm font-medium text-white">{avgTemp}°C</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
