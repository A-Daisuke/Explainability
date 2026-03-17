function __method_wrapper__() {
  async makeDecision(topic, options, workerVotes = {}) {
    const decision = {
      topic,
      options,
      workerVotes,
      queenVote: this._calculateQueenVote(topic, options, workerVotes),
      timestamp: Date.now(),
    };

    // Calculate final decision with queen's weighted vote
    const finalDecision = this._calculateFinalDecision(decision);

    decision.result = finalDecision;
    this.state.decisionsCount++;

    // Learn from decision
    if (this.config.type === 'adaptive') {
      this._learnFromDecision(decision);
    }

    this.emit('decision:made', decision);
    return decision;
  }

}
