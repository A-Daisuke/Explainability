class __C__ {
  async pollingImgRequest(pollingUrl, onProgress) {
    let polling = true
    let body

    if (typeof onProgress !== 'function') {
      onProgress = () => false
    }

    const pollingStartTime = new Date().getTime()

    while (polling) {
      if (this.debug) {
        console.debug(`polling the image request: ${pollingUrl}`)
      }

      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(pollingUrl, this.fetchOptions)
      const { status } = response

      if (status !== 200) {
        throw new Error(`Bing Image Creator Error: response status = ${status}`)
      }

      // eslint-disable-next-line no-await-in-loop
      body = await response.text()

      if (body && body.indexOf('errorMessage') === -1) {
        polling = false
      } else {
        const cancelRequest = onProgress({ pollingStartTime })
        if (cancelRequest) {
          throw new Error('Bing Image Creator Error: cancelled')
        }

        // eslint-disable-next-line no-await-in-loop
        await this.constructor.sleep(1000)
      }
    }

    return body
  }

}
