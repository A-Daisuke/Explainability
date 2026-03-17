async function neuralTrainedCommand(subArgs, flags) {
  const options = flags;
  const modelName = options.model || 'default-neural';
  const accuracy = options.accuracy || '0.0';
  const patterns = options.patterns || '0';

  console.log(`🧠 Executing neural-trained hook...`);
  console.log(`🤖 Model: ${modelName}`);
  console.log(`📊 Accuracy: ${accuracy}%`);

  try {
    const store = await getMemoryStore();
    const trainingData = {
      modelName,
      accuracy: parseFloat(accuracy),
      patternsLearned: parseInt(patterns),
      trainedAt: new Date().toISOString(),
    };

    await store.store(`neural:${modelName}:${Date.now()}`, trainingData, {
      namespace: 'hooks:neural-trained',
      metadata: { hookType: 'neural-trained', model: modelName },
    });

    console.log(`  💾 Training results saved to .swarm/memory.db`);
    printSuccess(`✅ Neural trained hook completed`);
  } catch (err) {
    printError(`Neural trained hook failed: ${err.message}`);
  }
}
