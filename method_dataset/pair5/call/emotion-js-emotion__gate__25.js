function __method_wrapper__() {
globalThis.gate = (flags, cb) => {
  const usedFlags = Object.keys(flags).filter(flags => !!flags[flags])

  for (const flag of Object.keys(flags)) {
    if (!hasOwn.call(defaultFlags, flag)) {
      throw new Error(`Invalid flag: ${flag}`)
    }
  }

  const allFlags = {
    ...defaultFlags,
    ...flags
  }

  return shouldRun(allFlags) ? cb({ test: t }) : cb({ test: t.skip })
}

}
