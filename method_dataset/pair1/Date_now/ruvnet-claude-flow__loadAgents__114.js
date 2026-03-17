function __method_wrapper__() {
  private async loadAgents(): Promise<void> {
    const agentsDir = this.getAgentsDirectory();
    
    if (!existsSync(agentsDir)) {
      console.warn(`Agents directory not found: ${agentsDir}`);
      return;
    }

    // Find all .md files in the agents directory
    const agentFiles = await glob('**/*.md', {
      cwd: agentsDir,
      ignore: ['**/README.md', '**/MIGRATION_SUMMARY.md'],
      absolute: true,
    });

    // Clear cache
    this.agentCache.clear();
    this.categoriesCache = [];

    // Track categories
    const categoryMap = new Map<string, AgentDefinition[]>();

    // Parse each agent file
    for (const filePath of agentFiles) {
      const agent = this.parseAgentFile(filePath);
      if (agent) {
        this.agentCache.set(agent.name, agent);
        
        // Determine category from file path
        const relativePath = filePath.replace(agentsDir, '');
        const pathParts = relativePath.split('/');
        const category = pathParts[1] || 'uncategorized'; // First directory after agents/
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(agent);
      }
    }

    // Build categories array
    this.categoriesCache = Array.from(categoryMap.entries()).map(([name, agents]) => ({
      name,
      agents: agents.sort((a, b) => a.name.localeCompare(b.name)),
    }));

    this.lastLoadTime = Date.now();
  }

}
