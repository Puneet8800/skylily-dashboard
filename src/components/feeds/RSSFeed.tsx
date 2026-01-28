'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, RefreshCw, MessageSquare, ArrowUp } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
  points?: number;
  comments?: number;
  commentsUrl?: string;
}

interface RSSFeedProps {
  feedId: string;
  type: string;
  url?: string;
  color: string;
}

export default function RSSFeed({ feedId, type, url, color }: RSSFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      if (type === 'hackernews') {
        // Fetch from HN API
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = await response.json();
        const topIds = ids.slice(0, 15);
        
        const stories = await Promise.all(
          topIds.map(async (id: number) => {
            const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return storyRes.json();
          })
        );
        
        setItems(stories.map((s: any) => ({
          title: s.title,
          link: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
          pubDate: new Date(s.time * 1000).toISOString(),
          points: s.score,
          comments: s.descendants || 0,
          commentsUrl: `https://news.ycombinator.com/item?id=${s.id}`,
        })));
      } else if (url) {
        // Fetch RSS via our API route
        const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch feed');
        const data = await response.json();
        setItems(data.items.slice(0, 15));
      }
      setError(null);
    } catch (e) {
      setError('Failed to load feed');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [feedId, url]);

  if (loading) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        {error}
        <button
          onClick={fetchFeed}
          className="block mx-auto mt-2 text-xs text-[#0ea5e9] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {items.map((item, index) => (
        <motion.a
          key={`${feedId}-${index}`}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <h4 className="text-sm text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
              {item.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
              {item.pubDate && (
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(item.pubDate))}
                </span>
              )}
              {item.points !== undefined && (
                <span className="flex items-center gap-1" style={{ color }}>
                  <ArrowUp size={10} />
                  {item.points}
                </span>
              )}
              {item.comments !== undefined && item.commentsUrl && (
                <a 
                  href={item.commentsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare size={10} />
                  {item.comments}
                </a>
              )}
            </div>
          </div>
          <ExternalLink size={14} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-1" />
        </motion.a>
      ))}
    </div>
  );
}
