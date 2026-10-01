const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Create proxy instance
const proxy = httpProxy.createProxyServer({});

// Map of service routes to backend containers and their prefixes
const services = {
  '/api/restaurants': { target: 'http://restaurant-container:8001', prefix: '/api/restaurants', rewrite: true },
  '/api/orders': { target: 'http://order-container:8002', prefix: '/api/orders', rewrite: true },
  '/api/delivery': { target: 'http://delivery-container:8003', prefix: '/api/delivery', rewrite: true },
  '/auth': { target: 'http://auth-container:8004', rewrite: false },
};

// Route map for frontend pages
const routes = {
  '/': 'index.html',
  '/login': 'login.html',
  '/customer': 'customer_dashboard.html',
  '/admin': 'admin_dashboard.html',
  '/delivery': 'delivery_dashboard.html',
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Log incoming request
  console.log(`➡️ ${req.method} ${req.url}`);

  // Proxy API and auth requests
  for (const route in services) {
    if (pathname.startsWith(route)) {
      const service = services[route];
      if (service.rewrite !== false) {
        req.url = req.url.replace(service.prefix, '') || '/';
      }
      console.log(`🔁 Proxying to ${service.target}${req.url}`);
      proxy.web(req, res, { target: service.target }, (err) => {
        console.error(`❌ Proxy error: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      });
      return;
    }
  }

  // Serve mapped frontend routes
  if (routes[pathname]) {
    const filePath = path.join(__dirname, 'static', routes[pathname]);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading page.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  // Serve static assets (CSS, JS, images)
  const staticFilePath = path.join(__dirname, 'static', pathname);
  fs.readFile(staticFilePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("File not found");
    } else {
      const ext = path.extname(pathname).toLowerCase();
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Start the server
server.listen(8080, () => {
  console.log("🚀 Gateway server running at http://localhost:8080");
});
