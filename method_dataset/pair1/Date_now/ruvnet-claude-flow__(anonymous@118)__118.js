function __method_wrapper__() {
  .action(async (options: any) => {
    try {
      const configManager = ConfigManager.getInstance();

      if (!configManager.isClaudeAPIConfigured()) {
        console.error(chalk.red('❌ Claude API not configured. Run "claude-api configure" first.'));
        process.exit(1);
      }

      console.log(chalk.blue('🧪 Testing Claude API connectivity...'));

      const logger = new Logger({ level: 'info', format: 'text', destination: 'console' });
      const client = new ClaudeAPIClient(logger, configManager);

      const testOptions: any = {};
      if (options.model) testOptions.model = options.model;
      if (options.temperature !== undefined) testOptions.temperature = options.temperature;

      const start = Date.now();
      const response = await client.complete(options.prompt, testOptions);
      const duration = Date.now() - start;

      console.log(chalk.green('✅ Claude API test successful!'));
      console.log(chalk.gray(`Duration: ${duration}ms`));
      console.log(chalk.cyan('\nResponse:'));
      console.log(response);
    } catch (error) {
      console.error(chalk.red('❌ Claude API test failed:'), getErrorMessage(error));
      process.exit(1);
    }
  });

}
