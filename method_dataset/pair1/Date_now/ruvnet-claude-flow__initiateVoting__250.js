function __method_wrapper__() {
  private async initiateVoting(proposal: ConsensusProposal): Promise<void> {
    // Broadcast proposal to all eligible voters
    await this.db.createCommunication({
      from_agent_id: 'consensus-engine',
      to_agent_id: null, // broadcast
      swarm_id: proposal.swarmId,
      message_type: 'consensus',
      content: JSON.stringify({
        type: 'voting_request',
        proposal,
      }),
      priority: 'high',
      requires_response: true,
    });

    // Set up voting deadline monitoring
    if (proposal.deadline) {
      const timeUntilDeadline = proposal.deadline.getTime() - Date.now();

      setTimeout(async () => {
        await this.handleVotingDeadline(proposal.id);
      }, timeUntilDeadline);
    }
  }

}
