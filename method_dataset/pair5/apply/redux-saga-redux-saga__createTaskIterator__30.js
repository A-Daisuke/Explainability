function createTaskIterator({ context, fn, args }) {
  // catch synchronous failures; see #152 and #441
  try {
    const result = fn.apply(context, args)

    // i.e. a generator function returns an iterator
    if (is.iterator(result)) {
      return result
    }

    let resolved = false

    const next = (arg) => {
      if (!resolved) {
        resolved = true
        // Only promises returned from fork will be interpreted. See #1573
        return { value: result, done: !is.promise(result) }
      } else {
        return { value: arg, done: true }
      }
    }

    return makeIterator(next)
  } catch (err) {
    // do not bubble up synchronous failures for detached forks
    // instead create a failed task. See #152 and #441
    return makeIterator(() => {
      throw err
    })
  }
}
