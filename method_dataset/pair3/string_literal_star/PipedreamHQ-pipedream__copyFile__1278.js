class __C__ {
    async copyFile(fileId, opts = {}) {
      const {
        fields = "*",
        supportsAllDrives = true,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.copy({
          fileId,
          fields,
          supportsAllDrives,
          ...extraParams,
        })
      ).data;
    },

}
