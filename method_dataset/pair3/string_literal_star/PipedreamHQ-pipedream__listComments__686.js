function __method_wrapper__() {
    async *listComments(fileId, startModifiedTime = null) {
      let data;
      const drive = this.drive();
      const opts = {
        fileId,
        fields: "*",
        pageSize: 100,
      };

      if (startModifiedTime !== null && startModifiedTime !== undefined) {
        opts.startModifiedTime = new Date(startModifiedTime).toISOString();
      }

      while (true) {
        try {
          ({ data } = await drive.comments.list(opts));
        } catch (error) {
          console.log("listComments error!!", error);
          break;
        }
        const {
          comments = [],
          nextPageToken,
        } = data;

        for (const comment of comments) {
          yield comment;
        }

        if (!nextPageToken) {
          // The 'nextPageToken' field is only returned when there's still
          // comments to be retrieved (i.e. when the end of the list has not
          // been reached yet): https://bit.ly/3w9ru9m
          break;
        }

        opts.pageToken = nextPageToken;
      }
    },

}
