async function benchmarkLargeFiles() {
  console.log('\n📊 Benchmark 3: Large File Handling');
  console.log('Testing performance with different file sizes\n');

  const fileSizes = [
    { name: 'Small', lines: 50 },
    { name: 'Medium', lines: 500 },
    { name: 'Large', lines: 2000 }
  ];

  for (const size of fileSizes) {
    const testFile = path.join(TEST_DIR, `${size.name.toLowerCase()}-file.js`);

    // Generate file with specified number of lines
    let content = '';
    for (let i = 0; i < size.lines; i++) {
      content += `function func${i}() { return ${i}; }\n`;
    }
    await fs.writeFile(testFile, content);

    const start = Date.now();
    await execAsync(
      `npx claude-flow agent booster edit ${testFile} "Add JSDoc comments" --dry-run`
    );
    const duration = Date.now() - start;

    console.log(`  ${size.name} file (${size.lines} lines):`);
    console.log(`    Processing time: ${duration}ms`);
    console.log(`    Lines per second: ${(size.lines / (duration / 1000)).toFixed(0)}`);
    console.log('');
  }
}
