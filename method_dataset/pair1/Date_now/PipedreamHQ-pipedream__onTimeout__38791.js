function onTimeout () {
  fastNow = Date.now()

  let len = fastTimers.length
  let idx = 0
  while (idx < len) {
    const timer = fastTimers[idx]

    if (timer.state === 0) {
      timer.state = fastNow + timer.delay
    } else if (timer.state > 0 && fastNow >= timer.state) {
      timer.state = -1
      timer.callback(timer.opaque)
    }

    if (timer.state === -1) {
      timer.state = -2
      if (idx !== len - 1) {
        fastTimers[idx] = fastTimers.pop()
      } else {
        fastTimers.pop()
      }
      len -= 1
    } else {
      idx += 1
    }
  }

  if (fastTimers.length > 0) {
    refreshTimeout()
  }
}
