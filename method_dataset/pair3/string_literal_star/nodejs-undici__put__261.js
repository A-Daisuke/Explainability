class __C__ {
  async put (request, response) {
    webidl.brandCheck(this, Cache)

    const prefix = 'Cache.put'
    webidl.argumentLengthCheck(arguments, 2, prefix)

    request = webidl.converters.RequestInfo(request)
    response = webidl.converters.Response(response, prefix, 'response')

    // 1.
    let innerRequest = null

    // 2.
    if (webidl.is.Request(request)) {
      innerRequest = getRequestState(request)
    } else { // 3.
      innerRequest = getRequestState(new Request(request))
    }

    // 4.
    if (!urlIsHttpHttpsScheme(innerRequest.url) || innerRequest.method !== 'GET') {
      throw webidl.errors.exception({
        header: prefix,
        message: 'Expected an http/s scheme when method is not GET'
      })
    }

    // 5.
    const innerResponse = getResponseState(response)

    // 6.
    if (innerResponse.status === 206) {
      throw webidl.errors.exception({
        header: prefix,
        message: 'Got 206 status'
      })
    }

    // 7.
    if (innerResponse.headersList.contains('vary')) {
      // 7.1.
      const fieldValues = getFieldValues(innerResponse.headersList.get('vary'))

      // 7.2.
      for (const fieldValue of fieldValues) {
        // 7.2.1
        if (fieldValue === '*') {
          throw webidl.errors.exception({
            header: prefix,
            message: 'Got * vary field value'
          })
        }
      }
    }

    // 8.
    if (innerResponse.body && (isDisturbed(innerResponse.body.stream) || innerResponse.body.stream.locked)) {
      throw webidl.errors.exception({
        header: prefix,
        message: 'Response body is locked or disturbed'
      })
    }

    // 9.
    const clonedResponse = cloneResponse(innerResponse)

    // 10.
    const bodyReadPromise = createDeferredPromise()

    // 11.
    if (innerResponse.body != null) {
      // 11.1
      const stream = innerResponse.body.stream

      // 11.2
      const reader = stream.getReader()

      // 11.3
      readAllBytes(reader, bodyReadPromise.resolve, bodyReadPromise.reject)
    } else {
      bodyReadPromise.resolve(undefined)
    }

    // 12.
    /** @type {CacheBatchOperation[]} */
    const operations = []

    // 13.
    /** @type {CacheBatchOperation} */
    const operation = {
      type: 'put', // 14.
      request: innerRequest, // 15.
      response: clonedResponse // 16.
    }

    // 17.
    operations.push(operation)

    // 19.
    const bytes = await bodyReadPromise.promise

    if (clonedResponse.body != null) {
      clonedResponse.body.source = bytes
    }

    // 19.1
    const cacheJobPromise = createDeferredPromise()

    // 19.2.1
    let errorData = null

    // 19.2.2
    try {
      this.#batchCacheOperations(operations)
    } catch (e) {
      errorData = e
    }

    // 19.2.3
    queueMicrotask(() => {
      // 19.2.3.1
      if (errorData === null) {
        cacheJobPromise.resolve()
      } else { // 19.2.3.2
        cacheJobPromise.reject(errorData)
      }
    })

    return cacheJobPromise.promise
  }

}
