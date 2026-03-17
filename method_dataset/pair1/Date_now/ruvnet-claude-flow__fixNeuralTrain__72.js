export function fixNeuralTrain(args) {
  // Ensure agentId is provided as a string
  if (!args.agentId && !args.agent_id) {
    // Generate a default agent ID if not provided
    args.agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  // Normalize parameter names
  if (args.agent_id && !args.agentId) {
    args.agentId = args.agent_id;
  }

  // Ensure agentId is a string
  if (typeof args.agentId !== 'string') {
    args.agentId = String(args.agentId || '');
  }

  // Set default iterations if not provided
  if (!args.iterations && !args.epochs) {
    args.iterations = 10;
  }

  // Normalize epochs to iterations
  if (args.epochs && !args.iterations) {
    args.iterations = args.epochs;
  }

  return args;
}
