function canCacheResponse (cacheType, statusCode, resHeaders, cacheControlDirectives) {
  // Status code must be final and understood.
  if (statusCode < 200 || NOT_UNDERSTOOD_STATUS_CODES.includes(statusCode)) {
    return false
  }
  // Responses with neither status codes that are heuristically cacheable, nor "explicit enough" caching
  // directives, are not cacheable. "Explicit enough": see https://www.rfc-editor.org/rfc/rfc9111.html#section-3
  if (!HEURISTICALLY_CACHEABLE_STATUS_CODES.includes(statusCode) && !resHeaders['expires'] &&
    !cacheControlDirectives.public &&
    cacheControlDirectives['max-age'] === undefined &&
    // RFC 9111: a private response directive, if the cache is not shared
    !(cacheControlDirectives.private && cacheType === 'private') &&
    !(cacheControlDirectives['s-maxage'] !== undefined && cacheType === 'shared')
  ) {
    return false
  }

  if (cacheControlDirectives['no-store']) {
    return false
  }

  if (cacheType === 'shared' && cacheControlDirectives.private === true) {
    return false
  }

  // https://www.rfc-editor.org/rfc/rfc9111.html#section-4.1-5
  if (resHeaders.vary?.includes('*')) {
    return false
  }

  // https://www.rfc-editor.org/rfc/rfc9111.html#name-storing-responses-to-authen
  if (resHeaders.authorization) {
    if (!cacheControlDirectives.public || typeof resHeaders.authorization !== 'string') {
      return false
    }

    if (
      Array.isArray(cacheControlDirectives['no-cache']) &&
      cacheControlDirectives['no-cache'].includes('authorization')
    ) {
      return false
    }

    if (
      Array.isArray(cacheControlDirectives['private']) &&
      cacheControlDirectives['private'].includes('authorization')
    ) {
      return false
    }
  }

  return true
}
