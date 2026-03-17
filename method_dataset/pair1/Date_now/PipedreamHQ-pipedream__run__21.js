class __C__ {
  async run() {
    const { data: workspaces } = await this.asana.getWorkspaces();

    for (const item of workspaces) {
      const { data: workspace } = await this.asana.getWorkspace({
        workspaceId: item.gid,
      });

      this.$emit(workspace, {
        id: workspace.gid,
        summary: workspace.name,
        ts: Date.now(),
      });
    }
  },

}
