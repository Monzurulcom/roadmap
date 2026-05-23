#!/bin/bash
# ============================================
# WebnWell Roadmap — Complete Auto-Setup
# ============================================
# Run from Terminal.app:
#   cd ~/Desktop/roadmap && bash setup.sh
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "=========================================="
echo "  🗺️  WebnWell Roadmap — Full Setup"
echo "=========================================="
echo ""

# ============================================
# STEP 1: Git + GitHub
# ============================================
echo -e "${BLUE}📦 Step 1: Git & GitHub${NC}"

if [ ! -d ".git" ]; then
  git init
  echo -e "${GREEN}✅ Git initialized${NC}"
else
  echo "ℹ️  Git already initialized"
fi

git add -A
git commit -m "Initial commit: WebnWell Roadmap Dashboard — 4 interactive roadmaps with glassmorphism UI" 2>/dev/null || echo "ℹ️  Nothing new to commit"

# Create GitHub repo
if ! gh repo view Monzurulcom/roadmap &>/dev/null 2>&1; then
  gh repo create Monzurulcom/roadmap --public --source=. --remote=origin --push
  echo -e "${GREEN}✅ GitHub repo created and code pushed${NC}"
else
  echo "ℹ️  GitHub repo already exists"
  git remote add origin https://github.com/Monzurulcom/roadmap.git 2>/dev/null || true
  git branch -M main
  git push -u origin main 2>/dev/null || git push origin main
  echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
fi

echo ""

# ============================================
# STEP 2: Make scripts executable
# ============================================
chmod +x deploy.sh setup.sh
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

# ============================================
# STEP 3: LaunchAgent (auto-start on boot)
# ============================================
echo -e "${BLUE}🔧 Step 2: LaunchAgent (auto-start on boot)${NC}"

NODE_PATH=$(which node)
PLIST_PATH="$HOME/Library/LaunchAgents/com.webnwell.roadmap-server.plist"

mkdir -p "$HOME/Library/LaunchAgents"

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.webnwell.roadmap-server</string>
    <key>ProgramArguments</key>
    <array>
        <string>${NODE_PATH}</string>
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
EOF

echo -e "${GREEN}✅ LaunchAgent created at ${PLIST_PATH}${NC}"

# Load the agent (stop if already running, then start)
launchctl bootout gui/$(id -u) "$PLIST_PATH" 2>/dev/null || true
sleep 1
launchctl bootstrap gui/$(id -u) "$PLIST_PATH"
echo -e "${GREEN}✅ LaunchAgent loaded — server will auto-start on boot${NC}"

# Verify server is running
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4060 | grep -q "200"; then
  echo -e "${GREEN}✅ Server is responding at http://localhost:4060${NC}"
else
  echo -e "${YELLOW}⚠️  Server may still be starting... check: tail -f /tmp/roadmap-server.log${NC}"
fi

echo ""

# ============================================
# STEP 4: Cloudflare Tunnel — Add Roadmap Route
# ============================================
echo -e "${BLUE}🌐 Step 3: Cloudflare Tunnel Setup${NC}"

TUNNEL_CONFIG="/etc/cloudflared/config.yml"

# Check if roadmap route already exists
if grep -q "roadmap.webnwell.com" "$TUNNEL_CONFIG" 2>/dev/null; then
  echo "ℹ️  Roadmap route already in tunnel config"
else
  echo "Adding roadmap.webnwell.com → localhost:4060 to tunnel config..."
  
  # Insert the new hostname before the catch-all rule
  sudo sed -i '' '/^  - service: http_status:404/i\
  - hostname: roadmap.webnwell.com\
    service: http://localhost:4060' "$TUNNEL_CONFIG"
  
  echo -e "${GREEN}✅ Route added to ${TUNNEL_CONFIG}${NC}"
fi

echo ""
echo "Current tunnel config:"
cat "$TUNNEL_CONFIG"
echo ""

# Restart the cloudflare tunnel
echo "Restarting Cloudflare tunnel..."
if npx pm2 list 2>/dev/null | grep -q "cloudflare-tunnel"; then
  npx pm2 restart cloudflare-tunnel
  npx pm2 save
  echo -e "${GREEN}✅ Tunnel restarted via PM2${NC}"
elif launchctl list 2>/dev/null | grep -q "cloudflared"; then
  sudo launchctl kickstart -k system/com.cloudflare.cloudflared
  echo -e "${GREEN}✅ Tunnel restarted via LaunchAgent${NC}"
else
  echo -e "${YELLOW}⚠️  Could not find tunnel process. Try manually:${NC}"
  echo "   npx pm2 restart cloudflare-tunnel"
  echo "   OR: sudo cloudflared service restart"
fi

echo ""

# ============================================
# STEP 5: Add DNS Record (if needed)
# ============================================
echo -e "${BLUE}🌍 Step 4: DNS Check${NC}"
echo "Checking if roadmap.webnwell.com DNS is configured..."

DNS_RESULT=$(dig +short roadmap.webnwell.com 2>/dev/null || echo "")
if [ -n "$DNS_RESULT" ]; then
  echo -e "${GREEN}✅ DNS already configured: ${DNS_RESULT}${NC}"
else
  echo -e "${YELLOW}ℹ️  DNS record may need to be added.${NC}"
  echo ""
  echo "  If other subdomains (app, mgt, docs, meeting) work via the tunnel,"
  echo "  the DNS CNAME is likely a wildcard (*.webnwell.com) or will be"
  echo "  auto-created by Cloudflare when using 'Public Hostname' in dashboard."
  echo ""
  echo "  If needed, add this DNS record in Cloudflare:"
  echo "    Type: CNAME"
  echo "    Name: roadmap"
  echo "    Target: 9309ecbc-dfb0-4ae7-ba44-ef6d5e21df12.cfargotunnel.com"
  echo "    Proxy: ON (orange cloud)"
fi

echo ""

# ============================================
# FINAL VERIFICATION
# ============================================
echo "=========================================="
echo -e "  ${GREEN}✅ Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "  📍 Local:    http://localhost:4060"
echo "  🌐 Live:     https://roadmap.webnwell.com"
echo "  📦 GitHub:   https://github.com/Monzurulcom/roadmap"
echo "  📋 Logs:     tail -f /tmp/roadmap-server.log"
echo "  🔄 Auto-start: YES (LaunchAgent on boot)"
echo ""
echo "  To verify live site (may take 1-2 min for tunnel):"
echo "    curl -I https://roadmap.webnwell.com"
echo ""
