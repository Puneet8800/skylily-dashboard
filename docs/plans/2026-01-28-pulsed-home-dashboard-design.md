# Pulsed + Skylily Dashboard: Unified Home Dashboard

**Date:** 2026-01-28  
**Status:** Approved  
**Author:** Skylily 🌸 + Puneet

---

## Overview

Transform Skylily Dashboard into a **unified home dashboard** that replaces Dashy/Glance by building `pulsed` - a lightweight Rust daemon that collects metrics from all homelab services.

## Decisions

| Question | Decision |
|----------|----------|
| Dashboard Role | **Replacement** - Replace Dashy/Glance entirely |
| Features | All 10 categories |
| Data Fetching | Dedicated backend service |
| Backend Tech | **Rust** |
| Service Name | **pulsed** |
| Deployment | launchd (Mac native) + Docker (other machines) |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 SKYLILY DASHBOARD                        │
│            (Next.js @ skydash.local)                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Docker  │ │ System  │ │ Network │ │  API    │  ...  │
│  │ Widget  │ │ Metrics │ │ Status  │ │  Costs  │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       └───────────┴─────┬─────┴───────────┘             │
│                         ▼                               │
│              GET /api/metrics                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      PULSED                             │
│              (Rust daemon @ :9876)                      │
│                                                         │
│  Collectors:                                            │
│  ├── docker.rs    → Docker socket                       │
│  ├── system.rs    → sysinfo crate                       │
│  ├── tailscale.rs → tailscale CLI/API                   │
│  ├── network.rs   → Interface stats                     │
│  └── services.rs  → Health checks                       │
│                                                         │
│  API: REST + WebSocket for live updates                 │
└─────────────────────────────────────────────────────────┘
```

## Pulsed API

**Base URL:** `http://localhost:9876/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health + uptime |
| `/system` | GET | CPU, RAM, disk, temps, load |
| `/docker` | GET | All containers with stats |
| `/docker/:id/logs` | GET | Container logs (last N lines) |
| `/docker/:id/restart` | POST | Restart a container |
| `/network` | GET | Interfaces, bandwidth, connections |
| `/tailscale` | GET | Devices with online status |
| `/services` | GET | Health check results |
| `/stream` | WS | Real-time metrics push |

**Config:** `~/.config/pulsed/config.toml`

```toml
poll_interval = "5s"
api_port = 9876
docker_socket = "/var/run/docker.sock"

[[services]]
name = "presenton"
url = "https://presenton.home"
interval = "30s"

[[services]]
name = "uptime-kuma"
url = "http://localhost:19999"
interval = "30s"
```

## Dashboard Widgets

### Phase 1 (Launch)
- 🖥️ **System** - CPU, RAM, disk, temps
- 🐳 **Docker** - Container status, restart, logs
- 💰 **API Costs** - Already implemented

### Phase 2 (Operations)
- ⬆️ **Uptime** - Service health checks
- 🌐 **Tailscale** - Device status
- 🔧 **Quick Actions** - Common scripts/commands

### Phase 3 (Extended)
- 📰 **RSS Feeds** - News aggregation
- 📊 **Custom Metrics** - Tool usage stats
- 📁 **Storage** - Disk usage across machines
- 🏠 **Home Automation** - IoT integrations

## Project Structure

```
skylily-pulsed/
├── Cargo.toml
├── README.md
├── Dockerfile
├── config.example.toml
├── src/
│   ├── main.rs
│   ├── config.rs
│   ├── server.rs
│   ├── collectors/
│   │   ├── mod.rs
│   │   ├── system.rs
│   │   ├── docker.rs
│   │   ├── tailscale.rs
│   │   ├── network.rs
│   │   └── services.rs
│   ├── api/
│   │   ├── mod.rs
│   │   ├── routes.rs
│   │   └── websocket.rs
│   └── types.rs
├── scripts/
│   ├── install.sh
│   └── com.skylily.pulsed.plist
└── tests/
    └── integration.rs
```

## Dependencies

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
sysinfo = "0.30"
bollard = "0.16"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
toml = "0.8"
tower-http = { version = "0.5", features = ["cors"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

## Implementation Timeline

### Phase 1: Foundation (This Week)

**Day 1-2: Pulsed Core**
- [ ] Scaffold Rust project
- [ ] Config file parsing
- [ ] Axum server with /health
- [ ] System collector
- [ ] launchd installation

**Day 3-4: Docker + API**
- [ ] Docker collector (bollard)
- [ ] Container endpoints
- [ ] CORS configuration

**Day 5: Dashboard Integration**
- [ ] System widget
- [ ] Docker widget
- [ ] Connect to pulsed

### Phase 2: Operations (Next Week)
- [ ] Tailscale collector
- [ ] Network stats
- [ ] Uptime checks
- [ ] Quick actions
- [ ] WebSocket streaming

### Phase 3: Extended (Week 3+)
- [ ] RSS integration
- [ ] Custom metrics
- [ ] Storage monitoring
- [ ] Home automation
- [ ] Docker deployment

## Deployment

### macOS (launchd)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.skylily.pulsed</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/pulsed</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/pulsed.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/pulsed.err</string>
</dict>
</plist>
```

### Docker

```dockerfile
FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.19
COPY --from=builder /app/target/release/pulsed /usr/local/bin/
EXPOSE 9876
CMD ["pulsed"]
```

---

*Design approved by Puneet on 2026-01-28*
