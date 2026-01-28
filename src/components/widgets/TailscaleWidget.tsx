'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Wifi, WifiOff, Monitor, Smartphone, Laptop, RefreshCw } from 'lucide-react';
import { pulsed, TailscaleResponse, TailscaleDevice } from '@/lib/pulsed';

const getDeviceIcon = (os?: string) => {
  if (!os) return Monitor;
  const lower = os.toLowerCase();
  if (lower.includes('ios') || lower.includes('android')) return Smartphone;
  if (lower.includes('mac') || lower.includes('windows') || lower.includes('linux')) return Laptop;
  return Monitor;
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
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#3b82f6]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#3b82f6]/30 rounded-lg bg-[#3b82f6]/5">
            <Globe size={18} className="text-[#3b82f6]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">Tailscale</h3>
            {data && (
              <p className="text-xs text-zinc-500 font-mono">
                {data.online_count}/{data.devices.length} online
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchData}
          className="p-2 text-zinc-500 hover:text-[#3b82f6] transition-colors border border-zinc-800 hover:border-[#3b82f6]/30 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-zinc-500">
          <WifiOff className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.devices.map((device, index) => {
            const Icon = getDeviceIcon(device.os);
            return (
              <motion.div
                key={device.ip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-zinc-800/50 hover:border-[#3b82f6]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${device.online ? 'bg-[#3b82f6]/10' : 'bg-zinc-800/50'}`}>
                    <Icon size={14} className={device.online ? 'text-[#3b82f6]' : 'text-zinc-600'} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200 font-mono">{device.name}</p>
                    <p className="text-xs text-zinc-600 font-mono">{device.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.os && (
                    <span className="text-xs text-zinc-600 font-mono">{device.os}</span>
                  )}
                  <div className={`w-2 h-2 rounded-full ${device.online ? 'bg-[#00ff00]' : 'bg-zinc-600'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
