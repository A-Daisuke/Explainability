function __method_wrapper__() {
  #findValue (key, canBeExpired = false) {
    const url = this.#makeValueUrl(key)
    const { headers, method } = key

    /**
     * @type {SqliteStoreValue[]}
     */
    const values = this.#getValuesQuery.all(url, method)

    if (values.length === 0) {
      return undefined
    }

    const now = Date.now()
    for (const value of values) {
      if (now >= value.deleteAt && !canBeExpired) {
        return undefined
      }

      let matches = true

      if (value.vary) {
        const vary = JSON.parse(value.vary)

        for (const header in vary) {
          if (!headerValueEquals(headers[header], vary[header])) {
            matches = false
            break
          }
        }
      }

      if (matches) {
        return value
      }
    }

    return undefined
  }

}
