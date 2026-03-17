class __C__ {
  async run() {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
    });

    const storedNodes = this._getNodes();

    const nodesIds = nodes.map((node) => node.nodeId);

    for (const storedNode of storedNodes) {
      if (!nodesIds.includes(storedNode.nodeId)) {
        this.$emit(storedNode, {
          id: `${storedNode.networkId} - ${storedNode.nodeId}`,
          summary: `Node ${storedNode.nodeId} left the network ${storedNode.networkId}`,
          ts: Date.now(),
        });
      }
    }

    this._setNodes(nodes);
  },

}
