function __method_wrapper__() {
  async run() {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
    });

    for (const node of nodes) {
      const {
        clock,
        lastSeen,
        nodeId,
        name,
        networkId,
      } = node;
      const previousStatus = this._getNodeStatus(nodeId);
      const rightStatus = this.getRightStatus();

      const online = !(lastSeen === 0) && ((clock - lastSeen) < 180000);   //lastSeen === 0 means Zerotier reset api to 0 and indicates device has never connected since

      if (previousStatus == null)
        this._setNodeStatus(nodeId, online);
      else if (online != previousStatus) {
        this._setNodeStatus(nodeId, online);

        if (online === rightStatus) {
          const statusName = rightStatus
            ? "online"
            : "offline";
          this.$emit(node, {
            id: `${networkId} - ${nodeId} - ${clock}`,
            summary: `Node ${nodeId} (${name}) is ${statusName}`,
            ts: Date.now(),
          });
        }
      }
    }
  },

}
