function __method_wrapper__() {
      batchResults.forEach((result, index) => {
        const config = batch[index];

        if (result.status === 'fulfilled') {
          agentResults.set(config.agentId, result.value);
          successfulAgents.push(config.agentId);
        } else {
          failedAgents.push(config.agentId);
          agentResults.set(config.agentId, {
            agentId: config.agentId,
            output: '',
            messages: [],
            duration: Date.now() - startTime,
            status: 'failed',
            error: result.reason
          });
        }
      });

}
