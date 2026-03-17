async function runTest(memory, numNodes, nodeSize, i) {
  console.log(`\n${Underline + Cyan}Running test #${i} for ${memory} mem, ${numNodes} nodes of ${nodeSize}${Reset}`)

  let stdout = "";
  let code = 139;

  const memoryStatFile = path.join(__dirname, `..`, `.docker.memusage`)
  let buildFinished = false;
  let metrics = []

  // start the build
  hostExec(`yarn test --memory ${memory} --num-nodes ${numNodes} --node-size ${nodeSize}`)
    .then((result) => {
      stdout = result.stdout
      code = 0
    })
    .catch((e) => {
      stdout = e.stdout
      code = e.code
    })
    .finally(() => {
      buildFinished = true;
    })

  const start = Date.now()

  // loop until the build has finished
  const buildName = `mem=${memory}`
  while (!buildFinished) {

    if (fs.existsSync(memoryStatFile)) {
      // get docker container stats
      const stat = fs.readFileSync(memoryStatFile).toString().trim()

      if (stat && parseInt(stat) !== 0) {
        metrics.push({
          build: i + 1, 
          timestamp: Date.now() - start, 
          memory, 
          numNodes, 
          nodeSize, 
          usage: stat
        })
      }
    }

    await sleep(250)
  }
  
  // grab results
  const timerRegex = /Finished test in (.+)s/
  const match = stdout.match(timerRegex)
  const time = parseFloat(match[1])

  if (args.showTestOutput) {
    console.log(stdout)
  }

  const maxMemoryUsage = Math.max.apply(Math, metrics.map(m => m.usage))
  writeMetrics(buildName, metrics, time * 1000)
  writeResults(i + 1, memory, numNodes, nodeSize, code === 0 ? 'success' : 'failure', code, time, maxMemoryUsage)

  if (code === 0) {
    console.log(`${Green}Built after ${time}s!${Reset}`)
  } else {
    console.log(`${Red}Failed with exit code ${code} after ${time}s.${Reset}`)
  }

  return code
}
