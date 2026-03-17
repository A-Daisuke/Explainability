class __C__ {
  async run() {
    const oneDayInSeconds = 24 * 60 * 60; // hours * minutes * seconds
    const oneDayAgo = Math.round((new Date().getTime() / 1000) - oneDayInSeconds);
    const measures = await this.withings.getMeasures({
      params: {
        lastupdate: oneDayAgo,
      },
    });

    for (const measure of measures) {
      this.$emit(measure, {
        id: measure.grpid,
        summary: `New measure ${measure.grpid}`,
        ts: Date.parse(measure.created),
      });
    }
  },

}
