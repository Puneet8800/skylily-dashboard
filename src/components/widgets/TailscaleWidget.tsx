'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, RefreshCw, Laptop, Smartphone, Monitor, Globe } from 'lucide-react';
import { pulsed, TailscaleResponse, TailscaleDevice } from '@/lib/pulsed';

const getDeviceIcon = (os?: string) => {
  if (!os) return Globe;
  const lower = os.toLowerCase();
  if (lower.includes('mac') || lower.includes('darwin')) return Laptop;
  if (lower.includes('ios') || lower.includes('android')) return Smartphone;
  if (lower.includes('windows') || lower.includes('linux')) return Monitor;
  return Globe;
};

export default function TailscaleWidget() {
  const [data, setData] = useState<TailscaleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const result = await pulsed.tailscale();
      setData(result);
      setError(null);
    } catch (e) {
      setError('Tailscale unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="widget-icon sky">
            <Network size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Tailscale</h3>
            {data && (
              <p className="text-xs text-slate-500">
                {data.online_count}/{data.devices.length} online
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
          <Network className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.devices.map((device, index) => {
            const DeviceIcon = getDeviceIcon(device.os);
            return (
              <motion.div
                key={device.ip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="list-item"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${device.online ? 'bg-emerald-500/10' : 'bg-slate-700/50'}`}>
                    <DeviceIcon 
                      size={14} 
                      className={device.online ? 'text-emerald-400' : 'text-slate-500'} 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{device.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{device.ip}</p>
                  </div>
                </div>
                <div className={`status-dot ${device.online ? 'status-online' : 'status-offline'}`} />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
