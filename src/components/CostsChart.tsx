'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid
} from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DailyData {
  date: string;
  openai: number;
  anthropic: number;
  google: number;
}

interface MonthlyData {
  total: number;
  openai: number;
  anthropic: number;
  google: number;
}

interface CostsChartProps {
  daily: DailyData[];
  monthly: MonthlyData;
}

const providerColors = {
  openai: { main: '#10b981', light: 'rgba(16, 185, 129, 0.15)' },
  anthropic: { main: '#f97316', light: 'rgba(249, 115, 22, 0.15)' },
  google: { main: '#06b6d4', light: 'rgba(6, 182, 212, 0.15)' },
};

export default function CostsChart({ daily, monthly }: CostsChartProps) {
  const [activeProviders, setActiveProviders] = useState<Record<string, boolean>>({
    openai: true,
    anthropic: true,
    google: true,
  });

  const toggleProvider = (provider: string) => {
    setActiveProviders(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/95 backdrop-blur-md rounded-xl p-4 border border-white/[0.08] shadow-2xl"
        >
          <p className="text-sm font-medium text-white mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-zinc-400 capitalize">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-white">${entry.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Total</span>
              <span className="text-sm font-bold text-white">
                ${payload.reduce((sum, p) => sum + p.value, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const percentChange = -12.3; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "rounded-2xl p-6",
        "bg-gradient-to-b from-white/[0.04] to-white/[0.01]",
        "border border-white/[0.08]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={18} className="text-teal-500" />
            <h2 className="text-lg font-semibold text-white">API Costs</h2>
          </div>
          <p className="text-sm text-zinc-500">Last 7 days spending</p>
        </div>
        
        <Badge 
          variant="outline"
          className={cn(
            "flex items-center gap-1.5",
            percentChange < 0 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          )}
        >
          {percentChange < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          <span className="font-medium">{Math.abs(percentChange)}%</span>
        </Badge>
      </div>
      
      {/* Provider Toggle */}
      <div className="flex items-center gap-2 mb-6">
        {Object.entries(providerColors).map(([provider, colors]) => (
          <Button
            key={provider}
            variant="outline"
            size="sm"
            onClick={() => toggleProvider(provider)}
            className={cn(
              "h-8 px-3 text-xs font-medium transition-all",
              activeProviders[provider]
                ? "bg-white/[0.05] border-white/[0.15] text-white"
                : "bg-transparent border-white/[0.05] text-zinc-600 opacity-50"
            )}
          >
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: activeProviders[provider] ? colors.main : 'currentColor' }}
            />
            <span className="capitalize">{provider}</span>
            {activeProviders[provider] ? (
              <Eye size={12} className="ml-2 opacity-50" />
            ) : (
              <EyeOff size={12} className="ml-2 opacity-50" />
            )}
          </Button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={daily} 
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {Object.entries(providerColors).map(([provider, colors]) => (
                <linearGradient key={provider} id={`color-${provider}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.main} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colors.main} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.03)" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            
            {activeProviders.openai && (
              <Area
                type="monotone"
                dataKey="openai"
                stroke={providerColors.openai.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#color-openai)"
                animationDuration={1000}
              />
            )}
            {activeProviders.anthropic && (
              <Area
                type="monotone"
                dataKey="anthropic"
                stroke={providerColors.anthropic.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#color-anthropic)"
                animationDuration={1000}
              />
            )}
            {activeProviders.google && (
              <Area
                type="monotone"
                dataKey="google"
                stroke={providerColors.google.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#color-google)"
                animationDuration={1000}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Monthly Summary */}
      <div className="grid grid-cols-4 gap-3">
        <motion.div 
          className="bg-white/[0.02] rounded-xl p-3 text-center border border-white/[0.05]"
          whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-2xl font-bold text-white">${monthly.total.toFixed(0)}</p>
          <p className="text-xs text-zinc-500 mt-1">Total MTD</p>
        </motion.div>
        
        {Object.entries(providerColors).map(([provider, colors]) => (
          <motion.div 
            key={provider}
            className="bg-white/[0.02] rounded-xl p-3 text-center border border-white/[0.05]"
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.main }} />
              <p className="text-lg font-semibold text-white">
                ${(monthly as unknown as Record<string, number>)[provider]}
              </p>
            </div>
            <p className="text-xs text-zinc-500 capitalize">{provider}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
