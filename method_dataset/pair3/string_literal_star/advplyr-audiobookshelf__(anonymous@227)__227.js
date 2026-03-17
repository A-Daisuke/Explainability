function __method_wrapper__() {
    app.use((req, res, next) => {
      if (!global.ServerSettings.allowIframe) {
        // Prevent clickjacking by disallowing iframes
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'")
      }

      // Security: Prevent referrer leakage to protect against token exposure
      // Using 'no-referrer' to completely prevent token leakage in referer headers
      res.setHeader('Referrer-Policy', 'no-referrer')

      /**
       * @temporary
       * This is necessary for the ebook & cover API endpoint in the mobile apps
       * The mobile app ereader is using fetch api in Capacitor that is currently difficult to switch to native requests
       * so we have to allow cors for specific origins to the /api/items/:id/ebook endpoint
       * The cover image is fetched with XMLHttpRequest in the mobile apps to load into a canvas and extract colors
       * @see https://ionicframework.com/docs/troubleshooting/cors
       *
       * Running in development allows cors to allow testing the mobile apps in the browser
       * or env variable ALLOW_CORS = '1'
       */
      if (global.AllowCors || Logger.isDev || req.path.match(/\/api\/items\/([a-z0-9-]{36})\/(ebook|cover)(\/[0-9]+)?/) || global.ServerSettings.allowedOrigins?.length) {
        const allowedOrigins = ['capacitor://localhost', 'http://localhost', ...(global.ServerSettings.allowedOrigins ? global.ServerSettings.allowedOrigins : [])]
        if (global.AllowCors || Logger.isDev || allowedOrigins.some((o) => o === req.get('origin'))) {
          res.header('Access-Control-Allow-Origin', req.get('origin'))
          res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
          res.header('Access-Control-Allow-Headers', '*')
          res.header('Access-Control-Allow-Credentials', true)
          if (req.method === 'OPTIONS') {
            return res.sendStatus(200)
          }
        }
      }

      next()
    })

}
