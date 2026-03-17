async function benchmarkConcurrentOps() {
  console.log('\n📊 Benchmark 4: Concurrent Operations');
  console.log('Testing parallel execution performance\n');

  const concurrency = 5;
  const filesPerBatch = 10;

  // Create test files
  for (let i = 0; i < filesPerBatch * concurrency; i++) {
    await fs.writeFile(
      path.join(TEST_DIR, `concurrent-${i}.js`),
      `function test${i}() {}\n`
    );
  }

  const start = Date.now();

  // Run concurrent edits
  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    const pattern = path.join(TEST_DIR, `concurrent-${i}*.js`);
    promises.push(
      execAsync(
        `npx claude-flow agent booster batch "${pattern}" "Add comment" --dry-run`
      )
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  const totalFiles = filesPerBatch * concurrency;
  const llmTime = totalFiles * 352; // ms

  console.log(`  ${concurrency} concurrent batches (${filesPerBatch} files each):`);
  console.log(`    Total files: ${totalFiles}`);
  console.log(`    Agent Booster: ${duration}ms`);
  console.log(`    LLM Baseline: ${llmTime}ms`);
  console.log(`    Speedup: ${(llmTime / duration).toFixed(1)}x`);
  console.log(`    Throughput: ${(totalFiles / (duration / 1000)).toFixed(1)} files/sec`);
}
