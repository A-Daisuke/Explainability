class __C__ {
  async run({ $ }) {
    const {
      fileId,
      filePath,
      name,
      mimeType,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      advanced,
    } = this;

    // Update file content, if set, separately from metadata to prevent
    // multipart upload, which `google-apis-nodejs-client` doesn't seem to
    // support for [files.update](https://bit.ly/3lP5sWn)
    if (filePath) {
      const fileStream = await getFileStream(filePath);
      await this.googleDrive.updateFileMedia(fileId, fileStream, {
        mimeType,
      });
    }

    const resp = await this.googleDrive.updateFile(fileId, {
      name,
      mimeType,
      addParents: addParents?.join(","),
      removeParents: removeParents?.join(","),
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      requestBody: {
        ...advanced,
      },
      fields: "*",
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully updated the file, "${name ? resp.id : resp.name}"`);
    return resp;
  },

}
