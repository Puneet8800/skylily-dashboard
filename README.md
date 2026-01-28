# Skylily Dashboard 🌸

A beautiful, dark-themed Next.js dashboard for the Skylily AI Orchestration Platform.

![Skylily Dashboard](./preview.png)

## Features

- 🎨 **Modern Design** - Glassmorphism, gradients, and smooth animations
- 📊 **Interactive Charts** - API costs visualization with Recharts
- 🔍 **Search & Filter** - Find tools quickly
- 📱 **Responsive** - Works on mobile and desktop
- ⚡ **Fast** - Built with Next.js 14 and Tailwind CSS
- 🎬 **Animated** - Powered by Framer Motion

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & utilities
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard page
├── components/
│   ├── ActivityFeed.tsx    # Recent activity section
│   ├── AnimatedCounter.tsx # Animated number counters
│   ├── CostsChart.tsx      # API costs chart
│   ├── SearchFilter.tsx    # Search and filter bar
│   ├── SystemStatus.tsx    # System status section
│   ├── ToolCard.tsx        # Tool card component
│   └── ToolModal.tsx       # Tool detail modal
└── data/
    └── tools.json       # Tools and mock data
```

## Sections

1. **Hero Stats** - Animated counters for total tools, tests, and packages
2. **Core Tools** - Primary Skylily tools (smart-router, git-smart, etc.)
3. **Network Toolkit** - 35 network analysis and security tools
4. **API Costs** - Interactive chart showing daily/monthly API spending
5. **System Status** - Server uptime, memory, CPU, Docker containers
6. **Recent Activity** - Live feed of deployments, tests, commits
7. **Utility Libraries** - 57 npm packages in the @skylily scope

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Puneet8800/skylily-dashboard)

Or deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Environment Variables

No environment variables required for the basic dashboard.

## License

MIT © Skylily

---

Built with 💜 by Skylily on M4 Pro Mac
