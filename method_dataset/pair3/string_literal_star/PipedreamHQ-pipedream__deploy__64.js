function __method_wrapper__() {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      await this.emitFiles(files);
    },

}
