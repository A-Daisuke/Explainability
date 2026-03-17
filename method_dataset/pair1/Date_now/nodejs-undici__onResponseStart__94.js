class __C__ {
  onResponseStart (
    controller,
    statusCode,
    resHeaders,
    statusMessage
  ) {
    const downstreamOnHeaders = () =>
      this.#handler.onResponseStart?.(
        controller,
        statusCode,
        resHeaders,
        statusMessage
      )
    const handler = this

    if (
      !util.safeHTTPMethods.includes(this.#cacheKey.method) &&
      statusCode >= 200 &&
      statusCode <= 399
    ) {
      // Successful response to an unsafe method, delete it from cache
      //  https://www.rfc-editor.org/rfc/rfc9111.html#name-invalidating-stored-response
      try {
        this.#store.delete(this.#cacheKey)?.catch?.(noop)
      } catch {
        // Fail silently
      }
      return downstreamOnHeaders()
    }

    const cacheControlHeader = resHeaders['cache-control']
    const heuristicallyCacheable = resHeaders['last-modified'] && HEURISTICALLY_CACHEABLE_STATUS_CODES.includes(statusCode)
    if (
      !cacheControlHeader &&
      !resHeaders['expires'] &&
      !heuristicallyCacheable &&
      !this.#cacheByDefault
    ) {
      // Don't have anything to tell us this response is cachable and we're not
      //  caching by default
      return downstreamOnHeaders()
    }

    const cacheControlDirectives = cacheControlHeader ? parseCacheControlHeader(cacheControlHeader) : {}
    if (!canCacheResponse(this.#cacheType, statusCode, resHeaders, cacheControlDirectives)) {
      return downstreamOnHeaders()
    }

    const now = Date.now()
    const resAge = resHeaders.age ? getAge(resHeaders.age) : undefined
    if (resAge && resAge >= MAX_RESPONSE_AGE) {
      // Response considered stale
      return downstreamOnHeaders()
    }

    const resDate = typeof resHeaders.date === 'string'
      ? parseHttpDate(resHeaders.date)
      : undefined

    const staleAt =
      determineStaleAt(this.#cacheType, now, resAge, resHeaders, resDate, cacheControlDirectives) ??
      this.#cacheByDefault
    if (staleAt === undefined || (resAge && resAge > staleAt)) {
      return downstreamOnHeaders()
    }

    const baseTime = resDate ? resDate.getTime() : now
    const absoluteStaleAt = staleAt + baseTime
    if (now >= absoluteStaleAt) {
      // Response is already stale
      return downstreamOnHeaders()
    }

    let varyDirectives
    if (this.#cacheKey.headers && resHeaders.vary) {
      varyDirectives = parseVaryHeader(resHeaders.vary, this.#cacheKey.headers)
      if (!varyDirectives) {
        // Parse error
        return downstreamOnHeaders()
      }
    }

    const deleteAt = determineDeleteAt(baseTime, cacheControlDirectives, absoluteStaleAt)
    const strippedHeaders = stripNecessaryHeaders(resHeaders, cacheControlDirectives)

    /**
     * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
     */
    const value = {
      statusCode,
      statusMessage,
      headers: strippedHeaders,
      vary: varyDirectives,
      cacheControlDirectives,
      cachedAt: resAge ? now - resAge : now,
      staleAt: absoluteStaleAt,
      deleteAt
    }

    // Not modified, re-use the cached value
    // https://www.rfc-editor.org/rfc/rfc9111.html#name-handling-304-not-modified
    if (statusCode === 304) {
      /**
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
       */
      const cachedValue = this.#store.get(this.#cacheKey)
      if (!cachedValue) {
        // Do not create a new cache entry, as a 304 won't have a body - so cannot be cached.
        return downstreamOnHeaders()
      }

      // Re-use the cached value: statuscode, statusmessage, headers and body
      value.statusCode = cachedValue.statusCode
      value.statusMessage = cachedValue.statusMessage
      value.etag = cachedValue.etag
      value.headers = { ...cachedValue.headers, ...strippedHeaders }

      downstreamOnHeaders()

      this.#writeStream = this.#store.createWriteStream(this.#cacheKey, value)

      if (!this.#writeStream || !cachedValue?.body) {
        return
      }

      const bodyIterator = cachedValue.body.values()

      const streamCachedBody = () => {
        for (const chunk of bodyIterator) {
          const full = this.#writeStream.write(chunk) === false
          this.#handler.onResponseData?.(controller, chunk)
          // when stream is full stop writing until we get a 'drain' event
          if (full) {
            break
          }
        }
      }

      this.#writeStream
        .on('error', function () {
          handler.#writeStream = undefined
          handler.#store.delete(handler.#cacheKey)
        })
        .on('drain', () => {
          streamCachedBody()
        })
        .on('close', function () {
          if (handler.#writeStream === this) {
            handler.#writeStream = undefined
          }
        })

      streamCachedBody()
    } else {
      if (typeof resHeaders.etag === 'string' && isEtagUsable(resHeaders.etag)) {
        value.etag = resHeaders.etag
      }

      this.#writeStream = this.#store.createWriteStream(this.#cacheKey, value)

      if (!this.#writeStream) {
        return downstreamOnHeaders()
      }

      this.#writeStream
        .on('drain', () => controller.resume())
        .on('error', function () {
          // TODO (fix): Make error somehow observable?
          handler.#writeStream = undefined

          // Delete the value in case the cache store is holding onto state from
          //  the call to createWriteStream
          handler.#store.delete(handler.#cacheKey)
        })
        .on('close', function () {
          if (handler.#writeStream === this) {
            handler.#writeStream = undefined
          }

          // TODO (fix): Should we resume even if was paused downstream?
          controller.resume()
        })

      downstreamOnHeaders()
    }
  }

}
