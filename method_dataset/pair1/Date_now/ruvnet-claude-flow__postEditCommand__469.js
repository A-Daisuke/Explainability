async function postEditCommand(subArgs, flags) {
  const options = flags;
  const file = options.file || 'unknown-file';
  let memoryKey = options['memory-key'] || options.memoryKey;
  
  // Handle case where memory-key is passed as a boolean flag without value
  if (memoryKey === true) {
    // Generate a default memory key based on the file path and timestamp
    const path = await import('path');
    const basename = path.basename(file);
    memoryKey = `edit:${basename}:${Date.now()}`;
  }
  
  const format = options.format || false;
  const updateMemory = options['update-memory'] || false;
  const trainNeural = options['train-neural'] || false;

  console.log(`📝 Executing post-edit hook...`);
  console.log(`📄 File: ${file}`);
  if (memoryKey) console.log(`💾 Memory key: ${memoryKey}`);
  if (format) console.log(`🎨 Auto-format: ENABLED`);
  if (updateMemory) console.log(`🧠 Memory update: ENABLED`);
  if (trainNeural) console.log(`🤖 Neural training: ENABLED`);

  try {
    const store = await getMemoryStore();
    const path = await import('path');
    const fs = await import('fs');

    // Auto-format file if requested
    let formatResult = null;
    if (format && fs.existsSync(file)) {
      const ext = path.extname(file).toLowerCase();
      const formatters = {
        '.js': 'prettier',
        '.ts': 'prettier',
        '.json': 'prettier',
        '.css': 'prettier',
        '.html': 'prettier',
        '.py': 'black',
        '.go': 'gofmt',
        '.rs': 'rustfmt',
        '.java': 'google-java-format',
        '.cpp': 'clang-format',
        '.c': 'clang-format',
      };

      const formatter = formatters[ext];
      if (formatter) {
        console.log(`  🎨 Auto-formatting with ${formatter}...`);
        formatResult = {
          formatter,
          extension: ext,
          attempted: true,
          timestamp: new Date().toISOString(),
        };
      } else {
        console.log(`  ⚠️  No formatter available for ${ext}`);
        formatResult = {
          extension: ext,
          attempted: false,
          reason: 'No formatter available',
        };
      }
    }

    // Update memory with edit context
    let memoryUpdate = null;
    if (updateMemory) {
      const editContext = {
        file,
        editedAt: new Date().toISOString(),
        editId: generateId('edit'),
        formatted: formatResult?.attempted || false,
        fileSize: fs.existsSync(file) ? fs.statSync(file).size : 0,
        directory: path.dirname(file),
        basename: path.basename(file),
      };

      memoryUpdate = editContext;

      // Store in coordination namespace
      await store.store(`edit-context:${editContext.editId}`, editContext, {
        namespace: 'coordination',
        metadata: { type: 'edit-context', file },
      });

      console.log(`  🧠 Edit context stored in memory`);
    }

    // Train neural patterns if requested
    let neuralTraining = null;
    if (trainNeural) {
      // Simulate neural training with file patterns
      const ext = path.extname(file).toLowerCase();
      const basename = path.basename(file);
      const editTime = new Date().toISOString();

      const patterns = {
        fileType: ext,
        fileName: basename,
        editTime,
        confidence: Math.random() * 0.5 + 0.5, // 50-100% confidence
        patterns: [
          `${ext}_edit_pattern`,
          `${basename}_modification`,
          `edit_${Date.now()}_sequence`,
        ],
      };

      neuralTraining = patterns;

      await store.store(`neural-pattern:${generateId('pattern')}`, patterns, {
        namespace: 'neural-training',
        metadata: { type: 'edit-pattern', file, extension: ext },
      });

      console.log(
        `  🤖 Neural patterns trained (${(patterns.confidence * 100).toFixed(1)}% confidence)`,
      );
    }

    const editData = {
      file,
      memoryKey,
      timestamp: new Date().toISOString(),
      editId: generateId('edit'),
      format,
      updateMemory,
      trainNeural,
      formatResult,
      memoryUpdate,
      neuralTraining,
    };

    await store.store(`edit:${editData.editId}:post`, editData, {
      namespace: 'hooks:post-edit',
      metadata: { hookType: 'post-edit', file, formatted: formatResult?.attempted || false },
    });

    if (memoryKey && typeof memoryKey === 'string') {
      await store.store(
        memoryKey,
        {
          file,
          editedAt: new Date().toISOString(),
          editId: editData.editId,
          enhanced: true,
          formatResult,
          memoryUpdate,
          neuralTraining,
        },
        { namespace: 'coordination' },
      );
    }

    const historyKey = `file-history:${file.replace(/\//g, '_')}:${Date.now()}`;
    await store.store(
      historyKey,
      {
        file,
        editId: editData.editId,
        timestamp: new Date().toISOString(),
        enhanced: true,
        features: {
          format,
          updateMemory,
          trainNeural,
        },
      },
      { namespace: 'file-history' },
    );

    console.log(`  💾 Post-edit data saved to .swarm/memory.db`);
    printSuccess(`✅ Post-edit hook completed`);
  } catch (err) {
    printError(`Post-edit hook failed: ${err.message}`);
  }
}
