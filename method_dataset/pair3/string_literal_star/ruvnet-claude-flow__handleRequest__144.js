class __C__ {
  handleRequest(req, res) {
    const url = req.url;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Route handling
    if (url === '/' || url === '/console' || url === '/console/') {
      this.serveConsoleHTML(res);
    } else if (url.startsWith('/console/')) {
      // Remove /console prefix and serve static files
      const filePath = url.substring('/console/'.length);
      this.serveStaticFile(res, filePath);
    } else if (url === '/health') {
      this.handleHealthCheck(res);
    } else if (url === '/api/status') {
      this.handleStatusAPI(res);
    } else if (url === '/favicon.ico') {
      this.handleFavicon(res);
    } else {
      this.handle404(res);
    }
  }

}
