class __C__ {
    async getAndProcessData() {
      const params: GetTweetParams = {
        $: this,
        tweetId: this.tweetId,
        params: {
          "tweet.fields": this.metricsFields?.join(),
        },
      };

      const data: Tweet = (await this.app.getTweet(params))?.data;
      if (data) {
        const {
          non_public_metrics,
          organic_metrics,
          promoted_metrics,
          public_metrics,
        } = data;

        const stringifiedObj = JSON.stringify({
          non_public_metrics,
          organic_metrics,
          promoted_metrics,
          public_metrics,
        });

        const savedMetrics: string = this.getSavedMetrics();
        if (savedMetrics !== stringifiedObj) {
          const ts = Date.now();
          this.$emit(data, {
            id: ts,
            summary: "New Metrics",
            ts,
          });
          this.setSavedMetrics(stringifiedObj);
        }
      }
    },

}
