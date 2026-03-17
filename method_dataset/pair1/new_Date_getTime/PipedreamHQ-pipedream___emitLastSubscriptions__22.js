function __method_wrapper__() {
    async _emitLastSubscriptions(maxResults = 50) {
      let nextPageToken;
      do {
        const res = await this.youtubeDataApi.getSubscriptions({
          part: "id,snippet",
          mine: true,
          maxResults,
          pageToken: nextPageToken,
        });
        const items = res.data.items.reverse();
        let lastExecutionDate = this._getLastExecutionDate();

        for (const item of items) {
          const newLastTime = new Date(item.snippet.publishedAt).getTime();

          if (lastExecutionDate > newLastTime) {
            continue;
          }

          this.emitEvent(item);

          if (!lastExecutionDate || (newLastTime > lastExecutionDate)) {
            this._setLastExecutionDate(newLastTime);
            lastExecutionDate = newLastTime;
          }
        }
        nextPageToken = res.data.nextPageToken;
      } while (nextPageToken);
    },

}
