function __method_wrapper__() {
  test('stale-while-revalidate returns stale immediately and revalidates in background (RFC 5861)', async () => {
    let requestsToOrigin = 0
    let revalidationRequests = 0
    let serverResponse = 'original-response'

    const server = createServer({ joinDuplicateHeaders: true }, (req, res) => {
      const responseDate = new Date()
      res.setHeader('date', responseDate.toUTCString())
      res.setHeader('cache-control', 's-maxage=1, stale-while-revalidate=10')

      if (req.headers['if-modified-since']) {
        revalidationRequests++
        // Return updated content on revalidation
        serverResponse = 'revalidated-response'
        res.end(serverResponse)
      } else {
        requestsToOrigin++
        res.end(serverResponse)
      }
    }).listen(0)

    const client = new Client(`http://localhost:${server.address().port}`)
      .compose(interceptors.cache())

    after(async () => {
      server.close()
      await client.close()
    })

    await once(server, 'listening')

    const request = {
      origin: 'localhost',
      method: 'GET',
      path: '/'
    }

    // Send initial request to cache the response
    {
      const res = await client.request(request)
      equal(requestsToOrigin, 1)
      strictEqual(await res.body.text(), 'original-response')
    }

    // Wait for response to become stale
    await sleep(1100)

    // Request stale content - should return immediately with stale content
    const startTime = Date.now()
    {
      const res = await client.request(request)
      const responseTime = Date.now() - startTime

      // Should return stale content immediately (< 50ms)
      equal(res.statusCode, 200)
      strictEqual(await res.body.text(), 'original-response')
      equal(requestsToOrigin, 1) // No additional origin requests yet

      // Response should be immediate (RFC 5861 requirement)
      if (responseTime > 100) {
        fail(`stale-while-revalidate response took ${responseTime}ms, should be < 100ms`)
      }
    }

    // Wait for background revalidation to complete
    await sleep(500)

    // Verify that revalidation occurred in background
    equal(revalidationRequests, 1, 'Background revalidation should have occurred')
  })

}
