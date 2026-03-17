async function createTask(subArgs, flags) {
  // Use commander for robust argument parsing
  const program = new Command()
    .exitOverride()
    .allowUnknownOption()
    .option('--priority <value>', 'Set task priority (1-10)', '5');

  try {
    // Parse the arguments starting from the create command
    program.parse(subArgs, { from: 'user' });
  } catch (err) {
    // Continue even if commander throws
  }

  const opts = program.opts();
  const args = program.args;

  // Extract task type and description with proper quote handling
  const taskType = args[1]; // First arg after 'create'

  // Join remaining args for description, handling quoted strings properly
  let description = '';
  if (args.length > 2) {
    // If the description starts with a quote, find the matching end quote
    const descriptionArgs = args.slice(2);
    description = parseQuotedDescription(descriptionArgs);
  }

  if (!taskType || !description) {
    printError('Usage: task create <type> "<description>"');
    console.log('Types: research, code, analysis, coordination, general');
    return;
  }

  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const priority = parseInt(opts.priority || '5', 10);

  // Create the task object
  const task = {
    id: taskId,
    type: taskType,
    description: description,
    priority: priority,
    status: 'queued',
    createdAt: Date.now(),
    assignedTo: null,
    progress: 0
  };

  // Store task in tasks directory
  const { promises: fs } = await import('fs');
  const path = await import('path');
  
  // Ensure tasks directory exists
  const tasksDir = '.claude-flow/tasks';
  await fs.mkdir(tasksDir, { recursive: true });
  
  // Save task data
  const taskFile = path.join(tasksDir, `${taskId}.json`);
  await fs.writeFile(taskFile, JSON.stringify(task, null, 2));
  
  // Update task queue file
  const queueFile = '.claude-flow/tasks/queue.json';
  let queue = [];
  try {
    const queueData = await fs.readFile(queueFile, 'utf8');
    queue = JSON.parse(queueData);
  } catch (e) {
    // Queue file doesn't exist yet
  }
  
  // Add task to queue (sorted by priority)
  queue.push(task);
  queue.sort((a, b) => b.priority - a.priority);
  await fs.writeFile(queueFile, JSON.stringify(queue, null, 2));

  printSuccess(`✅ Created ${taskType} task: ${taskId}`);
  console.log(`📋 Description: ${description}`);
  console.log(`⚡ Priority: ${priority}/10`);
  console.log(`🏷️  Type: ${taskType}`);
  console.log(`📅 Status: Queued`);
  console.log(`📁 Location: ${taskFile}`);
  console.log(`\n✅ Task successfully added to queue (${queue.length} total tasks)`);
}
