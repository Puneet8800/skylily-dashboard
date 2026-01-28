// LocalStorage helpers for feeds and links

export interface CustomFeed {
  id: string;
  name: string;
  url: string;
  color: string;
  enabled: boolean;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
}

const FEEDS_KEY = 'skylily-feeds';
const LINKS_KEY = 'skylily-links';
const FEED_PREFS_KEY = 'skylily-feed-prefs';
const LINK_VIEW_KEY = 'skylily-link-view';

// Default feeds
export const defaultFeeds: CustomFeed[] = [
  { id: 'hn', name: 'Hacker News', url: '', color: '#f97316', enabled: true },
  { id: 'github', name: 'GitHub Trending', url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml', color: '#0ea5e9', enabled: true },
  { id: 'producthunt', name: 'Product Hunt', url: 'https://www.producthunt.com/feed', color: '#ec4899', enabled: true },
  { id: 'lobsters', name: 'Lobste.rs', url: 'https://lobste.rs/rss', color: '#ef4444', enabled: true },
  { id: 'devto', name: 'Dev.to', url: 'https://dev.to/feed', color: '#a855f7', enabled: true },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', color: '#22c55e', enabled: false },
  { id: 'arstechnica', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', color: '#f59e0b', enabled: false },
];

// Default links
export const defaultLinks: CustomLink[] = [
  { id: '1', title: 'Dashy Dashboard', url: 'https://dashy.local', category: 'Homelab', icon: 'server' },
  { id: '2', title: 'Glance Dashboard', url: 'https://glance.local', category: 'Homelab', icon: 'server' },
  { id: '3', title: 'Presenton AI', url: 'https://presenton.local', category: 'Homelab', icon: 'sparkles' },
  { id: '4', title: 'Netdata Monitor', url: 'https://netdata.local', category: 'Homelab', icon: 'server' },
  { id: '5', title: 'Clawdbot Gateway', url: 'https://clawdbot.local', category: 'Homelab', icon: 'sparkles' },
  { id: '6', title: 'RSS Bridge', url: 'https://rss-bridge.local', category: 'Homelab', icon: 'server' },
  { id: '7', title: 'Uptime Kuma', url: 'http://localhost:19999', category: 'Homelab', icon: 'server' },
  { id: '8', title: 'GitHub', url: 'https://github.com', category: 'Dev Tools', icon: 'code' },
  { id: '9', title: 'VS Code Web', url: 'https://vscode.dev', category: 'Dev Tools', icon: 'code' },
  { id: '10', title: 'Vercel', url: 'https://vercel.com', category: 'Dev Tools', icon: 'globe' },
  { id: '11', title: 'Twitter/X', url: 'https://x.com', category: 'Social', icon: 'globe' },
  { id: '12', title: 'LinkedIn', url: 'https://linkedin.com', category: 'Social', icon: 'globe' },
];

// Feeds
export function getFeeds(): CustomFeed[] {
  if (typeof window === 'undefined') return defaultFeeds;
  const stored = localStorage.getItem(FEEDS_KEY);
  if (!stored) return defaultFeeds;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultFeeds;
  }
}

export function saveFeeds(feeds: CustomFeed[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FEEDS_KEY, JSON.stringify(feeds));
}

export function addFeed(feed: Omit<CustomFeed, 'id'>): CustomFeed[] {
  const feeds = getFeeds();
  const newFeed = { ...feed, id: `custom-${Date.now()}` };
  const updated = [...feeds, newFeed];
  saveFeeds(updated);
  return updated;
}

export function removeFeed(id: string): CustomFeed[] {
  const feeds = getFeeds().filter(f => f.id !== id);
  saveFeeds(feeds);
  return feeds;
}

export function toggleFeed(id: string): CustomFeed[] {
  const feeds = getFeeds().map(f => 
    f.id === id ? { ...f, enabled: !f.enabled } : f
  );
  saveFeeds(feeds);
  return feeds;
}

// Links
export function getLinks(): CustomLink[] {
  if (typeof window === 'undefined') return defaultLinks;
  const stored = localStorage.getItem(LINKS_KEY);
  if (!stored) return defaultLinks;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultLinks;
  }
}

export function saveLinks(links: CustomLink[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function addLink(link: Omit<CustomLink, 'id'>): CustomLink[] {
  const links = getLinks();
  const newLink = { ...link, id: `link-${Date.now()}` };
  const updated = [...links, newLink];
  saveLinks(updated);
  return updated;
}

export function updateLink(id: string, data: Partial<CustomLink>): CustomLink[] {
  const links = getLinks().map(l => 
    l.id === id ? { ...l, ...data } : l
  );
  saveLinks(links);
  return links;
}

export function removeLink(id: string): CustomLink[] {
  const links = getLinks().filter(l => l.id !== id);
  saveLinks(links);
  return links;
}

// View preferences
export function getLinkViewMode(): 'list' | 'grid' {
  if (typeof window === 'undefined') return 'list';
  return (localStorage.getItem(LINK_VIEW_KEY) as 'list' | 'grid') || 'list';
}

export function saveLinkViewMode(mode: 'list' | 'grid'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LINK_VIEW_KEY, mode);
}

export function getFeedExpandedState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(FEED_PREFS_KEY);
  if (!stored) return { hn: true, github: true };
  try {
    return JSON.parse(stored);
  } catch {
    return { hn: true, github: true };
  }
}

export function saveFeedExpandedState(state: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FEED_PREFS_KEY, JSON.stringify(state));
}
