'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';

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

export default function CostsChart({ daily, monthly }: CostsChartProps) {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-white/10">
          <p className="text-sm text-zinc-400 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.name === 'openai' ? '#22c55e' : entry.name === 'anthropic' ? '#f97316' : '#3b82f6' }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">API Costs</h2>
          <p className="text-sm text-zinc-500">Last 7 days spending</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
          <TrendingDown size={16} />
          <span className="text-sm font-medium">-12.3%</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOpenai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAnthropic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="openai"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOpenai)"
            />
            <Area
              type="monotone"
              dataKey="anthropic"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAnthropic)"
            />
            <Area
              type="monotone"
              dataKey="google"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGoogle)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Monthly breakdown */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">${monthly.total.toFixed(2)}</p>
          <p className="text-xs text-zinc-500">Total MTD</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-lg font-semibold text-white">${monthly.openai}</p>
          </div>
          <p className="text-xs text-zinc-500">OpenAI</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="text-lg font-semibold text-white">${monthly.anthropic}</p>
          </div>
          <p className="text-xs text-zinc-500">Anthropic</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <p className="text-lg font-semibold text-white">${monthly.google}</p>
          </div>
          <p className="text-xs text-zinc-500">Google</p>
        </div>
      </div>
    </motion.div>
  );
}
