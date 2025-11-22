const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const SHARED_TASKS_FILE = path.join(__dirname, 'shared-tasks.json');

// Ensure shared tasks file exists
if (!fs.existsSync(SHARED_TASKS_FILE)) {
    fs.writeFileSync(SHARED_TASKS_FILE, JSON.stringify({}));
}

// Helper function to read shared tasks
function readSharedTasks() {
    try {
        const data = fs.readFileSync(SHARED_TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Helper function to write shared tasks
function writeSharedTasks(tasks) {
    fs.writeFileSync(SHARED_TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Helper function to generate share ID
function generateShareId() {
    return crypto.randomBytes(8).toString('hex');
}

// Parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // Handle OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // API Routes
    if (pathname === '/api/share' && req.method === 'POST') {
        // Create a shared task
        try {
            const task = await parseBody(req);
            const shareId = generateShareId();
            const sharedTasks = readSharedTasks();

            sharedTasks[shareId] = {
                task,
                createdAt: new Date().toISOString(),
                views: 0
            };

            writeSharedTasks(sharedTasks);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ shareId, url: `${req.headers.origin || 'http://localhost:3000'}?share=${shareId}` }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    } else if (pathname.startsWith('/api/share/') && req.method === 'GET') {
        // Get a shared task
        const shareId = pathname.split('/').pop();
        const sharedTasks = readSharedTasks();

        if (sharedTasks[shareId]) {
            // Increment view count
            sharedTasks[shareId].views++;
            writeSharedTasks(sharedTasks);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sharedTasks[shareId]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Share not found' }));
        }
    } else {
        // Serve static files
        let filePath = '.' + pathname;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('Server Error: ' + error.code, 'utf-8');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Sharing API available at /api/share');
});
