function __method_wrapper__() {
  private async runSimpleValidation(
    payload: WorkflowHookPayload, 
    context: AgenticHookContext
  ): Promise<SimpleVerificationResult> {
    // Simple validation - check if workflow has state
    if (!payload.state || Object.keys(payload.state).length === 0) {
      return {
        success: false,
        message: 'Workflow completed with empty state',
        details: { state: payload.state }
      };
    }

    // Check for errors in metadata
    if (payload.error) {
      return {
        success: false,
        message: 'Workflow completed with errors',
        details: { error: payload.error }
      };
    }

    return {
      success: true,
      message: 'Post-task validation passed',
      details: { 
        stateKeys: Object.keys(payload.state),
        timestamp: Date.now()
      }
    };
  }

}
