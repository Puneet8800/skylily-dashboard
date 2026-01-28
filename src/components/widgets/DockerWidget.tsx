'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, RefreshCw, RotateCcw, FileText, X, ChevronDown } from 'lucide-react';
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
      case 'running': return 'bg-emerald-400';
      case 'paused': return 'bg-amber-400';
      case 'exited': return 'bg-rose-400';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="widget-icon violet">
            <Container size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Docker</h3>
            {data && (
              <p className="text-xs text-slate-500">
                {data.running}/{data.total} running
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchContainers}
          className="btn-ghost"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-slate-500">
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
                className="list-item group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("status-dot shrink-0", getStateColor(container.state))} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{container.name}</p>
                    <p className="text-xs text-slate-500 truncate">{container.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleViewLogs(container.id)}
                    className="btn-ghost p-1.5"
                    title="View logs"
                  >
                    <FileText size={14} />
                  </button>
                  <button
                    onClick={() => handleRestart(container.id, container.name)}
                    disabled={restarting === container.id}
                    className="btn-ghost p-1.5 hover:text-amber-400 disabled:opacity-50"
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
              className="w-full mt-4 py-2.5 rounded-lg text-sm bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all flex items-center justify-center gap-2"
            >
              {showAll ? 'Show Less' : `View All (${data.containers.length})`}
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
            className="modal-overlay"
            onClick={() => setSelectedContainer(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="modal-content w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h4 className="font-medium text-white">Container Logs</h4>
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="btn-ghost p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[60vh]">
                {loadingLogs ? (
                  <p className="text-slate-500 text-center py-4">Loading...</p>
                ) : (
                  <pre className="code-block text-xs whitespace-pre-wrap">
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
