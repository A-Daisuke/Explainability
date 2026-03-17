const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: gdjsRootPath,
    cleanUrls: false,
    headers: [
      {
        source: '**/*',
        headers: [
          // Tell the browser not to cache the files:
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
          // Allow CORS because the web-app is served from a different origin:
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Private-Network',
            value: 'true',
          },
        ],
      },
    ],
  });
});
