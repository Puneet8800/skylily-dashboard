'use client';

import { motion } from 'framer-motion';
import { 
  Rocket, CheckCircle2, GitCommit, AlertTriangle, Hammer, 
  GitPullRequest, Activity, Bell, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const iconMap: Record<string, ElementType> = {
  rocket: Rocket,
  'check-circle': CheckCircle2,
  'git-commit': GitCommit,
  'alert-triangle': AlertTriangle,
  hammer: Hammer,
  'git-pull-request': GitPullRequest,
  activity: Activity,
};

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  deploy: { color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  test: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  commit: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  alert: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  build: { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  pr: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "rounded-2xl p-6",
        "bg-gradient-to-b from-white/[0.04] to-white/[0.01]",
        "border border-white/[0.08]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-teal-500" />
          <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
        </div>
        <Badge variant="outline" className="bg-white/[0.02] border-white/[0.08] text-zinc-400">
          <Bell size={12} className="mr-1.5" />
          Live
        </Badge>
      </div>
      
      {/* Activity List */}
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.icon] || Activity;
          const config = typeConfig[activity.type] || typeConfig.deploy;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ x: 4 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl cursor-pointer",
                "bg-white/[0.01] border border-transparent",
                "hover:bg-white/[0.03] hover:border-white/[0.05] transition-all"
              )}
            >
              <div className={cn("p-2 rounded-lg shrink-0", config.bg, config.border, 'border')}>
                <Icon size={14} className={config.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 line-clamp-1">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={10} className="text-zinc-600" />
                  <span className="text-xs text-zinc-500">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "w-full mt-4 py-3 rounded-xl text-sm font-medium",
          "bg-white/[0.02] border border-white/[0.05]",
          "text-zinc-400 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.08]",
          "transition-all"
        )}
      >
        View all activity →
      </motion.button>
    </motion.div>
  );
}
