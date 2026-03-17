function __method_wrapper__() {
  get (key) {
    assertCacheKey(key)

    const topLevelKey = `${key.origin}:${key.path}`

    const now = Date.now()
    const entries = this.#entries.get(topLevelKey)

    const entry = entries ? findEntry(key, entries, now) : null

    return entry == null
      ? undefined
      : {
          statusMessage: entry.statusMessage,
          statusCode: entry.statusCode,
          headers: entry.headers,
          body: entry.body,
          vary: entry.vary ? entry.vary : undefined,
          etag: entry.etag,
          cacheControlDirectives: entry.cacheControlDirectives,
          cachedAt: entry.cachedAt,
          staleAt: entry.staleAt,
          deleteAt: entry.deleteAt
        }
  }

}
