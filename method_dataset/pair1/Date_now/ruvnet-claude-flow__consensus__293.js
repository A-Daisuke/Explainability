function __method_wrapper__() {
  async consensus(proposal, validators = []) {
    const consensusId = this._generateMessageId();
    const timestamp = Date.now();

    // If no validators specified, use all online agents
    if (validators.length === 0) {
      validators = Array.from(this.state.agents.keys()).filter(
        (id) => this.state.agents.get(id).status === 'online',
      );
    }

    const votes = new Map();
    const votePromises = [];

    // Phase 1: Proposal
    validators.forEach((agentId) => {
      const envelope = {
        id: `${consensusId}-propose-${agentId}`,
        from: 'system',
        to: agentId,
        type: 'consensus',
        timestamp,
        message: {
          phase: 'propose',
          consensusId,
          proposal,
        },
        protocol: PROTOCOLS.consensus,
      };

      this._addToBuffer(envelope);

      // Create promise for vote
      const votePromise = new Promise((resolve) => {
        this.once(`vote:${consensusId}:${agentId}`, (vote) => {
          votes.set(agentId, vote);
          resolve({ agentId, vote });
        });

        // Timeout for vote
        setTimeout(() => {
          if (!votes.has(agentId)) {
            votes.set(agentId, null);
            resolve({ agentId, vote: null });
          }
        }, this.config.timeout);
      });

      votePromises.push(votePromise);
    });

    // Wait for all votes
    await Promise.all(votePromises);

    // Phase 2: Tally and decide
    const voteCount = {};
    let totalVotes = 0;

    votes.forEach((vote) => {
      if (vote !== null) {
        voteCount[vote] = (voteCount[vote] || 0) + 1;
        totalVotes++;
      }
    });

    // Check if consensus reached
    const sortedVotes = Object.entries(voteCount).sort((a, b) => b[1] - a[1]);
    const winner = sortedVotes[0];
    const consensusReached = winner && winner[1] / validators.length >= this.config.consensusQuorum;

    const result = {
      consensusId,
      proposal,
      validators: validators.length,
      votes: Object.fromEntries(votes),
      voteCount,
      winner: consensusReached ? winner[0] : null,
      consensusReached,
      quorum: this.config.consensusQuorum,
      timestamp: Date.now(),
    };

    // Phase 3: Announce result
    this.broadcast(
      {
        phase: 'result',
        consensusId,
        result,
      },
      'consensus',
    );

    this.emit('consensus:completed', result);

    return result;
  }

}
