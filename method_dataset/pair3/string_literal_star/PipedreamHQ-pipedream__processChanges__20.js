function __method_wrapper__() {
    async processChanges() {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      const timeString = new Date(lastFileCreatedTime).toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);
      if (!files?.length) {
        return;
      }
      await this.emitFiles(files);
      this._setLastFileCreatedTime(Date.parse(files[0].createdTime));
    },

}
