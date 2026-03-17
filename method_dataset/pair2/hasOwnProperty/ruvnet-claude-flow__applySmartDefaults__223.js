export function applySmartDefaults<T extends Record<string, any>>(
  options: T,
  env?: ExecutionEnvironment,
): T & { appliedDefaults: string[]; skipPermissions?: boolean; dangerouslySkipPermissions?: boolean; nonInteractive?: boolean; json?: boolean; noColor?: boolean; } {
  const environment = env || detectExecutionEnvironment({ skipWarnings: true });
  const appliedDefaults: string[] = [];
  const enhanced = { ...options, appliedDefaults } as T & { appliedDefaults: string[]; skipPermissions?: boolean; dangerouslySkipPermissions?: boolean; nonInteractive?: boolean; json?: boolean; noColor?: boolean; };

  // Apply defaults based on environment
  if (
    (environment.isVSCode || environment.isCI || !environment.supportsRawMode) &&
    !options.hasOwnProperty('skipPermissions')
  ) {
    enhanced.skipPermissions = true;
    enhanced.dangerouslySkipPermissions = true;
    appliedDefaults.push('--dangerously-skip-permissions');
  }

  if (
    (environment.isCI || !environment.isInteractive) &&
    !options.hasOwnProperty('nonInteractive')
  ) {
    enhanced.nonInteractive = true;
    appliedDefaults.push('--non-interactive');
  }

  if (environment.isCI && !options.hasOwnProperty('json')) {
    enhanced.json = true;
    appliedDefaults.push('--json');
  }

  if (!environment.supportsColor && !options.hasOwnProperty('noColor')) {
    enhanced.noColor = true;
    appliedDefaults.push('--no-color');
  }

  // Log applied defaults if verbose
  if (options.verbose && appliedDefaults.length > 0) {
    console.log(chalk.gray(`ℹ️  Auto-applied flags: ${appliedDefaults.join(' ')}`));
  }

  return enhanced;
}
