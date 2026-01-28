'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Check, X, Clock, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { pulsed, ServicesResponse, ServiceCheck } from '@/lib/pulsed';

const getStatusIcon = (status: string) => {
  if (status === 'healthy') return Check;
  if (status === 'timeout') return Clock;
  if (status === 'connection_refused') return X;
  return AlertTriangle;
};

const getStatusColor = (status: string) => {
  if (status === 'healthy') return '#00ff00';
  if (status === 'timeout') return '#facc15';
  return '#ef4444';
};

export default function ServicesWidget() {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await pulsed.services();
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
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#14b8a6]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#14b8a6]/30 rounded-lg bg-[#14b8a6]/5">
            <Activity size={18} className="text-[#14b8a6]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">Services</h3>
            {data && (
              <p className="text-xs text-zinc-500 font-mono">
                {data.healthy}/{data.total} healthy
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchData}
          className="p-2 text-zinc-500 hover:text-[#14b8a6] transition-colors border border-zinc-800 hover:border-[#14b8a6]/30 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-zinc-500">
          <Activity className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : data?.services.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          <p className="text-sm">No services configured</p>
          <p className="text-xs mt-1">Add services in pulsed config</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.services.map((service, index) => {
            const StatusIcon = getStatusIcon(service.status);
            const statusColor = getStatusColor(service.status);
            return (
              <motion.a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-zinc-800/50 hover:border-[#14b8a6]/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-1.5 rounded"
                    style={{ backgroundColor: `${statusColor}15` }}
                  >
                    <StatusIcon size={14} style={{ color: statusColor }} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200 font-mono">{service.name}</p>
                    {service.latency_ms && (
                      <p className="text-xs text-zinc-600 font-mono">{service.latency_ms}ms</p>
                    )}
                  </div>
                </div>
                <ExternalLink 
                  size={14} 
                  className="text-zinc-600 group-hover:text-[#14b8a6] transition-colors" 
                />
              </motion.a>
            );
          })}
        </div>
      )}
    </div>
  );
}
