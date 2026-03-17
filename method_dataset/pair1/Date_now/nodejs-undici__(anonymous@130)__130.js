function __method_wrapper__() {
test('SnapshotRecorder - file persistence', async (t) => {
  const snapshotPath = join(tmpdir(), `test-recorder-${Date.now()}.json`)
  const recorder = new SnapshotRecorder({ snapshotPath })

  t.after(() => unlink(snapshotPath).catch(() => {}))

  // Record some interactions
  await recorder.record(
    { origin: 'https://api.example.com', path: '/users', method: 'GET' },
    { statusCode: 200, headers: {}, body: Buffer.from('user data'), trailers: {} }
  )

  await recorder.record(
    { origin: 'https://api.example.com', path: '/posts', method: 'GET' },
    { statusCode: 200, headers: {}, body: Buffer.from('post data'), trailers: {} }
  )

  assert.strictEqual(recorder.size(), 2)

  // Save to file
  await recorder.saveSnapshots()

  // Create new recorder and load from file
  const newRecorder = new SnapshotRecorder({ snapshotPath })
  await newRecorder.loadSnapshots()

  assert.strictEqual(newRecorder.size(), 2)

  // Verify snapshots were loaded correctly
  const userSnapshot = newRecorder.findSnapshot({
    origin: 'https://api.example.com',
    path: '/users',
    method: 'GET'
  })

  assert(userSnapshot)
  assert.strictEqual(userSnapshot.response.statusCode, 200)
  // Body is now stored as base64 string
  assert.strictEqual(userSnapshot.response.body, Buffer.from('user data').toString('base64'))
})

}
