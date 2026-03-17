class __C__ {
    async getFile(fileId, params = {}) {
      const {
        fields = "*",
        alt,
        ...extraParams
      } = params;
      const drive = this.drive();
      return (
        await drive.files.get({
          fileId,
          fields,
          alt,
          supportsAllDrives: true,
          ...extraParams,
        }, (alt === "media")
          ? {
            responseType: "stream",
          }
          : undefined)
      ).data;
    },

}
