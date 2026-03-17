class __C__ {
  async createProposal(data) {
    const proposalId = generateId('proposal');
    const proposal = {
      id: proposalId,
      type: data.type || 'general',
      content: data.content,
      threshold: data.threshold || this.config.defaultThreshold,
      algorithm: data.algorithm || 'weighted_majority',
      creator: data.creator,
      requiredCapabilities: data.requiredCapabilities || [],
      metadata: data.metadata || {},
      
      // Voting state
      votes: new Map(),
      eligibleAgents: new Set(),
      startTime: Date.now(),
      deadline: Date.now() + (data.timeout || this.config.votingTimeout),
      status: 'active',
      
      // Results
      result: null,
      finalRatio: 0,
      participationRate: 0,
      consensus: false,
      
      // Byzantine detection
      suspiciousVotes: new Set(),
      consistencyChecks: new Map()
    };

    // Determine eligible agents based on capabilities
    this.determineEligibleAgents(proposal);
    
    this.proposals.set(proposalId, proposal);
    this.metrics.totalProposals++;
    
    this.emit('proposal:created', proposal);
    
    // Set timeout for proposal
    setTimeout(() => this.finalizeProposal(proposalId), proposal.deadline - proposal.startTime);
    
    return proposalId;
  }

}
