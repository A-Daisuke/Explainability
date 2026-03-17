async function parseMarkdown(subArgs, flags) {
  const markdownFile = subArgs[2];

  if (!markdownFile) {
    printError('Usage: agent booster parse-markdown <markdown-file>');
    console.log('\nExamples:');
    console.log('  claude-flow agent booster parse-markdown refactoring-plan.md');
    console.log('  claude-flow agent booster parse refactor.md --dry-run');
    return;
  }

  if (!existsSync(markdownFile)) {
    printError(`File not found: ${markdownFile}`);
    return;
  }

  printSuccess(`🚀 Agent Booster: Parsing markdown edits`);
  console.log(`File: ${markdownFile}`);

  try {
    const markdown = await fs.readFile(markdownFile, 'utf8');

    console.log('\n⏱️  Parsing code blocks with Agent Booster...\n');
    const startTime = Date.now();

    // Call Agent Booster parse MCP tool
    const result = await callAgentBooster('parse', { markdown });

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log(`📝 Found ${result.edits_count} code blocks to process\n`);

      // Apply parsed edits
      let successCount = 0;
      let failCount = 0;

      for (const edit of result.edits) {
        if (edit.success) {
          if (!flags.dryRun && !flags.dry) {
            await fs.writeFile(edit.filepath, edit.edited_code, 'utf8');
          }
          successCount++;
          console.log(`  ✅ ${edit.filepath}`);
        } else {
          failCount++;
          console.log(`  ❌ ${edit.filepath}: ${edit.error}`);
        }
      }

      const dryRunNote = (flags.dryRun || flags.dry) ? ' (dry run)' : '';
      printSuccess(`\n✅ Markdown parsing completed in ${duration}ms${dryRunNote}`);
      console.log(`  Success: ${successCount}/${result.edits_count}`);
      if (failCount > 0) {
        console.log(`  Failed: ${failCount}/${result.edits_count}`);
      }
    } else {
      printError('Markdown parsing failed: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    printError(`Parse error: ${error.message}`);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}
