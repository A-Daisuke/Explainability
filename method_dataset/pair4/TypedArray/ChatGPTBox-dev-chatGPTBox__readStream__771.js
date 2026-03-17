async function readStream(response, progressCallback) {
  const reader = response.body.getReader()
  let received = 0
  let chunks = []
  let loading = true
  while (loading) {
    const { done, value } = await reader.read()
    if (done) {
      loading = false
      break
    }
    chunks.push(value)
    received += value?.length || 0

    let full = new Uint8Array(received)
    let position = 0

    for (let chunk of chunks) {
      full.set(chunk, position)
      position += chunk.length
    }

    if (value) {
      progressCallback(
        new TextDecoder('utf-8').decode(value),
        new TextDecoder('utf-8').decode(full),
      )
    }
  }

  let body = new Uint8Array(received)
  let position = 0

  for (let chunk of chunks) {
    body.set(chunk, position)
    position += chunk.length
  }

  return new TextDecoder('utf-8').decode(body)
}
