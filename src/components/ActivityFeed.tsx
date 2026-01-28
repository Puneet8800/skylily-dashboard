'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, CheckCircle2, GitCommit, AlertTriangle, Hammer, 
  GitPullRequest, Activity, Clock, ChevronDown
} from 'lucide-react';
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

const typeColors: Record<string, string> = {
  deploy: 'text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/20',
  test: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  commit: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  alert: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  build: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  pr: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 5);
  
  return (
    <div className="rounded-lg p-6 bg-[#0a0a0a] border border-[#a855f7]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#a855f7]/30 rounded-lg bg-[#a855f7]/5">
            <Activity size={18} className="text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">Activity Feed</h3>
            <p className="text-xs text-[#a855f7] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse"></span>
              LIVE
            </p>
          </div>
        </div>
      </div>
      
      {/* Activity List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayedActivities.map((activity, index) => {
            const Icon = iconMap[activity.icon] || Activity;
            const colors = typeColors[activity.type] || typeColors.deploy;
            
            return (
              <motion.div
                key={`${activity.message}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  "bg-black/30 border border-[#00ff00]/5",
                  "hover:border-[#00ff00]/20 transition-all cursor-pointer"
                )}
              >
                <div className={cn("p-1.5 rounded border shrink-0", colors)}>
                  <Icon size={12} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 line-clamp-1">{activity.message}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock size={10} className="text-zinc-500" />
                    <span className="text-xs text-zinc-400">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* View All Button */}
      {activities.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "w-full mt-4 py-2.5 rounded-lg text-sm font-mono",
            "bg-[#a855f7]/5 border border-[#a855f7]/10",
            "text-zinc-400 hover:text-[#a855f7] hover:border-[#a855f7]/30",
            "transition-all flex items-center justify-center gap-2"
          )}
        >
          <span className="text-zinc-600">&gt;</span>
          {showAll ? 'show_less' : `view_all --count ${activities.length}`}
          <ChevronDown 
            size={14} 
            className={cn("transition-transform", showAll && "rotate-180")} 
          />
        </button>
      )}
    </div>
  );
}
