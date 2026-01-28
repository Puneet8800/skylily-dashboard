'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  Rocket, 
  CheckCircle, 
  GitCommit, 
  AlertTriangle, 
  Hammer, 
  GitPullRequest 
} from 'lucide-react';
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
  'check-circle': CheckCircle,
  'git-commit': GitCommit,
  'alert-triangle': AlertTriangle,
  hammer: Hammer,
  'git-pull-request': GitPullRequest,
  activity: Activity,
};

const getIcon = (iconName: string): ElementType => {
  return iconMap[iconName] || Activity;
};

const typeColors: Record<string, string> = {
  deploy: 'text-sky-400 bg-sky-500/20',
  test: 'text-emerald-400 bg-emerald-500/20',
  commit: 'text-violet-400 bg-violet-500/20',
  alert: 'text-amber-400 bg-amber-500/20',
  build: 'text-orange-400 bg-orange-500/20',
  pr: 'text-pink-400 bg-pink-500/20',
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-lily-400" size={20} />
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
      </div>
      
      <div className="space-y-1">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.icon);
          const colorClass = typeColors[activity.type] || 'text-zinc-400 bg-zinc-500/20';
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${colorClass.split(' ')[1]} shrink-0`}>
                <Icon size={14} className={colorClass.split(' ')[0]} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white group-hover:text-sky-100 transition-colors truncate">
                  {activity.message}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
        View all activity →
      </button>
    </motion.div>
  );
}
