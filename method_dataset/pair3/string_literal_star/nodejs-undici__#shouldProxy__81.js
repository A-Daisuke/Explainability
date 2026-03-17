function __method_wrapper__() {
  #shouldProxy (hostname, port) {
    if (this.#noProxyChanged) {
      this.#parseNoProxy()
    }

    if (this.#noProxyEntries.length === 0) {
      return true // Always proxy if NO_PROXY is not set or empty.
    }
    if (this.#noProxyValue === '*') {
      return false // Never proxy if wildcard is set.
    }

    for (let i = 0; i < this.#noProxyEntries.length; i++) {
      const entry = this.#noProxyEntries[i]
      if (entry.port && entry.port !== port) {
        continue // Skip if ports don't match.
      }
      if (!/^[.*]/.test(entry.hostname)) {
        // No wildcards, so don't proxy only if there is not an exact match.
        if (hostname === entry.hostname) {
          return false
        }
      } else {
        // Don't proxy if the hostname ends with the no_proxy host.
        if (hostname.endsWith(entry.hostname.replace(/^\*/, ''))) {
          return false
        }
      }
    }

    return true
  }

}
