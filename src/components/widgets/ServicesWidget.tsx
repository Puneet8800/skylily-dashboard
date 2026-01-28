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

const getStatusStyle = (status: string) => {
  if (status === 'healthy') return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
  if (status === 'timeout') return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
  return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' };
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
    <div className="widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="widget-icon teal">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Services</h3>
            {data && (
              <p className="text-xs text-slate-500">
                {data.healthy}/{data.total} healthy
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
          <Activity className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : data?.services.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No services configured</p>
          <p className="text-xs mt-1">Add services in pulsed config</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.services.map((service, index) => {
            const StatusIcon = getStatusIcon(service.status);
            const style = getStatusStyle(service.status);
            return (
              <motion.a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="list-item group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: style.bg }}
                  >
                    <StatusIcon size={14} style={{ color: style.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{service.name}</p>
                    {service.latency_ms && (
                      <p className="text-xs text-slate-500">{service.latency_ms}ms</p>
                    )}
                  </div>
                </div>
                <ExternalLink 
                  size={14} 
                  className="text-slate-600 group-hover:text-sky-400 transition-colors" 
                />
              </motion.a>
            );
          })}
        </div>
      )}
    </div>
  );
}
