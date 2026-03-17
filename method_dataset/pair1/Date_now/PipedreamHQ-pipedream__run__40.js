class __C__ {
  async run() {
    const resp = await this.app.getOutput({ //always there is one last output for an agent
      params: {
        id: this.agentId,
      },
    });
    if (this.getLastContainerId() != resp.containerId ||
      (resp.mostRecentEndedAt && this.getLastUpdated() < resp.mostRecentEndedAt)) {
      this.$emit(
        resp,
        {
          id: resp.mostRecentEndedAt || Date.now(),
          summary: resp.output,
          ts: resp.mostRecentEndedAt || Date.now(),
        },
      );
      this.setLastUpdated(resp.mostRecentEndedAt);
      this.setLastContainerId(resp.containerId);
    }
  },

}
