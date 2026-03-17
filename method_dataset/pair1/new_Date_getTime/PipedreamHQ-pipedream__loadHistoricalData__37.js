class __C__ {
    async loadHistoricalData() {
      const tags = await this.bitbucket.getTags({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const ts = new Date().getTime();
      return tags.map((tag) => ({
        main: tag,
        sub: {
          id: `${tag.name} - ${ts}`,
          summary: `New tag ${tag.name} created`,
          ts,
        },
      }));
    },

}
