class __C__ {
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Remove old proposals
    for (const [id, proposal] of this.proposals) {
      if (now - proposal.startTime > maxAge && proposal.status === 'finalized') {
        this.proposals.delete(id);
      }
    }
    
    // Remove old voting history
    for (const [key, vote] of this.votingHistory) {
      if (now - vote.timestamp > maxAge) {
        this.votingHistory.delete(key);
      }
    }
    
    this.emit('cleanup:completed', {
      proposalsRemoved: this.proposals.size,
      historyRemoved: this.votingHistory.size
    });
  }

}
