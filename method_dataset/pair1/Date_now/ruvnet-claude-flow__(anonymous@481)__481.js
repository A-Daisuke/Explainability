function __method_wrapper__() {
    setInterval(async () => {
      if (!this.isActive) return;

      try {
        const now = Date.now();

        for (const proposal of this.activeProposals.values()) {
          if (proposal.deadline && proposal.deadline.getTime() < now) {
            await this.handleVotingDeadline(proposal.id);
          }
        }
      } catch (error) {
        this.emit('error', error);
      }
    }, 1000); // Every second

}
