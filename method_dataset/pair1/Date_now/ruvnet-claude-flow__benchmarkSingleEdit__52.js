async function benchmarkSingleEdit() {
  console.log('\n📊 Benchmark 1: Single File Edit Speed');
  console.log('Testing individual edit performance\n');

  const testFile = path.join(TEST_DIR, 'single-edit.js');
  const testCode = `
function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}
`;
  await fs.writeFile(testFile, testCode);

  const iterations = 100;
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await execAsync(
      `npx claude-flow agent booster edit ${testFile} "Add JSDoc comment" --dry-run`
    );
    const duration = Date.now() - start;
    times.push(duration);

    if ((i + 1) % 10 === 0) {
      process.stdout.write(`  Progress: ${i + 1}/${iterations}\r`);
    }
  }

  const avg = times.reduce((a, b) => a + b, 0) / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const llmBaseline = 352; // ms

  console.log(`\n\n  Results (${iterations} iterations):`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min}ms`);
  console.log(`  Max: ${max}ms`);
  console.log(`  LLM Baseline: ${llmBaseline}ms`);
  console.log(`  Speedup: ${(llmBaseline / avg).toFixed(1)}x`);
  console.log(`  Time Saved: ${((llmBaseline - avg) * iterations / 1000).toFixed(2)}s`);
}
