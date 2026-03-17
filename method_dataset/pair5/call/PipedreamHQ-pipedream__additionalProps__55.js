class __C__ {
  async additionalProps() {
    const folderProps = await additionalFolderProps.call(this);
    const props = {
      ...folderProps,
    };
    props.fileId = {
      type: "string",
      label: "File ID",
      description: "The unique ID of the file to download.",
      withLabel: true,
      options: async ({ page }) => {
        const num = this.findMaxFolderId(this);
        const limit = this.getLimit();
        const { data } = await this.app.listFiles({
          folderId: num > 0
            ? this[`folderId${num}`]
            : this.folderId,
          filter: "allfiles",
          params: new URLSearchParams({
            "page[limit]": limit,
            "page[offset]": limit * page,
          }).toString(),
        });
        return data.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        }));
      },
    };
    props.fileName = {
      type: "string",
      label: "Filename",
      description: "What to name the new file saved to /tmp directory",
      optional: true,
    };
    return props;
  },

}
