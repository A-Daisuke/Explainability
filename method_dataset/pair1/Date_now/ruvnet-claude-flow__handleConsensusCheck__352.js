function __method_wrapper__() {
  private handleConsensusCheck(message: HiveMessage) {
    const { topic, options } = message.payload;

    // Initiate voting round
    const voteRequest = this.sendMessage({
      from: 'consensus-system',
      to: 'broadcast',
      type: 'vote_request',
      payload: {
        topic,
        options,
        deadline: Date.now() + 30000, // 30 second deadline
      },
      priority: 'urgent',
      requiresResponse: true,
    });

    this.emit('consensus:initiated', {
      topic,
      options,
      requestId: voteRequest.id,
    });
  }

}
