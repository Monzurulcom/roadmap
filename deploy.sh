#!/bin/bash
# WebnWell Roadmap — Deploy Script
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying WebnWell Roadmap..."

# Load the LaunchAgent (start/restart the server)
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.webnwell.roadmap-server.plist 2>/dev/null || true
sleep 1
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.webnwell.roadmap-server.plist

echo "✅ Server started on port 4060"
echo "📋 Logs: tail -f /tmp/roadmap-server.log"
echo ""

# Check if server is responding
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4060 | grep -q "200"; then
  echo "✅ Server is responding at http://localhost:4060"
else
  echo "⚠️  Server may still be starting... check logs"
fi
