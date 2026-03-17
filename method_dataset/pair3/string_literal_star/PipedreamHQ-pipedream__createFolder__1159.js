function __method_wrapper__() {
    async createFolder(opts = {}) {
      const {
        name,
        parentId,
        fields = "*",
        ...extraParams
      } = opts;
      return await this.createFile({
        name,
        parentId,
        fields,
        mimeType: `${GOOGLE_DRIVE_FOLDER_MIME_TYPE}`,
        ...extraParams,
      });
    },

}
