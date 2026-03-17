function __method_wrapper__() {
  async getProposalStatus(proposalId: string): Promise<any> {
    const dbProposal = await this.db.getConsensusProposal(proposalId);
    if (!dbProposal) {
      throw new Error('Proposal not found');
    }

    const votes = JSON.parse(dbProposal.votes || '{}');
    const voteCount = Object.keys(votes).length;
    const positiveVotes = Object.values(votes).filter((v: any) => v.vote).length;

    return {
      id: proposalId,
      status: dbProposal.status,
      proposal: JSON.parse(dbProposal.proposal),
      requiredThreshold: dbProposal.required_threshold,
      currentVotes: dbProposal.current_votes,
      totalVoters: dbProposal.total_voters,
      currentRatio: voteCount > 0 ? positiveVotes / voteCount : 0,
      votes: votes,
      deadline: dbProposal.deadline_at,
      timeRemaining: new Date(dbProposal.deadline_at).getTime() - Date.now(),
    };
  }

}
