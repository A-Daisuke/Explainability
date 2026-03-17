function __method_wrapper__() {
  detectByzantineBehavior(proposal, voteRecord) {
    const { agentId, vote, confidence } = voteRecord;
    const agent = this.agents.get(agentId);
    
    // Pattern 1: Vote flipping (changing votes frequently)
    const recentVotes = Array.from(this.votingHistory.values())
      .filter(v => v.agentId === agentId && Date.now() - v.timestamp < 3600000) // Last hour
      .slice(-5);
    
    if (recentVotes.length >= 3) {
      const voteChanges = recentVotes.reduce((changes, v, i) => 
        i > 0 && v.vote !== recentVotes[i-1].vote ? changes + 1 : changes, 0);
      
      if (voteChanges >= 2) {
        this.flagByzantineAgent(agentId, 'vote_flipping', proposal.id);
      }
    }

    // Pattern 2: Extremely low confidence with definitive votes
    if (confidence < 0.3 && Math.abs(vote ? 1 : 0) === 1) {
      this.flagByzantineAgent(agentId, 'confidence_mismatch', proposal.id);
    }

    // Pattern 3: Consistent minority voting (contrarian behavior)
    const agentHistory = Array.from(this.votingHistory.values())
      .filter(v => v.agentId === agentId)
      .slice(-10);
    
    if (agentHistory.length >= 5) {
      const minorityVotes = agentHistory.filter(v => {
        const proposalResult = this.proposals.get(v.proposalId);
        return proposalResult && proposalResult.consensus !== v.vote;
      }).length;
      
      if (minorityVotes / agentHistory.length > 0.8) {
        this.flagByzantineAgent(agentId, 'contrarian_pattern', proposal.id);
      }
    }

    // Store vote in history
    this.votingHistory.set(`${proposal.id}:${agentId}`, {
      proposalId: proposal.id,
      agentId,
      vote,
      timestamp: Date.now()
    });
  }

}
