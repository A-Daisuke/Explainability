function __method_wrapper__() {
  async start() {
    Logger.info('=== Starting Server ===')

    this.initProcessEventListeners()
    await this.init()

    const app = express()

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

    // parse cookies in requests
    app.use(cookieParser())
    // enable express-session
    app.use(
      expressSession({
        secret: this.auth.tokenManager.TokenSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          // also send the cookie if were are not on https (not every use has https)
          secure: false
        },
        store: new MemoryStore(86400000, 86400000, 1000)
      })
    )
    // init passport.js
    app.use(passport.initialize())
    // register passport in express-session
    app.use(this.auth.ifAuthNeeded(passport.session()))
    // config passport.js
    await this.auth.initPassportJs()

    const router = express.Router()

    // if RouterBasePath is set, modify all requests to include the base path
    app.use((req, res, next) => {
      const urlStartsWithRouterBasePath = req.url.startsWith(global.RouterBasePath)
      const host = req.get('host')
      const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http'
      const prefix = urlStartsWithRouterBasePath ? global.RouterBasePath : ''
      req.originalHostPrefix = `${protocol}://${host}${prefix}`
      if (!urlStartsWithRouterBasePath) {
        req.url = `${global.RouterBasePath}${req.url}`
      }
      next()
    })
    app.use(global.RouterBasePath, router)
    app.disable('x-powered-by')

    this.server = http.createServer(app)

    router.use(
      fileUpload({
        defCharset: 'utf8',
        defParamCharset: 'utf8',
        useTempFiles: true,
        tempFileDir: Path.join(global.MetadataPath, 'tmp')
      })
    )
    router.use(express.urlencoded({ extended: true, limit: '5mb' }))

    // Skip JSON parsing for internal-api routes
    router.use(/^(?!\/internal-api).*/, express.json({ limit: '10mb' }))

    router.use('/api', this.auth.ifAuthNeeded(this.authMiddleware.bind(this)), this.apiRouter.router)
    router.use('/hls', this.hlsRouter.router)
    router.use('/public', this.publicRouter.router)

    // Static folder
    router.use(express.static(Path.join(global.appRoot, 'static')))

    // RSS Feed temp route
    router.get('/feed/:slug', (req, res) => {
      Logger.info(`[Server] Requesting rss feed ${req.params.slug}`)
      RssFeedManager.getFeed(req, res)
    })
    router.get('/feed/:slug/cover*', (req, res) => {
      RssFeedManager.getFeedCover(req, res)
    })
    router.get('/feed/:slug/item/:episodeId/*', (req, res) => {
      Logger.debug(`[Server] Requesting rss feed episode ${req.params.slug}/${req.params.episodeId}`)
      RssFeedManager.getFeedItem(req, res)
    })

    // Auth routes
    await this.auth.initAuthRoutes(router)

    router.post('/init', (req, res) => {
      if (Database.hasRootUser) {
        Logger.error(`[Server] attempt to init server when server already has a root user`)
        return res.sendStatus(500)
      }
      this.initializeServer(req, res)
    })
    router.get('/status', (req, res) => {
      // status check for client to see if server has been initialized
      // server has been initialized if a root user exists
      const payload = {
        app: 'audiobookshelf',
        serverVersion: version,
        isInit: Database.hasRootUser,
        language: Database.serverSettings.language,
        authMethods: Database.serverSettings.authActiveAuthMethods,
        authFormData: Database.serverSettings.authFormData
      }
      if (!payload.isInit) {
        payload.ConfigPath = global.ConfigPath
        payload.MetadataPath = global.MetadataPath
      }
      res.json(payload)
    })
    router.get('/ping', (req, res) => {
      Logger.info('Received ping')
      res.json({ success: true })
    })
    router.get('/healthcheck', (req, res) => res.sendStatus(200))

    const ReactClientPath = process.env.REACT_CLIENT_PATH
    if (!ReactClientPath) {
      // Static path to generated nuxt
      const distPath = Path.join(global.appRoot, '/client/dist')
      router.use(express.static(distPath))

      // Client dynamic routes
      const dynamicRoutes = [
        '/item/:id',
        '/author/:id',
        '/audiobook/:id/chapters',
        '/audiobook/:id/edit',
        '/audiobook/:id/manage',
        '/library/:library',
        '/library/:library/search',
        '/library/:library/bookshelf/:id?',
        '/library/:library/authors',
        '/library/:library/narrators',
        '/library/:library/stats',
        '/library/:library/series/:id?',
        '/library/:library/podcast/search',
        '/library/:library/podcast/latest',
        '/library/:library/podcast/download-queue',
        '/config/users/:id',
        '/config/users/:id/sessions',
        '/config/item-metadata-utils/:id',
        '/collection/:id',
        '/playlist/:id',
        '/share/:slug'
      ]
      dynamicRoutes.forEach((route) => router.get(route, (req, res) => res.sendFile(Path.join(distPath, 'index.html'))))
    } else {
      // This is for using the experimental Next.js client
      Logger.info(`Using React client at ${ReactClientPath}`)
      const nextPath = Path.join(ReactClientPath, 'node_modules/next')
      const next = require(nextPath)
      const nextApp = next({ dev: Logger.isDev, dir: ReactClientPath })
      const handle = nextApp.getRequestHandler()
      await nextApp.prepare()
      router.all('*', (req, res) => handle(req, res))
    }

    const unixSocketPrefix = 'unix/'
    if (this.Host?.startsWith(unixSocketPrefix)) {
      const sockPath = this.Host.slice(unixSocketPrefix.length)
      this.server.listen(sockPath, async () => {
        await fs.chmod(sockPath, 0o666)
        Logger.info(`Listening on unix socket ${sockPath}`)
      })
    } else {
      this.server.listen(this.Port, this.Host, () => {
        if (this.Host) Logger.info(`Listening on http://${is.ipv6(this.Host) ? `[${this.Host}]` : this.Host}:${this.Port}`)
        else Logger.info(`Listening on port :${this.Port}`)
      })
    }

    // Start listening for socket connections
    SocketAuthority.initialize(this)
  }

}
