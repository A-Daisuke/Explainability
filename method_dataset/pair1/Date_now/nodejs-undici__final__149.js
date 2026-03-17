function __method_wrapper__() {
      final (callback) {
        let entries = store.#entries.get(topLevelKey)
        if (!entries) {
          entries = []
          store.#entries.set(topLevelKey, entries)
        }
        const previousEntry = findEntry(key, entries, Date.now())
        if (previousEntry) {
          const index = entries.indexOf(previousEntry)
          entries.splice(index, 1, entry)
          store.#size -= previousEntry.size
        } else {
          entries.push(entry)
          store.#count += 1
        }

        store.#size += entry.size

        // Check if cache is full and emit event if needed
        if (store.#size > store.#maxSize || store.#count > store.#maxCount) {
          // Emit maxSizeExceeded event if we haven't already
          if (!store.#hasEmittedMaxSizeEvent) {
            store.emit('maxSizeExceeded', {
              size: store.#size,
              maxSize: store.#maxSize,
              count: store.#count,
              maxCount: store.#maxCount
            })
            store.#hasEmittedMaxSizeEvent = true
          }

          // Perform eviction
          for (const [key, entries] of store.#entries) {
            for (const entry of entries.splice(0, entries.length / 2)) {
              store.#size -= entry.size
              store.#count -= 1
            }
            if (entries.length === 0) {
              store.#entries.delete(key)
            }
          }

          // Reset the event flag after eviction
          if (store.#size < store.#maxSize && store.#count < store.#maxCount) {
            store.#hasEmittedMaxSizeEvent = false
          }
        }

        callback(null)
      }

}
