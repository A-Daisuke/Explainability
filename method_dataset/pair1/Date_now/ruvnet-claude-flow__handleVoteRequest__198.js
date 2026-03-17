function __method_wrapper__() {
  private handleVoteRequest(message: HiveMessage) {
    const { proposal, deadline } = message.payload;

    this.emit('vote:requested', {
      messageId: message.id,
      proposal,
      deadline,
      from: message.from,
    });

    // Set timeout for vote collection
    if (deadline) {
      setTimeout(() => {
        this.collectVotes(message.id);
      }, deadline - Date.now());
    }
  }

}
