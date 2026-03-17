async function run (filters = []) {
  const startTime = Date.now()
  const expectation = getExpectation()
  const tests = discoverTestsToRun(filters, expectation)

  console.log(`Going to run ${tests.length} test files`)

  const results = await runWithTestUtil(async () => {
    const testResults = []

    for (const test of tests) {
      console.log(`${'='.repeat(40)}\n${test.path}\n`)

      const timeout = test.options.timeout === 'long' ? 60_000 : 10_000
      const result = await runSingleTest(test.url, test.options, test.expectation, timeout)

      testResults.push({ test, result })

      console.log(`${test.path}: ${result.cases.length} tests ran in ${result.duration}ms:`)

      if (result.cases.length === 0) {
        console.log(`\t??. ❌ ${result.error?.message ?? 'N/A'}`)
      }

      for (const c of result.cases) {
        console.log(`\t${c.index + 1}. "${c.name}": ${c.status === 0 ? '✅ PASS' : '❌ FAIL'}`)

        if (c.status !== 0 && (c.message || c.stack)) {
          log(`${c.message}:\n${c.stack.split('\n').slice(1).join('\n')}`)
        }
      }
    }

    return testResults
  })

  const endTime = Date.now()
  console.log(`\nCompleted in ${endTime - startTime}ms`)

  // Calculate summary
  const totalTests = results.length
  const { pass, fail } = results.reduce((curr, { result }) => {
    for (const c of result.cases) {
      if (c.status !== 0) {
        curr.fail++
      } else {
        curr.pass++
      }
    }

    return curr
  }, { pass: 0, fail: 0 })

  console.log('\n' + '='.repeat(50))
  console.log('TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total Test Files: ${totalTests}`)
  console.log(`✅ Passing: ${pass}`)
  console.log(`❌ Failing: ${fail}`)
  console.log('='.repeat(50))

  if (process.env.WPT_REPORT) {
    const report = generateWPTReport(results, startTime, endTime)
    writeFileSync(process.env.WPT_REPORT, JSON.stringify(report))
  } else {
    const oldExpectations = getExpectation()
    updateExpectations(results)

    const jsondiff = jsondiffpatch.create({
      propertyFilter: (name) => {
        return name === 'success'
      }
    })

    const diff = jsondiff.diff(oldExpectations, getExpectation())
    process.exitCode = diff === undefined ? 0 : 1

    if (diff !== undefined) {
      console.dir(diff, { depth: Infinity })
    }
  }
}
