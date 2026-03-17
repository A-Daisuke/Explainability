function generateEmbedding(text, seed = 0) {
  const embedding = new Float32Array(1024);
  const hash = createHash('sha256').update(text + seed).digest();

  for (let i = 0; i < 1024; i++) {
    const idx = i % hash.length;
    embedding[i] = (hash[idx] / 255) * 2 - 1; // Normalize to [-1, 1]
  }

  // Add some randomness based on text content
  const textHash = createHash('md5').update(text).digest();
  for (let i = 0; i < 1024; i++) {
    const noise = (textHash[i % textHash.length] / 255) * 0.1 - 0.05;
    embedding[i] = Math.max(-1, Math.min(1, embedding[i] + noise));
  }

  return Buffer.from(embedding.buffer);
}
