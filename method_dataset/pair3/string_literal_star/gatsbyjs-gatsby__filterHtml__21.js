    const filterHtml = htmlStr => {
      const $ = cheerio.load(htmlStr)
      // There are many script tag differences
      $(`script`).remove()
      // Only added in production
      $(`style[data-identity="gatsby-global-css"]`).remove()
      // Only added in development
      $(`link[data-identity='gatsby-dev-css']`).remove()
      // Only in prod
      $(`link[rel="preload"]`).remove()
      // Only in prod
      $(`meta[name="generator"]`).remove()
      // Only in dev
      $(`meta[name="note"]`).remove()

      // remove any comments
      $.root()
        .find("*")
        .contents()
        .filter(function () {
          return this.type === "comment"
        })
        .remove()

      return $.html()
    }
