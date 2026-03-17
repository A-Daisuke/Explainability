function __method_wrapper__() {
  async run() {
    const teams = await this.asana.getTeams(this.organization);

    for (const item of teams) {
      const { data: team } = await this.asana.getTeam({
        teamId: item.gid,
      });

      this.$emit(team, {
        id: team.gid,
        summary: team.name,
        ts: Date.now(),
      });
    }
  },

}
