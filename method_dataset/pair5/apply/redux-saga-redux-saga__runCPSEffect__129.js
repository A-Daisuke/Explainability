function runCPSEffect(env, { context, fn, args }, cb) {
  // CPS (ie node style functions) can define their own cancellation logic
  // by setting cancel field on the cb

  // catch synchronous failures; see #152
  try {
    const cpsCb = (err, res) => {
      if (is.undef(err)) {
        cb(res)
      } else {
        cb(err, true)
      }
    }

    fn.apply(context, args.concat(cpsCb))

    if (cpsCb.cancel) {
      cb.cancel = cpsCb.cancel
    }
  } catch (error) {
    cb(error, true)
  }
}
