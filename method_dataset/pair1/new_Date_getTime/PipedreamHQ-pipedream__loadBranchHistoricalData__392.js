class __C__ {
    async loadBranchHistoricalData(workspaceId, repositoryId) {
      const branches = await this.getBranches({
        workspaceId,
        repositoryId,
        params: {
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const ts = new Date().getTime();
      return branches.map((branch) => ({
        main: branch.name,
        sub: {
          id: `${branch.name}-${ts}`,
          summary: `New branch ${branch.name} created`,
          ts,
        },
      }));
    },

}
