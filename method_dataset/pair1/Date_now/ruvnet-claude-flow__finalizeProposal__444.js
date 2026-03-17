class __C__ {
  async finalizeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active') {
      return null;
    }

    proposal.status = 'finalized';
    proposal.endTime = Date.now();
    
    // Check quorum
    const participationRate = proposal.votes.size / proposal.eligibleAgents.size;
    proposal.participationRate = participationRate;
    
    if (participationRate < this.config.quorumSize) {
      proposal.result = this.handleInsufficientQuorum(proposal);
    } else {
      proposal.result = this.applyConsensusAlgorithm(proposal);
    }
    
    proposal.consensus = proposal.result.consensus;
    proposal.finalRatio = proposal.result.ratio;
    
    // Update metrics
    if (proposal.consensus) {
      this.metrics.successfulConsensus++;
    } else {
      this.metrics.failedConsensus++;
    }
    
    const votingTime = proposal.endTime - proposal.startTime;
    this.metrics.avgVotingTime = 
      (this.metrics.avgVotingTime * (this.metrics.totalProposals - 1) + votingTime) / 
      this.metrics.totalProposals;
    
    // Update agent reputations
    this.updateAgentReputations(proposal);
    
    this.emit('proposal:finalized', proposal);
    
    return proposal;
  }

}
