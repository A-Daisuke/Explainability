function handleResult (
  dispatch,
  globalOpts,
  cacheKey,
  handler,
  opts,
  reqCacheControl,
  result
) {
  if (!result) {
    return handleUncachedResponse(dispatch, globalOpts, cacheKey, handler, opts, reqCacheControl)
  }

  const now = Date.now()
  if (now > result.deleteAt) {
    // Response is expired, cache store shouldn't have given this to us
    return dispatch(opts, new CacheHandler(globalOpts, cacheKey, handler))
  }

  const age = Math.round((now - result.cachedAt) / 1000)
  if (reqCacheControl?.['max-age'] && age >= reqCacheControl['max-age']) {
    // Response is considered expired for this specific request
    //  https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.1.1
    return dispatch(opts, handler)
  }

  const stale = isStale(result, reqCacheControl)
  const revalidate = needsRevalidation(result, reqCacheControl, opts)

  // Check if the response is stale
  if (stale || revalidate) {
    if (util.isStream(opts.body) && util.bodyLength(opts.body) !== 0) {
      // If body is a stream we can't revalidate...
      // TODO (fix): This could be less strict...
      return dispatch(opts, new CacheHandler(globalOpts, cacheKey, handler))
    }

    // RFC 5861: If we're within stale-while-revalidate window, serve stale immediately
    // and revalidate in background, unless immediate revalidation is necessary
    if (!revalidate && withinStaleWhileRevalidateWindow(result)) {
      // Serve stale response immediately
      sendCachedValue(handler, opts, result, age, null, true)

      // Start background revalidation (fire-and-forget)
      queueMicrotask(() => {
        let headers = {
          ...opts.headers,
          'if-modified-since': new Date(result.cachedAt).toUTCString()
        }

        if (result.etag) {
          headers['if-none-match'] = result.etag
        }

        if (result.vary) {
          headers = {
            ...headers,
            ...result.vary
          }
        }

        // Background revalidation - update cache if we get new data
        dispatch(
          {
            ...opts,
            headers
          },
          new CacheHandler(globalOpts, cacheKey, {
            // Silent handler that just updates the cache
            onRequestStart () {},
            onRequestUpgrade () {},
            onResponseStart () {},
            onResponseData () {},
            onResponseEnd () {},
            onResponseError () {}
          })
        )
      })

      return true
    }

    let withinStaleIfErrorThreshold = false
    const staleIfErrorExpiry = result.cacheControlDirectives['stale-if-error'] ?? reqCacheControl?.['stale-if-error']
    if (staleIfErrorExpiry) {
      withinStaleIfErrorThreshold = now < (result.staleAt + (staleIfErrorExpiry * 1000))
    }

    let headers = {
      ...opts.headers,
      'if-modified-since': new Date(result.cachedAt).toUTCString()
    }

    if (result.etag) {
      headers['if-none-match'] = result.etag
    }

    if (result.vary) {
      headers = {
        ...headers,
        ...result.vary
      }
    }

    // We need to revalidate the response
    return dispatch(
      {
        ...opts,
        headers
      },
      new CacheRevalidationHandler(
        (success, context) => {
          if (success) {
            // TODO: successful revalidation should be considered fresh (not give stale warning).
            sendCachedValue(handler, opts, result, age, context, stale)
          } else if (util.isStream(result.body)) {
            result.body.on('error', nop).destroy()
          }
        },
        new CacheHandler(globalOpts, cacheKey, handler),
        withinStaleIfErrorThreshold
      )
    )
  }

  // Dump request body.
  if (util.isStream(opts.body)) {
    opts.body.on('error', nop).destroy()
  }

  sendCachedValue(handler, opts, result, age, null, false)
}
