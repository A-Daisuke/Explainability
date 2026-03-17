function isStale (result, cacheControlDirectives) {
  const now = Date.now()
  if (now > result.staleAt) {
    // Response is stale
    if (cacheControlDirectives?.['max-stale']) {
      // There's a threshold where we can serve stale responses, let's see if
      //  we're in it
      // https://www.rfc-editor.org/rfc/rfc9111.html#name-max-stale
      const gracePeriod = result.staleAt + (cacheControlDirectives['max-stale'] * 1000)
      return now > gracePeriod
    }

    return true
  }

  if (cacheControlDirectives?.['min-fresh']) {
    // https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.1.3

    // At this point, staleAt is always > now
    const timeLeftTillStale = result.staleAt - now
    const threshold = cacheControlDirectives['min-fresh'] * 1000

    return timeLeftTillStale <= threshold
  }

  return false
}
