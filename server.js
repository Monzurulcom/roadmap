const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 4060;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'roadmap-data.json');

// --- Auth config ---
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'WebnWell@2026!';
const tokens = new Set(); // active session tokens

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
};

// --- Helpers ---
function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

function getToken(req) {
  const auth = req.headers['authorization'] || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

function isAuthed(req) {
  const token = getToken(req);
  return token && tokens.has(token);
}

function loadRoadmapData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  return null; // will fall back to default data.js on frontend
}

function saveRoadmapData(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Server ---
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // CORS headers (for dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // --- API Routes ---

  // Health check
  if (url.pathname === '/api/health') {
    return json(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  // Login
  if (url.pathname === '/api/login' && method === 'POST') {
    try {
      const { username, password } = await readBody(req);
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = crypto.randomBytes(32).toString('hex');
        tokens.add(token);
        return json(res, 200, { success: true, token });
      }
      return json(res, 401, { success: false, error: 'Invalid credentials' });
    } catch (e) {
      return json(res, 400, { success: false, error: 'Bad request' });
    }
  }

  // Check auth status
  if (url.pathname === '/api/auth' && method === 'GET') {
    return json(res, 200, { authenticated: isAuthed(req) });
  }

  // Logout
  if (url.pathname === '/api/logout' && method === 'POST') {
    const token = getToken(req);
    if (token) tokens.delete(token);
    return json(res, 200, { success: true });
  }

  // Get roadmap data
  if (url.pathname === '/api/data' && method === 'GET') {
    const data = loadRoadmapData();
    return json(res, 200, { data }); // null = use default
  }

  // Save roadmap data (auth required)
  if (url.pathname === '/api/data' && method === 'PUT') {
    if (!isAuthed(req)) {
      return json(res, 401, { success: false, error: 'Not authenticated' });
    }
    try {
      const body = await readBody(req);
      saveRoadmapData(body);
      return json(res, 200, { success: true });
    } catch (e) {
      return json(res, 400, { success: false, error: 'Bad request' });
    }
  }

  // --- Static Files ---
  let filePath = path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname);

  // No-cache headers for dev files so changes show immediately
  const noCacheExts = ['.html', '.css', '.js'];

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': contentType };
    if (noCacheExts.includes(ext)) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
    }
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    fs.createReadStream(path.join(PUBLIC, 'index.html')).pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`WebnWell Roadmap running at http://localhost:${PORT}`);
});
