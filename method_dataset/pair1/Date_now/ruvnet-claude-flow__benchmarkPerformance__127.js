function __method_wrapper__() {
  benchmarkPerformance() {
    console.log('⚡ Performance Tests...');

    const iterations = 100;

    // Test 1: Simple SELECT
    let start = Date.now();
    for (let i = 0; i < iterations; i++) {
      this.db.prepare('SELECT * FROM patterns LIMIT 10').all();
    }
    const simpleQueryMs = (Date.now() - start) / iterations;

    // Test 2: Filtered SELECT
    start = Date.now();
    for (let i = 0; i < iterations; i++) {
      this.db.prepare('SELECT * FROM patterns WHERE confidence > 0.7 LIMIT 10').all();
    }
    const filteredQueryMs = (Date.now() - start) / iterations;

    // Test 3: JOIN query
    start = Date.now();
    for (let i = 0; i < iterations; i++) {
      this.db.prepare(`
        SELECT p.*, pe.embedding
        FROM patterns p
        JOIN pattern_embeddings pe ON p.id = pe.pattern_id
        LIMIT 10
      `).all();
    }
    const joinQueryMs = (Date.now() - start) / iterations;

    // Test 4: Aggregate query
    start = Date.now();
    for (let i = 0; i < iterations; i++) {
      this.db.prepare(`
        SELECT domain, COUNT(*) as count, AVG(confidence) as avg_conf
        FROM patterns
        GROUP BY domain
      `).all();
    }
    const aggregateQueryMs = (Date.now() - start) / iterations;

    console.log(`  Simple query: ${simpleQueryMs.toFixed(2)}ms`);
    console.log(`  Filtered query: ${filteredQueryMs.toFixed(2)}ms`);
    console.log(`  JOIN query: ${joinQueryMs.toFixed(2)}ms`);
    console.log(`  Aggregate query: ${aggregateQueryMs.toFixed(2)}ms\n`);

    const avgLatency = (simpleQueryMs + filteredQueryMs + joinQueryMs + aggregateQueryMs) / 4;
    const score = avgLatency < 5 ? 100 : (avgLatency < 10 ? 75 : 50);

    return {
      simpleQueryMs,
      filteredQueryMs,
      joinQueryMs,
      aggregateQueryMs,
      avgLatency,
      score,
      passed: avgLatency < 10
    };
  }

}
