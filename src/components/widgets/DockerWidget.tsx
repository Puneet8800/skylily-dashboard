'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, RefreshCw, Play, Square, RotateCcw, FileText, X, ChevronDown } from 'lucide-react';
import { pulsed, Container as ContainerType, DockerResponse } from '@/lib/pulsed';
import { cn } from '@/lib/utils';

export default function DockerWidget() {
  const [data, setData] = useState<DockerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [restarting, setRestarting] = useState<string | null>(null);

  const fetchContainers = async () => {
    try {
      const result = await pulsed.docker();
      setData(result);
      setError(null);
    } catch (e) {
      setError('Docker unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async (containerId: string, containerName: string) => {
    if (!confirm(`Restart ${containerName}?`)) return;
    setRestarting(containerId);
    try {
      await pulsed.dockerRestart(containerId);
      setTimeout(fetchContainers, 2000);
    } catch (e) {
      alert('Failed to restart container');
    } finally {
      setRestarting(null);
    }
  };

  const handleViewLogs = async (containerId: string) => {
    setSelectedContainer(containerId);
    setLoadingLogs(true);
    try {
      const result = await pulsed.dockerLogs(containerId, 50);
      setLogs(result.lines);
    } catch (e) {
      setLogs(['Failed to fetch logs']);
    } finally {
      setLoadingLogs(false);
    }
  };

  const displayContainers = showAll 
    ? data?.containers || []
    : (data?.containers || []).slice(0, 5);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'running': return '#00ff00';
      case 'paused': return '#facc15';
      case 'exited': return '#ef4444';
      default: return '#71717a';
    }
  };

  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#ec4899]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#ec4899]/30 rounded-lg bg-[#ec4899]/5">
            <Container size={18} className="text-[#ec4899]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">Docker</h3>
            {data && (
              <p className="text-xs text-zinc-500 font-mono">
                {data.running}/{data.total} running
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchContainers}
          className="p-2 text-zinc-500 hover:text-[#ec4899] transition-colors border border-zinc-800 hover:border-[#ec4899]/30 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-zinc-500">
          <Container className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Container List */}
          <div className="space-y-2">
            {displayContainers.map((container, index) => (
              <motion.div
                key={container.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-zinc-800/50 hover:border-[#ec4899]/20 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: getStateColor(container.state) }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200 font-mono truncate">{container.name}</p>
                    <p className="text-xs text-zinc-600 truncate">{container.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleViewLogs(container.id)}
                    className="p-1.5 text-zinc-500 hover:text-[#00ffff] transition-colors"
                    title="View logs"
                  >
                    <FileText size={14} />
                  </button>
                  <button
                    onClick={() => handleRestart(container.id, container.name)}
                    disabled={restarting === container.id}
                    className="p-1.5 text-zinc-500 hover:text-[#f97316] transition-colors disabled:opacity-50"
                    title="Restart"
                  >
                    <RotateCcw size={14} className={restarting === container.id ? 'animate-spin' : ''} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show More */}
          {data && data.containers.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 py-2.5 rounded-lg text-sm font-mono bg-[#ec4899]/5 border border-[#ec4899]/10 text-zinc-400 hover:text-[#ec4899] hover:border-[#ec4899]/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-zinc-600">&gt;</span>
              {showAll ? 'show_less' : `view_all --count ${data.containers.length}`}
              <ChevronDown size={14} className={cn("transition-transform", showAll && "rotate-180")} />
            </button>
          )}
        </>
      )}

      {/* Logs Modal */}
      <AnimatePresence>
        {selectedContainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContainer(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0a0a0a] border border-zinc-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h4 className="font-mono text-white">Container Logs</h4>
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="p-1 text-zinc-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[60vh] bg-black">
                {loadingLogs ? (
                  <p className="text-zinc-500 text-center">Loading...</p>
                ) : (
                  <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">
                    {logs.join('\n') || 'No logs available'}
                  </pre>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
