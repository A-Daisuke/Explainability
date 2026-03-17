function __method_wrapper__() {
    shouldUpload: ({
      hash,
      contentLength,
    }: {|
      hash: string | null,
      contentLength: number,
    |}) => {
      if (!hash) {
        // No hash, so no content to upload.
        return false;
      }

      if (minimalContentLength && contentLength < minimalContentLength) {
        // The content is too small to be uploaded.
        return false;
      }

      if (
        uploadCacheByHash[hash] &&
        uploadCacheByHash[hash].uploadedAt > Date.now() - 1000 * 60 * 30
      ) {
        // The content was already uploaded recently (and recently enough so that it has not expired in such a short time).
        // We don't need to upload it again.
        return false;
      }

      // The content was not uploaded, or not recently: we'll upload it now.
      return true;
    },

}
