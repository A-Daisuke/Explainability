function generateEmbedding(text, cognitiveType) {
  const dim = 384;
  const embedding = new Float32Array(dim);

  // Seed based on text and cognitive type for consistency
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) % 1000000;
  }
  seed += cognitiveType.length * 1000;

  // Generate deterministic pseudo-random embedding
  for (let i = 0; i < dim; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    embedding[i] = (seed / 2147483648) * 2 - 1;
  }

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  for (let i = 0; i < dim; i++) {
    embedding[i] /= magnitude;
  }

  return Buffer.from(embedding.buffer);
}
