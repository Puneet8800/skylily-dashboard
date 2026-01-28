'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
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
  openai: { main: '#00ff00', light: 'rgba(0, 255, 0, 0.1)' },
  anthropic: { main: '#00ffff', light: 'rgba(0, 255, 255, 0.1)' },
  google: { main: '#ffff00', light: 'rgba(255, 255, 0, 0.1)' },
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
    if (!active || !payload) return null;
    return (
      <div className="bg-[#0a0a0a] border border-[#00ff00]/20 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-zinc-500 font-mono mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-zinc-400 font-mono">{entry.name}:</span>
            <span className="text-white font-mono font-semibold">${entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  };

  const percentChange = -12.3; // Mock data

  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#facc15]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#facc15]/30 rounded-lg bg-[#facc15]/5">
            <DollarSign size={18} className="text-[#facc15]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">API Costs</h3>
            <p className="text-xs text-zinc-500 font-mono">Last 7 days spending</p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded text-sm font-mono",
          percentChange < 0 ? "text-[#00ff00] bg-[#00ff00]/10" : "text-[#ef4444] bg-[#ef4444]/10"
        )}>
          {percentChange < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {Math.abs(percentChange)}%
        </div>
      </div>
      
      {/* Provider Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(providerColors).map(([provider, colors]) => (
          <button
            key={provider}
            onClick={() => toggleProvider(provider)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-mono border transition-all",
              activeProviders[provider]
                ? "border-current bg-current/10"
                : "border-zinc-700 text-zinc-500"
            )}
            style={{ 
              color: activeProviders[provider] ? colors.main : undefined,
              borderColor: activeProviders[provider] ? colors.main : undefined 
            }}
          >
            {provider}
          </button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daily}>
            <defs>
              {Object.entries(providerColors).map(([provider, colors]) => (
                <linearGradient key={provider} id={`gradient-${provider}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.main} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.main} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(providerColors).map(([provider, colors]) => (
              activeProviders[provider] && (
                <Area
                  key={provider}
                  type="monotone"
                  dataKey={provider}
                  stroke={colors.main}
                  strokeWidth={2}
                  fill={`url(#gradient-${provider})`}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Totals */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[#00ff00]/10">
        <div>
          <p className="text-2xl font-bold text-white font-mono">${monthly.total}</p>
          <p className="text-xs text-zinc-500 font-mono">Total MTD</p>
        </div>
        {Object.entries({ openai: monthly.openai, anthropic: monthly.anthropic, google: monthly.google }).map(([provider, value]) => (
          <div key={provider}>
            <p className="text-lg font-semibold font-mono" style={{ color: providerColors[provider as keyof typeof providerColors].main }}>
              ${value}
            </p>
            <p className="text-xs text-zinc-500 font-mono capitalize">{provider}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
