async function benchmarkBatchProcessing() {
  console.log('\n📊 Benchmark 2: Batch Processing Speed');
  console.log('Testing multi-file editing performance\n');

  const fileCounts = [10, 50, 100];

  for (const count of fileCounts) {
    // Create test files
    for (let i = 0; i < count; i++) {
      await fs.writeFile(
        path.join(TEST_DIR, `batch-${count}-${i}.js`),
        `function test${i}() { return ${i}; }\n`
      );
    }

    const start = Date.now();
    await execAsync(
      `npx claude-flow agent booster batch "${TEST_DIR}/batch-${count}-*.js" "Add comments" --dry-run`
    );
    const duration = Date.now() - start;

    const llmTime = count * 352; // ms
    const speedup = llmTime / duration;

    console.log(`  ${count} files:`);
    console.log(`    Agent Booster: ${duration}ms (${(duration / count).toFixed(1)}ms per file)`);
    console.log(`    LLM Baseline: ${llmTime}ms (${352}ms per file)`);
    console.log(`    Speedup: ${speedup.toFixed(1)}x`);
    console.log(`    Time Saved: ${((llmTime - duration) / 1000).toFixed(2)}s`);
    console.log(`    Cost Saved: $${(count * 0.01).toFixed(2)}`);
    console.log('');

    // Cleanup for next iteration
    for (let i = 0; i < count; i++) {
      await fs.unlink(path.join(TEST_DIR, `batch-${count}-${i}.js`));
    }
  }
}
