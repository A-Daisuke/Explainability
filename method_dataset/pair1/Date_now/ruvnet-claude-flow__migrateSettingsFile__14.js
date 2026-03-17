async function migrateSettingsFile(settingsPath) {
  try {
    // Read existing settings
    const content = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(content);
    
    // Check if hooks already in new format
    if (settings.hooks && settings.hooks.PreToolUse) {
      console.log('✅ Hooks already in new format, no migration needed');
      return;
    }
    
    // Backup original file
    const backupPath = settingsPath + '.backup-' + Date.now();
    await fs.writeFile(backupPath, content);
    console.log(`📦 Backed up original settings to: ${backupPath}`);
    
    // Convert old hooks format to new format
    const newHooks = {
      PreToolUse: [],
      PostToolUse: [],
      Stop: []
    };
    
    // Convert preCommandHook
    if (settings.hooks?.preCommandHook) {
      newHooks.PreToolUse.push({
        matcher: "Bash",
        hooks: [{
          type: "command",
          command: `npx claude-flow@alpha hooks pre-command --command "\${command}" --validate-safety true --prepare-resources true`
        }]
      });
    }
    
    // Convert preEditHook
    if (settings.hooks?.preEditHook) {
      newHooks.PreToolUse.push({
        matcher: "Write|Edit|MultiEdit",
        hooks: [{
          type: "command",
          command: `npx claude-flow@alpha hooks pre-edit --file "\${file}" --auto-assign-agents true --load-context true`
        }]
      });
    }
    
    // Convert postCommandHook
    if (settings.hooks?.postCommandHook) {
      newHooks.PostToolUse.push({
        matcher: "Bash",
        hooks: [{
          type: "command",
          command: `npx claude-flow@alpha hooks post-command --command "\${command}" --track-metrics true --store-results true`
        }]
      });
    }
    
    // Convert postEditHook
    if (settings.hooks?.postEditHook) {
      newHooks.PostToolUse.push({
        matcher: "Write|Edit|MultiEdit",
        hooks: [{
          type: "command",
          command: `npx claude-flow@alpha hooks post-edit --file "\${file}" --format true --update-memory true --train-neural true`
        }]
      });
    }
    
    // Convert sessionEndHook
    if (settings.hooks?.sessionEndHook) {
      newHooks.Stop.push({
        hooks: [{
          type: "command",
          command: `npx claude-flow@alpha hooks session-end --generate-summary true --persist-state true --export-metrics true`
        }]
      });
    }
    
    // Update settings with new hooks format
    settings.hooks = newHooks;
    
    // Remove unrecognized fields for Claude Code 1.0.51+
    delete settings.mcpServers;
    delete settings.features;
    delete settings.performance;
    
    // Write updated settings
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    console.log('✅ Successfully migrated settings.json to new hooks format');
    
    // Show removed fields
    console.log('\n📝 Note: The following fields were removed (not supported by Claude Code 1.0.51+):');
    console.log('   - mcpServers (use "claude mcp add" command instead)');
    console.log('   - features');
    console.log('   - performance');
    
  } catch (error) {
    console.error('❌ Error migrating settings:', error.message);
    process.exit(1);
  }
}
