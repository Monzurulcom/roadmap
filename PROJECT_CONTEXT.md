# WebnWell Roadmap — Project Context

## Quick Reference

- **Live URL**: https://roadmap.webnwell.com
- **Project Path**: /Users/smmonzurulhasan/Desktop/roadmap
- **Server Port**: 4060
- **Tech**: Zero-dependency Node.js HTTP server + Vanilla SPA (no build step)
- **Tunnel**: Cloudflare Tunnel (shared with other webnwell apps)
- **Account ID**: 0df6145b74a87007ba71033fc86cfd3e

## Architecture

This is a static SPA served by a zero-dependency Node.js HTTP server.
No build step required — all files in `public/` are served directly.

### File Structure

```
roadmap/
├── server.js          # HTTP server (port 4060)
├── package.json       # Project metadata
├── deploy.sh          # Deployment script
├── .gitignore
├── PROJECT_CONTEXT.md # This file
└── public/
    ├── index.html     # Main HTML shell
    ├── styles.css     # Complete design system
    ├── data.js        # Roadmap data (4 roadmaps)
    └── app.js         # Application logic
```

### Roadmaps

1. **Vibe Coding App** — AI-assisted coding platform
2. **Production Process Automation** — Manufacturing workflow automation
3. **Sales Accomplishment** — Pipeline growth & revenue milestones
4. **Personal Productivity** — Time & energy optimization

## Deployment

1. Deploy: `./deploy.sh`
2. Logs: `tail -f /tmp/roadmap-server.log`
3. Health: `curl http://localhost:4060/api/health`

## CRITICAL: Tunnel uses REMOTE config

Editing local /etc/cloudflared/config.yml ingress does NOT change routing.
Use Cloudflare API to modify routes.
