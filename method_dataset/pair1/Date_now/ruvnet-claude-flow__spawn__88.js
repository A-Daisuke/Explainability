function __method_wrapper__() {
  async spawn(args: string[], options: Record<string, any> = {}): Promise<void> {
    try {
      const { manager } = await initializeAgentSystem();

      const templateName = args[0] || 'researcher';
      const name = options.name || `${templateName}-${Date.now().toString(36)}`;

      console.log(`🚀 Creating agent with template: ${templateName}`);

      const agentId = await manager.createAgent(templateName, {
        name,
        config: {
          autonomyLevel: options.autonomy || 0.7,
          maxConcurrentTasks: options.maxTasks || 5,
          timeoutThreshold: options.timeout || 300000,
        },
      });

      if (options.start !== false) {
        console.log('⚡ Starting agent...');
        await manager.startAgent(agentId);
      }

      console.log('✅ Agent created successfully!');
      console.log(`   ID: ${agentId}`);
      console.log(`   Name: ${name}`);
      console.log(`   Template: ${templateName}`);
    } catch (error) {
      console.error(
        '❌ Error creating agent:',
        error instanceof Error ? error.message : String(error),
      );
    }
  },

}
