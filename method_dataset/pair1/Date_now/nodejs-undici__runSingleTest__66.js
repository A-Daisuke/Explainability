function runSingleTest (url, options, expectation, timeout = 10000) {
  const startTime = Date.now()
  const { promise, resolve, reject } = createDeferredPromise()

  const proc = spawn('node', [
    '--expose-gc',
    '--no-warnings',
    join(import.meta.dirname, 'runner/test-runner.mjs'),
    url.toString()
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NO_COLOR: '1'
    }
  })

  const cases = []
  let harnessStatus = null
  let stdoutOutput = ''
  let stderrOutput = ''
  let error

  const timer = setTimeout(() => {
    if (!proc.killed) {
      proc.kill('SIGINT')
    }
  }, timeout)

  proc.stdout.setEncoding('utf-8')
  proc.stdout.on('data', (chunk) => {
    stdoutOutput += chunk

    let delimiterIndex
    while ((delimiterIndex = stdoutOutput.indexOf('#$#$#')) !== -1) {
      const endIndex = stdoutOutput.indexOf('\n', delimiterIndex)
      if (endIndex !== -1) {
        const message = stdoutOutput.slice(delimiterIndex + 5, endIndex)
        try {
          const { tests, harnessStatus: _harnessStatus } = JSON.parse(message)
          harnessStatus = _harnessStatus
          cases.push(...tests)
        } catch (e) {
          console.error('Failed to parse:', message)
        }
        stdoutOutput = stdoutOutput.slice(endIndex + 1)
      } else {
        break // Wait for more data
      }
    }
  })

  proc.stderr.setEncoding('utf-8')
  proc.stderr.on('data', (chunk) => {
    stderrOutput += chunk

    let delimiterIndex
    while ((delimiterIndex = stderrOutput.indexOf('!#!#!#')) !== -1) {
      const endIndex = stderrOutput.indexOf('\n', delimiterIndex)
      if (endIndex !== -1) {
        const message = stderrOutput.slice(delimiterIndex + 6, endIndex)
        ;({ error } = JSON.parse(message))
        stderrOutput = stderrOutput.slice(endIndex + 1)
      } else {
        break // Wait for more data
      }
    }
  })

  proc.once('exit', () => {
    clearTimeout(timer)
    const duration = Date.now() - startTime

    resolve({
      status: harnessStatus?.status ?? 1,
      harnessStatus,
      duration,
      cases,
      error
    })
  })

  proc.once('error', (err) => reject(err))

  return promise
}
