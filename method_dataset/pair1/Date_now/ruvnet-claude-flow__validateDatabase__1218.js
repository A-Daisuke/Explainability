function validateDatabase(db) {
  console.log(`\n✅ Validating database...`);

  const patternCount = db.prepare('SELECT COUNT(*) as count FROM patterns').get();
  const embeddingCount = db.prepare('SELECT COUNT(*) as count FROM pattern_embeddings').get();
  const linkCount = db.prepare('SELECT COUNT(*) as count FROM pattern_links').get();
  const trajectoryCount = db.prepare('SELECT COUNT(*) as count FROM task_trajectories').get();

  console.log(`   - Patterns: ${patternCount.count}`);
  console.log(`   - Embeddings: ${embeddingCount.count}`);
  console.log(`   - Links: ${linkCount.count}`);
  console.log(`   - Trajectories: ${trajectoryCount.count}`);

  // Check cognitive type distribution
  const distribution = db.prepare(`
    SELECT cognitive_type, COUNT(*) as count
    FROM patterns
    GROUP BY cognitive_type
    ORDER BY cognitive_type
  `).all();

  console.log(`\n   Cognitive Type Distribution:`);
  distribution.forEach(d => {
    console.log(`   - ${d.cognitive_type}: ${d.count} patterns`);
  });

  // Database size
  const stats = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get();
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`\n   Database size: ${sizeMB} MB`);

  // Query performance test
  console.log(`\n   Testing query performance...`);
  const start = Date.now();
  db.prepare(`
    SELECT p.*, pe.embedding
    FROM patterns p
    JOIN pattern_embeddings pe ON p.id = pe.pattern_id
    WHERE p.cognitive_type = ?
    LIMIT 10
  `).all('convergent');
  const queryTime = Date.now() - start;
  console.log(`   - Query latency: ${queryTime}ms`);

  return {
    patterns: patternCount.count,
    embeddings: embeddingCount.count,
    links: linkCount.count,
    trajectories: trajectoryCount.count,
    sizeMB: parseFloat(sizeMB),
    queryTime
  };
}
