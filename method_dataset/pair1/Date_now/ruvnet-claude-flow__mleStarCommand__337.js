async function mleStarCommand(subArgs, flags) {
  const options = flags;
  
  console.log(`🧠 MLE-STAR: Machine Learning Engineering via Search and Targeted Refinement`);
  console.log(`🎯 This is the flagship automation workflow for ML engineering tasks`);
  console.log();
  
  try {
    // Get the built-in MLE-STAR workflow
    const workflowPath = getMLEStarWorkflowPath();
    
    if (!existsSync(workflowPath)) {
      printError('MLE-STAR workflow template not found');
      console.log('Please ensure the template is installed at:');
      console.log(workflowPath);
      return;
    }
    
    // Load MLE-STAR workflow
    const workflowData = await loadWorkflowFromFile(workflowPath);
    
    console.log(`📋 Workflow: ${workflowData.name}`);
    console.log(`📄 Description: ${workflowData.description}`);
    console.log(`🎓 Methodology: Search → Foundation → Refinement → Ensemble → Validation`);
    console.log(`⏱️  Expected Runtime: ${workflowData.metadata.expected_runtime}`);
    console.log();
    
    // Detect dataset if provided
    const datasetPath = options.dataset || options.data || './data/dataset.csv';
    const targetColumn = options.target || 'target';
    
    // Create executor with MLE-STAR optimized settings
    // IMPORTANT: Default to non-interactive mode to prevent multiple Claude spawns
    const isNonInteractive = options.interactive ? 
      false : // If --interactive is explicitly set, use interactive mode
      (options['non-interactive'] !== undefined ? 
        (options['non-interactive'] || options.nonInteractive) : 
        true); // Default to true for MLE-STAR to avoid multiple interactive sessions
    
    const executor = new WorkflowExecutor({
      enableClaude: options.claude !== false, // Default to true for MLE-STAR
      nonInteractive: isNonInteractive,
      outputFormat: options['output-format'] || (isNonInteractive ? 'stream-json' : 'text'),
      maxConcurrency: parseInt(options['max-agents']) || 6,
      timeout: parseInt(options.timeout) || 14400000, // 4 hours for ML workflows
      logLevel: options.quiet ? 'quiet' : (options.verbose ? 'debug' : 'info'),
      workflowName: 'MLE-STAR Machine Learning Engineering Workflow',
      workflowType: 'ml',
      enableChaining: options.chaining !== false // Default to true for stream-json chaining
    });
    
    // Prepare MLE-STAR specific variables
    const variables = {
      dataset_path: datasetPath,
      target_column: targetColumn,
      experiment_name: options.name || `mle-star-${Date.now()}`,
      model_output_dir: options.output || './models/',
      search_iterations: parseInt(options['search-iterations']) || 3,
      refinement_iterations: parseInt(options['refinement-iterations']) || 5,
      ...((options.variables && JSON.parse(options.variables)) || {})
    };
    
    if (options.quiet) {
      console.log(`📊 Running MLE-STAR: ${variables.dataset_path} → ${variables.target_column} (${executor.options.enableClaude ? 'Claude enabled' : 'Simulation'})`);
      console.log();
    } else {
      console.log(`📊 Configuration:`);
      console.log(`  Dataset: ${variables.dataset_path}`);
      console.log(`  Target: ${variables.target_column}`);
      console.log(`  Output: ${variables.model_output_dir}`);
      console.log(`  Claude Integration: ${executor.options.enableClaude ? 'Enabled' : 'Disabled'}`);
      console.log(`  Execution Mode: ${isNonInteractive ? 'Non-interactive (default)' : 'Interactive'}`);
      console.log(`  Stream Chaining: ${executor.options.enableChaining && executor.options.outputFormat === 'stream-json' ? 'Enabled' : 'Disabled'}`);
      console.log();
      
      if (isNonInteractive && options.claude !== false) {
        console.log(`💡 Running in non-interactive mode: Each agent will execute independently`);
        if (executor.options.enableChaining && executor.options.outputFormat === 'stream-json') {
          console.log(`🔗 Stream chaining enabled: Agent outputs will be piped to dependent agents`);
        }
        console.log(`   To use interactive mode instead, add --interactive flag`);
        console.log();
      }
    }
    
    if (!options.claude && !options['no-claude-warning']) {
      printWarning('MLE-STAR works best with Claude integration. Add --claude flag for full automation.');
      console.log('Without Claude, this will simulate the workflow execution.');
      console.log();
    }
    
    // Execute MLE-STAR workflow
    const result = await executor.executeWorkflow(workflowData, variables);
    
    if (result.success) {
      console.log();
      printSuccess('🎉 MLE-STAR workflow completed successfully!');
      console.log(`📊 Results: ${result.completedTasks}/${result.totalTasks} tasks completed`);
      console.log(`⏱️  Duration: ${executor.formatDuration(result.duration)}`);
      console.log(`🆔 Execution ID: ${result.executionId}`);
      
      if (result.results && Object.keys(result.results).length > 0) {
        console.log(`\n📈 Key Results:`);
        Object.entries(result.results).forEach(([taskId, taskResult]) => {
          if (taskResult.output?.status === 'completed') {
            console.log(`  ✅ ${taskId}: Completed successfully`);
          }
        });
      }
      
      console.log(`\n💡 Next Steps:`);
      console.log(`  • Check models in: ${variables.model_output_dir}`);
      console.log(`  • Review experiment: ${variables.experiment_name}`);
      console.log(`  • Validate results with your test data`);
      
    } else {
      printError('❌ MLE-STAR workflow failed');
      console.log(`📊 Progress: ${result.completedTasks}/${result.totalTasks} tasks completed`);
      
      if (result.errors.length > 0) {
        console.log('\n🔍 Errors:');
        result.errors.forEach(error => {
          console.log(`  • ${error.type}: ${error.error}`);
        });
      }
    }
    
    if (options['output-format'] === 'json') {
      console.log('\n' + JSON.stringify(result, null, 2));
    }
    
    // Ensure process exits properly in non-interactive mode
    if (options['non-interactive'] || options.nonInteractive) {
      process.exit(result.success ? 0 : 1);
    }
    
  } catch (error) {
    printError(`MLE-STAR execution failed: ${error.message}`);
    if (options['non-interactive'] || options.nonInteractive) {
      process.exit(1);
    }
  }
}
