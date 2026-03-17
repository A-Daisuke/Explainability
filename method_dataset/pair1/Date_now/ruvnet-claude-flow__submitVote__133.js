class __C__ {
  async submitVote(proposalId, agentId, vote, reasoning = '') {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== 'active') {
      throw new Error(`Proposal ${proposalId} is no longer active`);
    }

    if (!proposal.eligibleAgents.has(agentId)) {
      throw new Error(`Agent ${agentId} is not eligible to vote on this proposal`);
    }

    if (Date.now() > proposal.deadline) {
      throw new Error(`Voting deadline has passed for proposal ${proposalId}`);
    }

    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not registered`);
    }

    // Record the vote
    const voteRecord = {
      agentId,
      vote: Boolean(vote),
      weight: agent.weight,
      reasoning,
      timestamp: Date.now(),
      confidence: this.calculateVoteConfidence(agent, proposal)
    };

    proposal.votes.set(agentId, voteRecord);
    agent.votescast++;
    agent.lastActivity = Date.now();

    this.emit('vote:submitted', { proposalId, agentId, vote, reasoning });

    // Perform Byzantine detection
    this.detectByzantineBehavior(proposal, voteRecord);

    // Check if we can finalize early
    if (this.canFinalizeEarly(proposal)) {
      return this.finalizeProposal(proposalId);
    }

    return { status: 'recorded', proposal: proposal.id };
  }

}
