async function initializeProject(projectPath, options = {}) {
  const {
    template = null,
    environment = 'dev',
    sparc = false,
    minimal = false,
    force = false,
    customConfig = {},
  } = options;

  try {
    // Get absolute project path
    const currentDir = cwd();
    const absoluteProjectPath = projectPath.startsWith('/')
      ? projectPath
      : `${currentDir}/${projectPath}`;

    // Create project directory
    await fs.mkdir(absoluteProjectPath, { recursive: true });

    // Change to project directory
    const originalDir = cwd();
    process.chdir(absoluteProjectPath);

    // Initialize base structure
    const directories = [
      'memory',
      'memory/agents',
      'memory/sessions',
      'coordination',
      'coordination/memory_bank',
      'coordination/subtasks',
      'coordination/orchestration',
      '.claude',
      '.claude/commands',
      '.claude/commands/sparc',
      '.claude/logs',
    ];

    // Add template-specific directories
    if (template && PROJECT_TEMPLATES[template]) {
      const templateConfig = PROJECT_TEMPLATES[template];
      if (templateConfig.extraDirs) {
        directories.push(...templateConfig.extraDirs);
      }
    }

    // Create all directories in parallel
    await Promise.all(
      directories.map((dir) => fs.mkdir(dir, { recursive: true }).catch(() => {})),
    );

    // Create configuration files in parallel
    const fileCreationTasks = [];

    // CLAUDE.md
    const claudeMd = sparc
      ? createSparcClaudeMd()
      : minimal
        ? createMinimalClaudeMd()
        : createFullClaudeMd();
    fileCreationTasks.push(fs.writeFile('CLAUDE.md', claudeMd));

    // memory-bank.md
    const memoryBankMd = minimal ? createMinimalMemoryBankMd() : createFullMemoryBankMd();
    fileCreationTasks.push(fs.writeFile('memory-bank.md', memoryBankMd));

    // coordination.md
    const coordinationMd = minimal ? createMinimalCoordinationMd() : createFullCoordinationMd();
    fileCreationTasks.push(fs.writeFile('coordination.md', coordinationMd));

    // README files
    fileCreationTasks.push(
      fs.writeFile('memory/agents/README.md', createAgentsReadme()),
      fs.writeFile('memory/sessions/README.md', createSessionsReadme()),
    );

    // Persistence database
    const initialData = {
      agents: [],
      tasks: [],
      environment: environment,
      template: template,
      customConfig: customConfig,
      lastUpdated: Date.now(),
    };
    fileCreationTasks.push(
      fs.writeFile('memory/claude-flow-data.json', JSON.stringify(initialData, null, 2)),
    );

    // Environment configuration
    if (ENVIRONMENT_CONFIGS[environment]) {
      const envConfig = ENVIRONMENT_CONFIGS[environment];
      const envContent = Object.entries(envConfig.config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      fileCreationTasks.push(fs.writeFile('.env', envContent));
    }

    // Template-specific files
    if (template && PROJECT_TEMPLATES[template]) {
      const templateConfig = PROJECT_TEMPLATES[template];
      if (templateConfig.extraFiles) {
        for (const [filePath, content] of Object.entries(templateConfig.extraFiles)) {
          let fileContent =
            typeof content === 'object' ? JSON.stringify(content, null, 2) : content;

          // Replace template variables
          fileContent = fileContent
            .replace(/{{PROJECT_NAME}}/g, projectPath.split('/').pop())
            .replace(/{{PROJECT_DESCRIPTION}}/g, templateConfig.description)
            .replace(/{{ENVIRONMENT}}/g, environment);

          fileCreationTasks.push(fs.writeFile(filePath, fileContent));
        }
      }
    }

    // Execute all file creation tasks in parallel
    await Promise.all(fileCreationTasks);

    // SPARC initialization if requested
    if (sparc) {
      await createSparcStructureManually();
      await createClaudeSlashCommands(projectPath);
    }

    // Change back to original directory
    process.chdir(originalDir);

    return { success: true, projectPath: absoluteProjectPath };
  } catch (error) {
    return { success: false, projectPath, error: error.message };
  }
}
