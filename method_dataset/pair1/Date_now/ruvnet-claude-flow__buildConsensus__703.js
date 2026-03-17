class __C__ {
  async buildConsensus(topic, options) {
    const decision = {
      id: `decision-${Date.now()}`,
      swarmId: this.state.swarmId,
      topic,
      options,
      votes: new Map(),
      algorithm: this.config.consensusAlgorithm,
      status: 'voting',
      createdAt: new Date().toISOString(),
    };

    this.state.decisions.set(decision.id, decision);

    // Simulate voting process
    const workers = Array.from(this.state.workers.values());
    const votes = {};

    // Each worker votes
    workers.forEach((worker) => {
      const vote = options[Math.floor(Math.random() * options.length)];
      votes[worker.id] = vote;
      decision.votes.set(worker.id, vote);
    });

    // Queen gets weighted vote
    const queenVote = options[Math.floor(Math.random() * options.length)];
    votes['queen'] = queenVote;
    decision.votes.set('queen', queenVote);

    // Calculate consensus
    const result = this._calculateConsensus(decision);
    decision.result = result.decision;
    decision.confidence = result.confidence;
    decision.status = 'completed';

    // Convert Map to plain object for proper JSON serialization
    const decisionForStorage = {
      ...decision,
      votes: decision.votes instanceof Map ? Object.fromEntries(decision.votes) : decision.votes,
    };

    // Store decision in memory
    await this.mcpWrapper.storeMemory(
      this.state.swarmId,
      `decision-${decision.id}`,
      decisionForStorage,
      'consensus',
    );

    this.emit('decision:reached', decision);
    return decision;
  }

}
