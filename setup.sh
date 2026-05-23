#!/bin/bash
# WebnWell Roadmap — Full Setup Script
# Run this from Terminal.app (NOT from the Antigravity sandbox)
# Usage: cd ~/Desktop/roadmap && bash setup.sh

set -e

echo "=========================================="
echo "  WebnWell Roadmap — Full Setup"
echo "=========================================="
echo ""

# ---- Step 1: Git Init & Push to GitHub ----
echo "📦 Step 1: Initializing Git & pushing to GitHub..."

if [ ! -d ".git" ]; then
  git init
  echo "✅ Git initialized"
else
  echo "ℹ️  Git already initialized"
fi

git add -A
git commit -m "Initial commit: WebnWell Roadmap Dashboard" 2>/dev/null || echo "ℹ️  Nothing to commit"

# Create GitHub repo (public)
if ! gh repo view Monzurulcom/roadmap &>/dev/null; then
  gh repo create Monzurulcom/roadmap --public --source=. --remote=origin --push
  echo "✅ GitHub repo created and pushed"
else
  echo "ℹ️  GitHub repo already exists"
  git remote add origin https://github.com/Monzurulcom/roadmap.git 2>/dev/null || true
  git branch -M main
  git push -u origin main
  echo "✅ Pushed to GitHub"
fi

echo ""

# ---- Step 2: Make deploy.sh executable ----
chmod +x deploy.sh
echo "✅ deploy.sh is now executable"
echo ""

# ---- Step 3: Create LaunchAgent ----
echo "🔧 Step 2: Creating LaunchAgent..."

PLIST=~/Library/LaunchAgents/com.webnwell.roadmap-server.plist

cat > "$PLIST" << 'PLIST_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.webnwell.roadmap-server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/smmonzurulhasan/Desktop/roadmap/server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/smmonzurulhasan/Desktop/roadmap</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PORT</key>
        <string>4060</string>
        <key>NODE_ENV</key>
        <string>production</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/roadmap-server.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/roadmap-server-error.log</string>
</dict>
</plist>
PLIST_EOF

# Check which node path to use
NODE_PATH=$(which node)
sed -i '' "s|/usr/local/bin/node|$NODE_PATH|g" "$PLIST"

echo "✅ LaunchAgent created at $PLIST"

# Load the agent
launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
sleep 1
launchctl bootstrap gui/$(id -u) "$PLIST"
echo "✅ LaunchAgent loaded — server starting on port 4060"

# Verify
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4060 | grep -q "200"; then
  echo "✅ Server is responding at http://localhost:4060"
else
  echo "⚠️  Server may still be starting... check: tail -f /tmp/roadmap-server.log"
fi

echo ""

# ---- Step 3: Configure Cloudflare Tunnel ----
echo "🌐 Step 3: Cloudflare Tunnel Setup"
echo ""
echo "The tunnel uses REMOTE configuration. You need to add the route via Cloudflare Dashboard:"
echo ""
echo "  1. Go to: https://one.dash.cloudflare.com/"
echo "  2. Navigate to: Networks → Tunnels"
echo "  3. Select tunnel: google-ads-optimizer (ID: 9309ecbc-dfb0-4ae7-ba44-ef6d5e21df12)"
echo "  4. Go to 'Public Hostname' tab"
echo "  5. Add a new public hostname:"
echo "       Subdomain: roadmap"
echo "       Domain:    webnwell.com"
echo "       Service:   http://localhost:4060"
echo ""
echo "  OR use the API (below):"
echo ""

# Display API command
cat << 'API_EOF'
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/0df6145b74a87007ba71033fc86cfd3e/cfd_tunnel/9309ecbc-dfb0-4ae7-ba44-ef6d5e21df12/configurations" \
    -H "Authorization: Bearer YOUR_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '... (include existing config + new roadmap hostname)'
API_EOF

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "  Local:  http://localhost:4060"
echo "  Live:   https://roadmap.webnwell.com (after tunnel config)"
echo "  GitHub: https://github.com/Monzurulcom/roadmap"
echo "  Logs:   tail -f /tmp/roadmap-server.log"
echo ""
