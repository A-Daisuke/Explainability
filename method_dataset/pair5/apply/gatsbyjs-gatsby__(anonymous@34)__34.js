function __method_wrapper__() {
  return function (...args): Promise<T> {
    let cb
    if (typeof args[args.length - 1] === `function`) {
      cb = args.pop()
    }

    // @ts-ignore - unsure if fixing this introduces problems
    const promise = fn.apply(this, args) // eslint-disable-line @babel/no-invalid-this

    if (typeof cb === `function`) {
      promise.then(
        value => setImmediate(cb, null, value),
        err => setImmediate(cb, err)
      )
    }

    return promise
  }

}
