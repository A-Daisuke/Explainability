function __method_wrapper__() {
  private async initiateConsensus(task: Task, decision: QueenDecision): Promise<void> {
    const proposal: ConsensusProposal = {
      id: uuidv4(),
      swarmId: this.config.swarmId,
      taskId: task.id,
      proposal: {
        decision,
        task: task.description,
        rationale: decision.rationale,
      },
      requiredThreshold: 0.66,
      deadline: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };

    await this.db.createConsensusProposal(proposal);

    // Notify all agents to vote
    await this.broadcastConsensusRequest(proposal);
  }

}
