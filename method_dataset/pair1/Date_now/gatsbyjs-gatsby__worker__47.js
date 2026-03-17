async function worker([url, options]) {
  const tracer = opentracing.globalTracer()
  const httpSpan = tracer.startSpan(`http.get`, {
    childOf: options.parentSpan,
  })
  const parsedUrl = new URL(url)
  httpSpan.setTag(SemanticAttributes.HTTP_URL, url)
  httpSpan.setTag(SemanticAttributes.HTTP_HOST, parsedUrl.host)
  httpSpan.setTag(
    SemanticAttributes.HTTP_SCHEME,
    parsedUrl.protocol.replace(/:$/, ``)
  )
  httpSpan.setTag(SemanticAttributes.HTTP_TARGET, parsedUrl.pathname)
  httpSpan.setTag(`plugin`, `gatsby-source-drupal`)

  // Log out progress during the initial sourcing.
  if (initialSourcing) {
    apiRequestCount += 1
    if (!start) {
      start = Date.now()
    }
    const queueLength = requestQueue.length()
    if (apiRequestCount % 50 === 0) {
      globalReporter.verbose(
        `gatsby-source-drupal has ${queueLength} API requests queued and the current request rate is ${(
          apiRequestCount /
          ((Date.now() - start) / 1000)
        ).toFixed(2)} requests / second`
      )
    }
  }

  if (typeof options.searchParams === `object`) {
    url = new URL(url)
    const searchParams = new URLSearchParams(options.searchParams)
    const searchKeys = Array.from(searchParams.keys())
    searchKeys.forEach(searchKey => {
      // Only add search params to url if it has not already been
      // added.
      if (!url.searchParams.has(searchKey)) {
        url.searchParams.set(searchKey, searchParams.get(searchKey))
      }
    })
    url = url.toString()
  }
  delete options.searchParams

  const response = await got(url, {
    agent,
    cache: false,
    // request: http2wrapper.auto,
    // http2: true,
    ...options,
  })

  httpSpan.setTag(SemanticAttributes.HTTP_STATUS_CODE, response?.statusCode)
  httpSpan.setTag(SemanticAttributes.HTTP_METHOD, `GET`)
  httpSpan.setTag(SemanticAttributes.NET_PEER_IP, response?.ip)
  httpSpan.setTag(
    SemanticAttributes.HTTP_RESPONSE_CONTENT_LENGTH,
    response?.rawBody?.length
  )

  httpSpan.finish()

  return response
}
