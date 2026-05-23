#!/bin/bash
# ============================================
# WebnWell Roadmap — Final Setup
# Adds roadmap.webnwell.com to Cloudflare tunnel
# and pushes code to GitHub
# ============================================
set -e

ACCOUNT_ID="0df6145b74a87007ba71033fc86cfd3e"
TUNNEL_ID="9309ecbc-dfb0-4ae7-ba44-ef6d5e21df12"
API_KEY="89d4ffc3da96ec1e25cd6be96350a47f8ae17"
EMAIL="smmonzurulhasan@gmail.com"

echo ""
echo "=========================================="
echo "  🗺️  WebnWell Roadmap — Final Setup"
echo "=========================================="
echo ""

# ---- Step 1: Add roadmap.webnwell.com to Cloudflare Tunnel ----
echo "🌐 Step 1: Adding roadmap.webnwell.com to Cloudflare Tunnel..."

# Get current tunnel configuration
CURRENT=$(curl -s "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/configurations" \
  -H "X-Auth-Key: ${API_KEY}" \
  -H "X-Auth-Email: ${EMAIL}" \
  -H "Content-Type: application/json")

if echo "$CURRENT" | grep -q '"success":false'; then
  echo "❌ API auth failed. Check credentials."
  echo "$CURRENT" | python3 -m json.tool 2>/dev/null || echo "$CURRENT"
  exit 1
fi

echo "✅ Got current tunnel config"

# Add roadmap route
UPDATED=$(echo "$CURRENT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
config = data.get('result', {}).get('config', {})
ingress = config.get('ingress', [])

# Check if roadmap already exists
for rule in ingress:
    if rule.get('hostname') == 'roadmap.webnwell.com':
        print('ALREADY_EXISTS')
        sys.exit(0)

# Add roadmap before the catch-all (last rule)
roadmap_rule = {
    'hostname': 'roadmap.webnwell.com',
    'service': 'http://localhost:4060'
}

# Insert before the catch-all rule
if ingress and not ingress[-1].get('hostname'):
    ingress.insert(-1, roadmap_rule)
else:
    ingress.append(roadmap_rule)

config['ingress'] = ingress
print(json.dumps({'config': config}))
")

if [ "$UPDATED" = "ALREADY_EXISTS" ]; then
  echo "✅ roadmap.webnwell.com route already exists!"
else
  RESULT=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/configurations" \
    -H "X-Auth-Key: ${API_KEY}" \
    -H "X-Auth-Email: ${EMAIL}" \
    -H "Content-Type: application/json" \
    -d "$UPDATED")

  if echo "$RESULT" | grep -q '"success":true'; then
    echo "✅ roadmap.webnwell.com route added successfully!"
  else
    echo "❌ Failed to add route:"
    echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"
    exit 1
  fi
fi

echo ""

# ---- Step 2: Add DNS CNAME record ----
echo "🌍 Step 2: Adding DNS CNAME record..."
/opt/homebrew/bin/cloudflared tunnel route dns ${TUNNEL_ID} roadmap.webnwell.com 2>/dev/null && echo "✅ DNS CNAME added" || echo "ℹ️  DNS CNAME may already exist"

echo ""

# ---- Step 3: Restart tunnel ----
echo "🔄 Step 3: Restarting Cloudflare tunnel..."
npx pm2 restart cloudflare-tunnel
npx pm2 save
echo "✅ Tunnel restarted"

echo ""

# ---- Step 4: Verify server is running ----
echo "🖥️  Step 4: Checking roadmap server..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4060 | grep -q "200"; then
  echo "✅ Server running on port 4060"
else
  echo "⚠️  Server not running. Starting it..."
  launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.webnwell.roadmap-server.plist 2>/dev/null || true
  sleep 1
  launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.webnwell.roadmap-server.plist 2>/dev/null || {
    echo "LaunchAgent failed. Starting via PM2..."
    npx pm2 start /Users/smmonzurulhasan/Desktop/roadmap/server.js --name roadmap-server
    npx pm2 save
  }
  sleep 2
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:4060 | grep -q "200"; then
    echo "✅ Server started on port 4060"
  else
    echo "⚠️  Check logs: tail -f /tmp/roadmap-server.log"
  fi
fi

echo ""

# ---- Step 5: Git + GitHub ----
echo "📦 Step 5: Pushing to GitHub..."

cd /Users/smmonzurulhasan/Desktop/roadmap

if [ ! -d ".git" ]; then
  git init
  echo "✅ Git initialized"
fi

git add -A
git commit -m "Initial commit: WebnWell Roadmap Dashboard — 4 interactive roadmaps with glassmorphism UI" 2>/dev/null || echo "ℹ️  Nothing new to commit"

if ! gh repo view Monzurulcom/roadmap &>/dev/null 2>&1; then
  gh repo create Monzurulcom/roadmap --public --source=. --remote=origin --push
  echo "✅ GitHub repo created and pushed"
else
  git remote add origin https://github.com/Monzurulcom/roadmap.git 2>/dev/null || true
  git branch -M main
  git push -u origin main 2>/dev/null || git push origin main
  echo "✅ Pushed to GitHub"
fi

echo ""

# ---- Step 6: Final verification ----
echo "🔍 Step 6: Verifying live site..."
sleep 5
LIVE_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://roadmap.webnwell.com)

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "  📍 Local:    http://localhost:4060"
echo "  🌐 Live:     https://roadmap.webnwell.com (HTTP $LIVE_CODE)"
echo "  📦 GitHub:   https://github.com/Monzurulcom/roadmap"
echo "  📋 Logs:     tail -f /tmp/roadmap-server.log"
echo "  🔄 Auto-start: LaunchAgent (on boot)"
echo ""
if [ "$LIVE_CODE" = "200" ]; then
  echo "  🎉 roadmap.webnwell.com is LIVE!"
else
  echo "  ⏳ May need 1-2 minutes for tunnel propagation."
  echo "     Retry: curl -I https://roadmap.webnwell.com"
fi
echo ""
