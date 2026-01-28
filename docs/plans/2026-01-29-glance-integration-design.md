# Sky-Dash v2: Glance-Style Dashboard Integration

**Date:** 2026-01-29  
**Status:** Approved  
**Author:** Skylily 🌸

---

## Overview

Transform Sky-Dash from a single-page metrics dashboard into a full-featured personal dashboard with multiple pages, RSS feeds, bookmarks, and customization — inspired by Glance but natively built.

## Navigation

### Bottom Tab Bar
- Sticky at viewport bottom
- 4 tabs with icons and labels
- Active tab highlighted
- Works on desktop and mobile

```
┌────────────────────────────────────────────────┐
│                   Content                       │
│                                                 │
├────────┬────────┬────────┬────────┬────────────┤
│  🏠    │  📰    │  🛠️    │  🔗    │            │
│ Home   │ Feeds  │ Tools  │ Links  │            │
└────────┴────────┴────────┴────────┴────────────┘
```

## Pages

### 🏠 Home (Route: `/`)
Current dashboard functionality:
- System metrics (CPU, Memory, Disk, Temp)
- Docker containers (with restart/logs)
- Services health check
- Tailscale devices
- Quick Actions
- API Costs chart

### 📰 Feeds (Route: `/feeds`)

#### Widgets
1. **Weather Widget**
   - Location: Delhi, India
   - Shows: Current temp, conditions, 5-day forecast
   - API: Open-Meteo (free, no key required)

2. **Calendar Widget**
   - Current month view
   - Highlights today
   - Week starts Monday

3. **RSS Feed Aggregator**
   - Default sources:
     - GitHub Trending (all, Python, TypeScript, Go)
     - Hacker News (top stories)
     - Product Hunt (daily)
     - Lobste.rs
     - Dev.to
     - TechCrunch
     - Ars Technica
   - Collapsible sections
   - "Last updated" timestamps
   - Click to open in new tab

4. **Feed Manager**
   - Add custom RSS feed URL
   - Remove existing feeds
   - Reorder feeds (drag & drop)
   - Enable/disable feeds
   - Stored in localStorage (later: pulsed backend)

#### Layout
```
┌─────────────┬──────────────────────────────────┐
│  Weather    │                                  │
├─────────────┤         RSS Feeds                │
│  Calendar   │    (scrollable, collapsible)     │
│             │                                  │
├─────────────┤    [+ Add Feed] button           │
│ Feed Mgr    │                                  │
└─────────────┴──────────────────────────────────┘
```

### 🛠️ Tools (Route: `/tools`)
Moved from current home page:
- Tools grid (4 columns on desktop)
- Search/filter functionality
- Tool cards with status badges
- Click for modal with details
- Utility libraries section

### 🔗 Links (Route: `/links`)

#### Features
1. **Bookmark Categories**
   - Homelab Services
   - Dev Tools
   - Social
   - Productivity
   - Custom categories

2. **View Toggle**
   - List view: Compact, scannable
   - Grid view: Icons, visual

3. **Link Manager**
   - Add new link (title, URL, category, icon)
   - Edit existing links
   - Delete links
   - Reorder within category
   - Stored in localStorage (later: pulsed backend)

#### Default Links (from Glance config)
- Dashy Dashboard
- Glance Dashboard
- Presenton AI
- Netdata Monitor
- Clawdbot Gateway
- RSS Bridge

---

## Technical Implementation

### Routing
- Use Next.js App Router
- `/app/page.tsx` → Home
- `/app/feeds/page.tsx` → Feeds
- `/app/tools/page.tsx` → Tools
- `/app/links/page.tsx` → Links

### Components Structure
```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── feeds/page.tsx        # Feeds
│   ├── tools/page.tsx        # Tools
│   ├── links/page.tsx        # Links
│   └── layout.tsx            # Add TabBar
├── components/
│   ├── navigation/
│   │   └── TabBar.tsx        # Bottom navigation
│   ├── feeds/
│   │   ├── WeatherWidget.tsx
│   │   ├── CalendarWidget.tsx
│   │   ├── RSSFeed.tsx
│   │   └── FeedManager.tsx
│   ├── links/
│   │   ├── BookmarkList.tsx
│   │   ├── BookmarkGrid.tsx
│   │   └── LinkManager.tsx
│   └── widgets/              # Existing
└── lib/
    ├── feeds.ts              # RSS fetching
    ├── weather.ts            # Weather API
    └── storage.ts            # localStorage helpers
```

### Data Storage
**Phase 1:** localStorage
- Feed preferences
- Custom feeds
- Bookmarks
- View preferences

**Phase 2:** Pulsed backend (future)
- Add endpoints to pulsed for persistence
- Sync across devices

### External APIs
1. **RSS Feeds**: Fetch via Next.js API routes (avoid CORS)
2. **Weather**: Open-Meteo API (free, no key)
3. **Hacker News**: Official API

---

## Implementation Phases

### Phase 1: Navigation & Structure (1-2 hours)
- [ ] Create TabBar component
- [ ] Set up routing for all 4 pages
- [ ] Move tools section to /tools
- [ ] Basic /feeds and /links pages

### Phase 2: Feeds Page (2-3 hours)
- [ ] Weather widget (Open-Meteo)
- [ ] Calendar widget
- [ ] RSS feed components
- [ ] API routes for RSS fetching
- [ ] Feed display with collapsible sections

### Phase 3: Links Page (1-2 hours)
- [ ] Bookmark list/grid components
- [ ] View toggle
- [ ] localStorage persistence
- [ ] Default bookmarks

### Phase 4: Feed & Link Management (2-3 hours)
- [ ] Add/remove feeds UI
- [ ] Add/edit/remove links UI
- [ ] Drag & drop reordering
- [ ] Settings persistence

---

## Design Tokens

Keep existing Sky-Dash theme:
- Background: #0a0a0a (pitch black)
- Primary accent: #0ea5e9 (sky blue)
- Secondary accents: teal, violet, amber, pink
- Font: JetBrains Mono (headings), Space Grotesk (body)

---

## Success Criteria

1. ✅ All 4 pages accessible via bottom tab bar
2. ✅ Feeds page shows weather, calendar, RSS feeds
3. ✅ Tools page has all existing tool functionality
4. ✅ Links page with list/grid toggle
5. ✅ Custom feeds can be added/removed
6. ✅ Custom links can be added/removed
7. ✅ Preferences persist in localStorage
8. ✅ Mobile responsive

---

*Ready for implementation!*
