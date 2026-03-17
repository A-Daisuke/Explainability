function __method_wrapper__() {
    async onTimerTrigger() {
      const { repoFullname } = this;
      const timestamp = this._getLastTimestamp();
      const since = new Date(timestamp).toISOString()
        .slice(0, -5) + "Z";
      const sha = this.branch.split("/").pop();
      const items = await this.github.getCommits({
        repoFullname,
        sha,
        since,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = this.shouldEmit();

      items
        .filter(({ sha }) => !savedItems.includes(sha))
        .sort((a, b) => {
          const dateA = new Date(a.commit.author.date);
          const dateB = new Date(b.commit.author.date);
          return dateA - dateB;
        })
        .forEach((item) => {
          const id = item.sha;
          if (shouldEmit) {
            this.emitEvent({
              id,
              item,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
      this._setLastTimestamp(Date.now());
    },

}
