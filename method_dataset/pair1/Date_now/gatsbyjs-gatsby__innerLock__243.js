function innerLock(resolve, reject, filePath): void {
  try {
    let lockTime = globalGatsbyCacheLock.get(filePath) ?? 0
    if (lockTime > 0 && Date.now() - lockTime > 10 * 1000) {
      if (showLockTimeoutWarning) {
        showLockTimeoutWarning = false
        reporter.verbose(
          `Warning: lock file older than 10s, ignoring it... There is a possibility this leads to caching problems later. This warning will only be shown once.`
        )
      }
      lockTime = 0
      globalGatsbyCacheLock.delete(filePath)
    }

    if (lockTime > 0) {
      setTimeout(() => {
        innerLock(resolve, reject, filePath)
      }, 50)
    } else {
      // set sync
      globalGatsbyCacheLock.set(filePath, Date.now())
      resolve()
    }
  } catch (e) {
    reject(e)
  }
}
