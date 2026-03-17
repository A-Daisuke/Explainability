  async function wrappedGraphQL() {
    const start = Date.now()
    // @ts-ignore not sure how to type the following
    const returnValue = await originalGraphQL.apply(this, arguments) // eslint-disable-line
    const end = Date.now()
    const totalMS = end - start
    if (totalMS > 10000) {
      reporter.warn(
        `Your GraphQL query in createPages took ${
          totalMS / 1000
        } seconds which is an unexpectedly long time. See https://gatsby.dev/create-pages-performance for tips on how to improve this.`
      )
    }
    return returnValue
  }
