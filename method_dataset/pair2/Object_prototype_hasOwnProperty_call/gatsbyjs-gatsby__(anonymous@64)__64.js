function __method_wrapper__() {
  page.on(`requestfinished`, req => {
    if (req.url().match(/(socket\.io|commons\.js)/)) return

    logger.info(`load`, req.method(), req.url())

    if (req.method() === `GET` && req.resourceType() === `font`) {
      logger.debug(`match`, req.url())

      const { pathname } = new URL(page.url())

      if (!Object.prototype.hasOwnProperty.call(cache.assets, pathname)) {
        cache.assets[pathname] = Object.create(null)
      }

      const isSelfHosted = req.url().startsWith(devServer)

      const fontUrl = isSelfHosted
        ? req.url().slice(devServer.length)
        : req.url()

      cache.assets[pathname][fontUrl] = true

      bar.interrupt(green(ellipses(` found ${fontUrl}`, 80)))
    }
  })

}
