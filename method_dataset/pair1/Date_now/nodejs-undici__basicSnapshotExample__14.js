async function basicSnapshotExample () {
  console.log('🚀 Basic Snapshot Testing Example\n')

  // Create a temporary snapshot file path
  const snapshotPath = join(tmpdir(), `snapshot-example-${Date.now()}.json`)
  console.log(`📁 Using temporary snapshot file: ${snapshotPath}\n`)

  // Create a local test server
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Hello from test server!',
      timestamp: new Date().toISOString(),
      path: req.url
    }))
  })

  await promisify(server.listen.bind(server))(0)
  const { port } = server.address()
  const origin = `http://localhost:${port}`

  try {
    // Step 1: Record mode - capture API responses
    console.log('📹 Step 1: Recording API response...')

    const recordingAgent = new SnapshotAgent({
      mode: 'record',
      snapshotPath
    })

    const originalDispatcher = getGlobalDispatcher()
    setGlobalDispatcher(recordingAgent)

    try {
      // Make an API call that will be recorded
      const response = await request(`${origin}/api/test`)
      const data = await response.body.json()

      console.log(`✅ Recorded response: ${data.message}`)

      // Save the recorded snapshots
      await recordingAgent.saveSnapshots()
      console.log('💾 Snapshot saved to temporary file\n')
    } finally {
      setGlobalDispatcher(originalDispatcher)
      recordingAgent.close()
    }

    // Step 2: Playback mode - use recorded responses (server can be down)
    console.log('🎬 Step 2: Playing back recorded response...')
    server.close() // Close server to prove we're using snapshots

    const playbackAgent = new SnapshotAgent({
      mode: 'playback',
      snapshotPath
    })

    setGlobalDispatcher(playbackAgent)

    try {
      // This will use the recorded response instead of making a real request
      const response = await request(`${origin}/api/test`)
      const data = await response.body.json()

      console.log(`✅ Playback response: ${data.message}`)
      console.log('🎉 Successfully used recorded data instead of live server!')
    } finally {
      setGlobalDispatcher(originalDispatcher)
      playbackAgent.close()
    }
  } finally {
    // Ensure server is closed
    if (server.listening) {
      server.close()
    }

    // Clean up temporary file
    try {
      const { unlink } = require('node:fs/promises')
      await unlink(snapshotPath)
      console.log('\n🗑️  Cleaned up temporary snapshot file')
    } catch {
      // File might not exist or already be deleted
    }
  }
}
