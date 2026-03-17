  const processResponseEndOfBody = () => {
    // 1. Let unsafeEndTime be the unsafe shared current time.
    const unsafeEndTime = Date.now() // ?

    // 2. If fetchParams’s request’s destination is "document", then set fetchParams’s controller’s
    //    full timing info to fetchParams’s timing info.
    if (fetchParams.request.destination === 'document') {
      fetchParams.controller.fullTimingInfo = timingInfo
    }

    // 3. Set fetchParams’s controller’s report timing steps to the following steps given a global object global:
    fetchParams.controller.reportTimingSteps = () => {
      // 1. If fetchParams’s request’s URL’s scheme is not an HTTP(S) scheme, then return.
      if (!urlIsHttpHttpsScheme(fetchParams.request.url)) {
        return
      }

      // 2. Set timingInfo’s end time to the relative high resolution time given unsafeEndTime and global.
      timingInfo.endTime = unsafeEndTime

      // 3. Let cacheState be response’s cache state.
      let cacheState = response.cacheState

      // 4. Let bodyInfo be response’s body info.
      const bodyInfo = response.bodyInfo

      // 5. If response’s timing allow passed flag is not set, then set timingInfo to the result of creating an
      //    opaque timing info for timingInfo and set cacheState to the empty string.
      if (!response.timingAllowPassed) {
        timingInfo = createOpaqueTimingInfo(timingInfo)

        cacheState = ''
      }

      // 6. Let responseStatus be 0.
      let responseStatus = 0

      // 7. If fetchParams’s request’s mode is not "navigate" or response’s has-cross-origin-redirects is false:
      if (fetchParams.request.mode !== 'navigator' || !response.hasCrossOriginRedirects) {
        // 1. Set responseStatus to response’s status.
        responseStatus = response.status

        // 2. Let mimeType be the result of extracting a MIME type from response’s header list.
        const mimeType = extractMimeType(response.headersList)

        // 3. If mimeType is not failure, then set bodyInfo’s content type to the result of minimizing a supported MIME type given mimeType.
        if (mimeType !== 'failure') {
          bodyInfo.contentType = minimizeSupportedMimeType(mimeType)
        }
      }

      // 8. If fetchParams’s request’s initiator type is non-null, then mark resource timing given timingInfo,
      //    fetchParams’s request’s URL, fetchParams’s request’s initiator type, global, cacheState, bodyInfo,
      //    and responseStatus.
      if (fetchParams.request.initiatorType != null) {
        markResourceTiming(timingInfo, fetchParams.request.url.href, fetchParams.request.initiatorType, globalThis, cacheState, bodyInfo, responseStatus)
      }
    }

    // 4. Let processResponseEndOfBodyTask be the following steps:
    const processResponseEndOfBodyTask = () => {
      // 1. Set fetchParams’s request’s done flag.
      fetchParams.request.done = true

      // 2. If fetchParams’s process response end-of-body is non-null, then run fetchParams’s process
      //    response end-of-body given response.
      if (fetchParams.processResponseEndOfBody != null) {
        queueMicrotask(() => fetchParams.processResponseEndOfBody(response))
      }

      // 3. If fetchParams’s request’s initiator type is non-null and fetchParams’s request’s client’s
      //    global object is fetchParams’s task destination, then run fetchParams’s controller’s report
      //    timing steps given fetchParams’s request’s client’s global object.
      if (fetchParams.request.initiatorType != null) {
        fetchParams.controller.reportTimingSteps()
      }
    }

    // 5. Queue a fetch task to run processResponseEndOfBodyTask with fetchParams’s task destination
    queueMicrotask(() => processResponseEndOfBodyTask())
  }
